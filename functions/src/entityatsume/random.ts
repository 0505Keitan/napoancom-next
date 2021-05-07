import * as functions from 'firebase-functions';
import { AdminConfig } from '../models/AdminConfig';
import { Entity, GachaResult } from '../models/entities/Entity';
import { COLLECTION_ENTITIES } from '../common/collections';
import { getGroupedEntities, getGachaTable } from './common/getGachaTable';
import selectOneFromTable from './common/selectOneFromTable';
const adminConfig = functions.config() as AdminConfig;

const resultReturn = async (): Promise<GachaResult> => {
  const entities = await COLLECTION_ENTITIES.get().then((snapshot) => {
    if (snapshot.empty) {
      return [];
    } else {
      return snapshot.docs.map((doc) => doc.data() as Entity);
    }
  });
  if (entities.length > 0) {
    const option = getGroupedEntities(entities);
    const table = getGachaTable(option);
    const pickResult = selectOneFromTable(table);

    const result = await COLLECTION_ENTITIES.doc(pickResult[0])
      .get()
      .then((doc) => {
        const data: GachaResult = {
          entity: doc.data() as Entity,
          prob: pickResult[1],
          message: 'Success',
        };
        return data;
      });

    return result;
  } else {
    const data: GachaResult = {
      entity: undefined,
      prob: 0,
      message: 'エンティティが一つも見つかりませんでした',
    };
    return data;
  }
};

const random = functions.https.onRequest(async (request, response: any) => {
  const secret = request.headers.authorization as string | undefined;

  response.setHeader('Cache-Control', `public, s-maxage=0, stale-while-revalidate=0`);

  if (secret !== adminConfig.napoancom.auth) {
    return response.status(401).json({
      message: 'Invalid token',
    });
  } else {
    if (request.method == 'GET') {
      const result = await resultReturn();

      return response.status(200).json(result);
    } else {
      return response.status(405).json({
        message: 'Please use GET method',
      });
    }
  }
});

export default random;
