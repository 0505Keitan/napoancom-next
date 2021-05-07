import * as functions from 'firebase-functions';
import * as extracter from './common/extracter';
import { AdminConfig } from '../models/AdminConfig';
const adminConfig = functions.config() as AdminConfig;
import { fetchGraphQL } from './common/fetch-graphql';

import { GAME_GRAPHQL_FIELDS } from '../models/contentful/Game';

const getGame = functions.https.onRequest(async (request, response: any) => {
  const secret = request.headers.authorization as string | undefined;

  if (secret !== adminConfig.napoancom.auth) {
    return response.status(401).json({
      message: 'Invalid token',
    });
  }

  if (request.method == 'GET') {
    const maxAge = parseInt(adminConfig.contentful.maxage ?? '3000');
    response.setHeader('Cache-Control', `public, s-maxage=${maxAge}, stale-while-revalidate=86400`);
    const previewQuery = request.query.preview as string | undefined;
    let preview = false;
    if (previewQuery === 'true') {
      preview = true;
    } else {
      preview = false;
    }

    const slug = request.query.slug as string | undefined;

    if (slug == undefined || slug == '') {
      return response.status(500).json({
        error: 'Invalid slug',
      });
    } else {
      const entry = await fetchGraphQL(
        `query {
          gameCollection(where: { slug: "${slug}" }, preview: ${preview ? 'true' : 'false'}, limit: 1) {
            items {
              ${GAME_GRAPHQL_FIELDS}
            }
          }
        }`,
        preview,
      );
      try {
        const result = extracter.extractGame(entry);
        if (result) {
          functions.logger.info(`Successfully fetched ${slug}.`);
          return response.status(200).json(result);
        } else {
          return response.status(404).json({ error: 'Not found' });
        }
      } catch (e) {
        return response.status(500).send(JSON.stringify(e));
      }
    }
  } else {
    return response.status(405).json({
      error: 'Please use GET method',
    });
  }
});

export default getGame;
