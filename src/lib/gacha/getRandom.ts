import { Entity, GachaResult } from '@/models/firebase/entities/entity';
import firebaseApi from '@/lib/firebase';
import useSWR from 'swr';
const now = new Date().toUTCString();

import { UserEntity } from '@/models/firebase/users/entities/userentity';
import { User } from '@/models/auth/user';

const userCollection = firebaseApi.firestore().collection('users');

const addEntityToUser = async (uid: User['uid'], entity: Entity) => {
  const userDoc = userCollection.doc(uid);
  const userEntityFields: UserEntity = {
    bedrockId: entity.bedrockId,
    lastUpdate: now,
  };
  const target = userDoc.collection('entities').doc();
  await target
    .set(userEntityFields)
    .then(() => {
      console.debug(`Added entity to user`);
    })
    .catch((e) => console.error(e));
};
const updateJewel = async (uid: User['uid'], jewel: number) => {
  const userDoc = userCollection.doc(uid);

  return await userDoc
    .set(
      {
        jewel: firebaseApi.firestore.FieldValue.increment(-jewel),
      },
      { merge: true },
    )
    .then(() => {
      console.debug(`Decreaded ${jewel} jewel`);
      return true;
    })
    .catch((e) => {
      console.error(`Error decreasing jewel: ${e}`);
      return false;
    });
};
const fetcher = (uid: User['uid'] | null, jewel: number) => {
  // ここでAPIをセルフ参照
  return fetch(`${process.env.HTTPS_URL}/api/entityatsume/random`, {
    method: 'GET',
  }).then((res) => {
    if (res.ok) {
      return res
        .json()
        .then((data) => {
          console.debug('Fetch suceed: ', data);
          if (uid && data.entity) {
            // ジュエルを減算
            updateJewel(uid, jewel).then((success) => {
              if (success && data.entity) {
                addEntityToUser(uid, data.entity);
              }
            });
          }
          return data as GachaResult;
        })
        .catch((e) => console.error(e));
    } else {
      const result: GachaResult = {
        message: res.statusText,
      };
      return result;
    }
  });
};

// これはクライアントで呼ぶ
const getRandom = (uid: User['uid'] | null, jewel: number) => {
  const { data, mutate, error } = useSWR(uid ? 'random' : null, () => fetcher(uid ?? null, jewel), {
    refreshInterval: 0,
    revalidateOnFocus: false,
    revalidateOnMount: false,
    revalidateOnReconnect: false,
    refreshWhenHidden: false,
    refreshWhenOffline: false,
    onError: (err) => {
      alert(err);
      console.error(`Gacha SWR error: ${err}`);
    },
  });

  // 初回ロード時に返すデータ
  if (data == undefined) {
    return {
      randomEntity: undefined,
      prob: undefined,
      mutateEntity: mutate,
      error: JSON.stringify(error),
    };
  } else {
    if (!data.entity) {
      // エンティティが無い時
      return {
        randomEntity: undefined,
        prob: undefined,
        mutateEntity: mutate,
        error: data.message,
      };
    } else {
      return {
        randomEntity: data.entity,
        prob: data.prob ?? 0,
        mutateEntity: mutate,
        error: JSON.stringify(error),
      };
    }
  }
};

export default getRandom;
