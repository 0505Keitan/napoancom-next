import * as functions from 'firebase-functions';
import { AdminConfig } from '../models/AdminConfig';
const adminConfig = functions.config() as AdminConfig;
import * as extracter from './common/extracter';
const TOTAL_LIMIT = parseInt(adminConfig.contentful.limit ?? '1000');
import { fetchGraphQL } from './common/fetch-graphql';

import { POSTFORLIST_GRAPHQL_FIELDS } from '../models/contentful/Post';

const runOpts = {
  timeoutSeconds: 90,
};

const getAllPostsForPlatform = functions.runWith(runOpts).https.onRequest(async (request, response: any) => {
  const secret = request.headers.authorization as string | undefined;

  if (secret !== adminConfig.napoancom.auth) {
    return response.status(401).json({
      message: 'Invalid token',
    });
  }

  if (request.method == 'GET') {
    const maxAge = parseInt(adminConfig.contentful.maxage ?? '3000');
    response.setHeader('Cache-Control', `public, s-maxage=${maxAge}, stale-while-revalidate=86400`);

    const limitQuery = request.query.limit as string | undefined;
    const limit = parseInt(limitQuery ?? TOTAL_LIMIT.toString());

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
      const entries = await fetchGraphQL(
        `query {
          platformCollection(limit: 1, where: {slug: "${slug}"}, order: sys_firstPublishedAt_DESC) {
            items {
              displayName
              linkedFrom {
                blogPostCollection(limit:${limit ?? TOTAL_LIMIT}){
                  items {
                    ${POSTFORLIST_GRAPHQL_FIELDS}
                  }
                }
              }
            }
          }
        }`,
        preview,
      );
      try {
        const result = extracter.extractPostForListsFromPlatform(entries);
        if (result) {
          functions.logger.info(`Successfully fetched ${result.length} entries.`);
          return response.status(200).json(result);
        } else {
          return response.status(404).json({ error: 'Not found' });
        }
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

export default getAllPostsForPlatform;
