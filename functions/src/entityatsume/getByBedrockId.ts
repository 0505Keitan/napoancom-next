import * as functions from 'firebase-functions';
import { AdminConfig } from '../models/AdminConfig';
import { Entity, EntityResult } from '../models/entities/Entity';
import { COLLECTION_ENTITIES } from '../common/collections';
const adminConfig = functions.config() as AdminConfig;

const getByBedrockId = functions.https.onRequest(async (request, response: any) => {
  const secret = request.headers.authorization as string | undefined;

  const bedrockIdQuery = request.query.bedrockId as string | undefined;

  if (secret !== adminConfig.napoancom.auth) {
    return response.status(401).json({
      message: 'Invalid token',
    });
  }

  if (request.method == 'GET') {
    if (bedrockIdQuery) {
      COLLECTION_ENTITIES.doc(bedrockIdQuery)
        .get()
        .then((doc) => {
          if (doc.exists) {
            const entity = doc.data() as Entity;
            // バックエンドではメッセージを絶対返す
            const result: EntityResult = {
              entity: entity,
              message: 'Success',
            };
            return response.status(200).json(result);
          } else {
            return response.status(404).json({ message: 'Entity not found' });
          }
        });
    } else {
      return response.status(500).json({
        message: 'Invalid bedrockId',
      });
    }
  } else {
    return response.status(405).json({
      message: 'Please use GET method',
    });
  }
});
export default getByBedrockId;
