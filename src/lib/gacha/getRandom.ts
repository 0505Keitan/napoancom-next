import { GachaResult } from '@/models/entityatsume/Entity';
import useSWR from 'swr';

// これはクライアントで呼ぶ
const getRandom = (useStaging: boolean) => {
  const { data, mutate, error } = useSWR(
    ['/random', useStaging],
    (path, useStaging) => {
      // ここでAPIをセルフ参照
      return fetch(
        `${process.env.HTTPS_URL}/api/entityatsume/random${useStaging ? '?useStating=true' : ''}`,
        {
          method: 'GET',
        },
      ).then((res) => {
        return res.json() as GachaResult;
      });
    },
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
