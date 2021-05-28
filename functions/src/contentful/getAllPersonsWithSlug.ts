import * as functions from 'firebase-functions';
import { AdminConfig } from '../models/AdminConfig';
const adminConfig = functions.config() as AdminConfig;
import * as extracter from './common/extracter';
import { fetchGraphQL } from './common/fetch-graphql';

import { PERSON_GRAPHQL_FIELDS } from '../models/contentful/Person';

// 全執筆者の取得
const getAllPersonsWithSlug = functions.region('asia-northeast1').https.onRequest(async (request, response: any) => {
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
    const limit = parseInt(limitQuery ?? '25');

    const previewQuery = request.query.preview as string | undefined;
    let preview = false;
    if (previewQuery === 'true') {
      preview = true;
    } else {
      preview = false;
    }

    const entries = await fetchGraphQL(
      `query {
          personCollection(limit: ${limit ?? 5}, where: { slug_exists: true }, order: sys_firstPublishedAt_DESC) {
            items {
              ${PERSON_GRAPHQL_FIELDS}
            }
          }
        }`,
      preview,
    );
    try {
      const result = extracter.extractPersons(entries);
      functions.logger.info(`Successfully fetched persons.`);
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

export default getAllPersonsWithSlug;
