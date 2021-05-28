import * as functions from 'firebase-functions';
import * as extracter from './common/extracter';
import { AdminConfig } from '../models/AdminConfig';
const adminConfig = functions.config() as AdminConfig;
import { fetchGraphQL } from './common/fetch-graphql';

import { POST_GRAPHQL_FIELDS } from '../models/contentful/Post';

// いかなる状況でも下書き記事を返す
const getPreviewPost = functions.region('asia-northeast1').https.onRequest(async (request, response: any) => {
  const secret = request.headers.authorization as string | undefined;

  if (secret !== adminConfig.napoancom.auth) {
    return response.status(401).json({
      message: 'Invalid token',
    });
  }

  if (request.method == 'GET') {
    const maxAge = parseInt(adminConfig.contentful.maxage ?? '3000');
    response.setHeader('Cache-Control', `public, s-maxage=${maxAge}, stale-while-revalidate=86400`);
    const slug = request.query.slug as string | undefined;

    if (slug == undefined || slug == '') {
      return response.status(500).json({
        error: 'Invalid slug',
      });
    } else {
      const entry = await fetchGraphQL(
        `query {
          blogPostCollection(where: { slug: "${slug}" }, preview: true, limit: 1) {
            items {
              ${POST_GRAPHQL_FIELDS}
            }
          }
        }`,
        true,
      );
      try {
        const post = await extracter.extractPost(entry);
        functions.logger.info(`Successfully fetched ${slug}.`);
        return response.status(200).json(post);
      } catch (e) {
        return response.status(500).send(e);
      }
    }
  } else {
    return response.status(405).json({
      error: 'Please use GET method',
    });
  }
});

export default getPreviewPost;
