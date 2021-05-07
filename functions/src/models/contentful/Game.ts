import { Sys } from './Sys';

export interface Game {
  sys: Sys;
  slug: string;
  displayName: string;
  description: string;
}

export const GAME_GRAPHQL_FIELDS = `
sys {
  id
  firstPublishedAt
  publishedAt
}
slug
displayName
description
`;
