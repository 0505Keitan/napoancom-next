/*

APIキーとプレビューを切り替えます

*/

import * as functions from 'firebase-functions';
import { AdminConfig } from '../../models/AdminConfig';
const adminConfig = functions.config() as AdminConfig;
const fetch = require('node-fetch');

export const fetchGraphQL = async (query: any, preview = false) => {
  return fetch(`https://graphql.contentful.com/content/v1/spaces/${adminConfig.contentful.space}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${preview ? adminConfig.contentful.preview : adminConfig.contentful.public}`,
    },
    body: JSON.stringify({ query }),
  })
    .then((response: any) => response.json())
    .catch((e: any) => console.error(e));
};
