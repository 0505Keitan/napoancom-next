/*

ここで「GraphQL APIのレスポンスのJSON」が、「ブログに渡すJSON」に変換されます。
というか、{data}の中身を切り出しているだけです。
エラーハンドリングがかなりガバガバで、ステータスがちゃんと返せてないです

*/

import * as functions from 'firebase-functions';
import { Post, PostForList, PostOnlySlug } from '../../models/contentful/Post';

import { Person } from '../../models/contentful/Person';
import { Platform } from '../../models/contentful/Platform';
import fetchFbdata from './fetch-fbdata';
import { fetchTwitter } from '../../common/fetch-twitter';
import { Game } from '../../models/contentful/Game';

// GraphQL APIの仕様です。エラーまたはデータが返ってきます。
interface FetchResponse {
  errors?: [
    {
      message: string;
      locations?: [
        {
          line: number;
          column: number;
        },
      ];
    },
  ];
  data?: any;
}

// エラーメッセージを合成
const errorThrower = (errors: FetchResponse['errors']) => {
  if (errors) {
    functions.logger.error(JSON.stringify(errors));
    return {
      error: `${errors[0].message}${errors[0].locations ? `/ Locations:${JSON.stringify(errors[0].locations)}` : ``}`,
    };
  } else return { error: 'Unknow error' };
};

export function extractPerson(fetchResponse: FetchResponse) {
  if (fetchResponse.errors) {
    functions.logger.error(errorThrower(fetchResponse.errors));
    throw errorThrower(fetchResponse.errors);
  } else {
    const result = fetchResponse?.data?.personCollection?.items?.[0];
    if (result) return result as Person;
    return null;
  }
}

export function extractPersons(fetchResponse: FetchResponse) {
  if (fetchResponse.errors) {
    throw errorThrower(fetchResponse.errors);
  } else {
    const result = fetchResponse?.data?.personCollection?.items;
    if (result[0]) return result as Person[];
    return null;
  }
}
export function extractPlatform(fetchResponse: FetchResponse) {
  if (fetchResponse.errors) {
    throw errorThrower(fetchResponse.errors);
  } else {
    const result = fetchResponse?.data.platformCollection?.items?.[0];
    if (result) return fetchResponse?.data.platformCollection?.items?.[0] as Platform;
    return null;
  }
}

export function extractPlatforms(fetchResponse: FetchResponse) {
  if (fetchResponse.errors) {
    throw errorThrower(fetchResponse.errors);
  } else {
    const result = fetchResponse?.data.platformCollection?.items;
    if (result[0]) return result as Platform[];
    return null;
  }
}

export function extractGame(fetchResponse: FetchResponse) {
  if (fetchResponse.errors) {
    throw errorThrower(fetchResponse.errors);
  } else {
    const result = fetchResponse?.data.gameCollection?.items?.[0];
    if (result) return result as Game;
    return null;
  }
}
export function extractGames(fetchResponse: FetchResponse) {
  if (fetchResponse.errors) {
    functions.logger.error(errorThrower(fetchResponse.errors));
    throw errorThrower(fetchResponse.errors);
  } else {
    const result = fetchResponse?.data?.gameCollection?.items;
    if (result[0]) return fetchResponse?.data?.gameCollection?.items as Game[];
    return null;
  }
}

export async function extractPost(fetchResponse: FetchResponse) {
  if (fetchResponse.errors) {
    throw errorThrower(fetchResponse.errors);
  } else {
    const fetchedPost = fetchResponse?.data?.blogPostCollection?.items?.[0] as Post;
    if (fetchedPost && fetchedPost?.slug) {
      // 高評価など
      const data = await fetchFbdata(fetchedPost.slug);

      // Twitterデータ
      const tweetMeta = await fetchTwitter(encodeURIComponent(`napoan.com/${fetchedPost.slug}`)).then((result) => {
        return { tweetCount: result.meta.result_count };
      });
      return {
        ...fetchedPost,
        ...data,
        ...tweetMeta,
      };
    } else return null;
  }
}
export function extractPostSlugs(fetchResponse: FetchResponse) {
  if (fetchResponse.errors) {
    throw errorThrower(fetchResponse.errors);
  } else {
    const result = fetchResponse?.data?.blogPostCollection?.items as PostOnlySlug[];

    return result;
  }
}
export function extractPostForLists(fetchResponse: FetchResponse) {
  if (fetchResponse.errors) {
    throw errorThrower(fetchResponse.errors);
  } else {
    const result = fetchResponse?.data?.blogPostCollection?.items as PostForList[];

    return result;
  }
}
export function extractPostsForRss(fetchResponse: FetchResponse) {
  if (fetchResponse.errors) {
    throw errorThrower(fetchResponse.errors);
  } else {
    return fetchResponse?.data?.blogPostCollection?.items;
  }
}

export function extractPostForListsFromPerson(fetchResponse: FetchResponse) {
  if (fetchResponse.errors) {
    throw errorThrower(fetchResponse.errors);
  } else {
    const array = fetchResponse?.data.personCollection.items;

    if (array.length == 0) {
      return null;
    } else {
      return array[0].linkedFrom.blogPostCollection?.items as PostForList[];
    }
  }
}

export function extractPostForListsFromGame(fetchResponse: FetchResponse) {
  if (fetchResponse.errors) {
    throw errorThrower(fetchResponse.errors);
  } else {
    // 重要:「gameCollection.items」が空ならエラーを投げないと虚無を探してしまう
    const array = fetchResponse?.data.gameCollection.items;

    if (array.length == 0) {
      return null;
    } else {
      return array[0].linkedFrom.blogPostCollection?.items as PostForList[];
    }
  }
}

export function extractPostForListsFromPlatform(fetchResponse: FetchResponse) {
  if (fetchResponse.errors) {
    throw errorThrower(fetchResponse.errors ?? fetchResponse);
  } else {
    // 重要:「platformCollection.items」が空ならエラーを投げないと虚無を探してしまう
    const array = fetchResponse?.data.platformCollection?.items;
    if (array.length == 0) {
      return null;
    } else {
      return array[0].linkedFrom.blogPostCollection?.items as PostForList[];
    }
  }
}
