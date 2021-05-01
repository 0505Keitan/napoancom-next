import { Entity, GachaResult } from '@/models/firebase/entities/entity';
import firebaseApi from '@/lib/firebase';
import useSWR from 'swr';
import { useAuthentication } from '@/hooks/authentication';
import dayjs from 'dayjs';
const now = dayjs().toISOString();
const { user, userData } = useAuthentication();
const userDoc = firebaseApi.firestore().collection('users').doc(user.uid);
import { UserEntity } from '@/models/firebase/users/entities/userentity';
const addEntityToUser = async (entity: Entity) => {
  const userEntityFields: UserEntity = {
    bedrockId: entity.bedrockId,
    lastUpdate: now,
  };
  try {
    await userDoc
      .collection('entities')
      .doc(now)
      .set(userEntityFields)
      .then(() => {
        console.debug(`Added entity to user`);
        return true;
      });
  } catch (e) {
    console.error(e);
    return false;
  }
};
const updateJewel = async (jewel: number) => {
  if (userData.jewel) {
    if (userData.jewel > jewel) {
      await userDoc.set(
        {
          jewel: firebaseApi.firestore.FieldValue.increment(-jewel),
        },
        { merge: true },
      );
      return true;
    } else {
      return false;
    }
  } else {
    return false;
  }
};
const fetcher = () => {
  // ここでAPIをセルフ参照
  return fetch(`${process.env.HTTPS_URL}/api/entityatsume/random`, {
    method: 'GET',
  }).then((res) => {
    return res.json() as GachaResult;
  });
};

// これはクライアントで呼ぶ
const getRandom = (jewel: number) => {
  const { data, mutate, error } = useSWR(
    // カウントを増やしてSWR重複防止
    'random',
    fetcher,
    {
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
    },
  );

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
      updateJewel(jewel).then((enough) => {
        if (enough && data.entity) addEntityToUser(data.entity);
        return {
          randomEntity: undefined,
          prob: undefined,
          mutateEntity: mutate,
          error: 'ジュエルが足りません',
        };
      });

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
