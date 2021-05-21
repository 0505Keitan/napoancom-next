// ツイッターAPIを叩きます
// keyはfirebaseのconfigで設定しています

import * as functions from 'firebase-functions';
import { AdminConfig } from '../models/AdminConfig';
import { TwitterAPI } from '../models/TwitterAPI';
const adminConfig = functions.config() as AdminConfig;
const fetch = require('node-fetch');

export const fetchTwitter = async (word: string) => {
  const requestOptions: any = {
    method: 'GET',
    redirect: 'follow',
    headers: {
      authorization: `Bearer ${adminConfig.twitter.bearer}`,
    },
  };

  const tweets: TwitterAPI = await fetch(`https://api.twitter.com/2/tweets/search/recent?query=${word}`, requestOptions)
    .then((response: any) => {
      if (response.status != 200) {
        functions.logger.error('TWITTER API RESPONSE IS NOT 200', response);
        return {
          meta: {
            result_count: 0,
          },
          /* ------------------------------------------
          // IMPORTANT: returning blank data
          // TO AVOID API LIMIT WHEN BUILD
          // --------------------------------------------*/
        };
      } else {
        functions.logger.info(`Serched twitter: ${word}`);
        return response.json();
      }
    })
    .catch((error: any) => functions.logger.error(error));

  return tweets;
};
