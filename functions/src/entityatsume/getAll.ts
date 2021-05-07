import * as functions from 'firebase-functions';
import { AdminConfig } from '../models/AdminConfig';
import { Entity, EntitiesResult } from '../models/entities/Entity';
import { COLLECTION_ENTITIES } from '../common/collections';
const adminConfig = functions.config() as AdminConfig;

const getAll = functions.https.onRequest(async (request, response: any) => {
  const secret = request.headers.authorization as string | undefined;

  if (secret !== adminConfig.napoancom.auth) {
    return response.status(401).json({
      message: 'Invalid token',
    });
  }

  if (request.method == 'GET') {
    const maxAge = parseInt(adminConfig.contentful.maxage ?? '3000');
    response.setHeader('Cache-Control', `public, s-maxage=${maxAge}, stale-while-revalidate=86400`);

    try {
      const entities = await COLLECTION_ENTITIES.get().then((snapshot) => {
        return snapshot.docs.map((doc) => doc.data() as Entity);
      });
      // バックエンドではメッセージ絶対返す
      const result: EntitiesResult = {
        entities: entities,
        message: 'Success',
      };
      return response.status(200).json(result);
    } catch (e) {
      return response.status(500).json({
        message: e,
      });
    }
  } else {
    return response.status(405).json({
      message: 'Please use GET method',
    });
  }
});

export default getAll;
