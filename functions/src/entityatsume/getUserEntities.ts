import * as functions from 'firebase-functions';
import { AdminConfig } from '../models/AdminConfig';
import { Entity } from '../models/entities/Entity';
import { COLLECTION_ENTITIES, COLLECTION_USERS } from '../common/collections';
import { UserEntity } from '../models/users/entities/UserEntity';
import { UserDoc, UserResult } from '../models/users/UserDoc';
const adminConfig = functions.config() as AdminConfig;

const getEntitiesByIds = async (ids: string[]) => {
  return Promise.all(
    ids.map(async (id) => {
      return COLLECTION_ENTITIES.doc(id)
        .get()
        .then((doc) => {
          return doc.data() as Entity;
        });
    }),
  ).then((entities) => {
    return entities;
  });
};

const getUserEntities = functions.https.onRequest(async (request, response: any) => {
  const secret = request.headers.authorization as string | undefined;

  const userQuery = request.query.user as string | undefined;

  if (secret !== adminConfig.napoancom.auth) {
    return response.status(401).json({
      message: 'Invalid token',
    });
  }

  if (request.method == 'GET') {
    if (userQuery) {
      const userDoc = COLLECTION_USERS.doc(userQuery);
      userDoc.get().then(async (doc) => {
        const userData = doc.data() as UserDoc;
        if (doc.exists) {
          const ids = await userDoc
            .collection('entities')
            .get()
            .then((snapshot) =>
              snapshot.docs.map((d) => {
                const data = d.data() as UserEntity;
                return data.bedrockId;
              }),
            );

          return await getEntitiesByIds(ids).then((entities) => {
            // バックエンドではメッセージを絶対返す
            const result: UserResult = {
              entities: entities,
              jewel: userData.jewel,
              message: 'Success',
            };
            return response.status(200).json(result);
          });
        } else {
          return response.status(404).json({ message: 'User not found' });
        }
      });
    } else {
      return response.status(500).json({
        message: 'Invalid user id',
      });
    }
  } else {
    return response.status(405).json({
      message: 'Please use GET method',
    });
  }
});
export default getUserEntities;
