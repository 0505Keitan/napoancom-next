import * as functions from 'firebase-functions';
import { AdminConfig } from '../models/AdminConfig';
const adminConfig = functions.config() as AdminConfig;
import * as extracter from './common/extracter';
import { fetchGraphQL } from './common/fetch-graphql';
const TOTAL_LIMIT = parseInt(adminConfig.contentful.limit ?? '1000');
import { POSTFORLIST_GRAPHQL_FIELDS } from '../models/contentful/Post';

const runOpts = {
  timeoutSeconds: 90,
};

// ページネーション用の記事取得
const getAllPostsByRange = functions
  .region('asia-northeast1')
  .runWith(runOpts)
  .https.onRequest(async (request, response: any) => {
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

      const limitQuery = request.query.limit as string | undefined;
      const limit = parseInt(limitQuery ?? TOTAL_LIMIT.toString());

      const skipQuery = request.query.skip as string | undefined;
      const skip = parseInt(skipQuery ?? '0');

      const entries = await fetchGraphQL(
        `query {
          blogPostCollection(skip:${skip ?? 0} ,limit:${
          limit ?? 10
        },where: { slug_exists: true }, order: publishDate_DESC,preview: ${preview ? 'true' : 'false'}) {
            items {
              ${POSTFORLIST_GRAPHQL_FIELDS}
            }
          }
        }`,
        preview,
      );
      try {
        const result = extracter.extractPostForLists(entries);
        functions.logger.info(`Successfully fetched ${result.length} entries.`);
        return response.status(200).json(result);
      } catch (e) {
        return response.status(500).send(e);
      }
    } else {
      return response.status(405).json({
        error: 'Please use GET method',
      });
    }
  });

export default getAllPostsByRange;
