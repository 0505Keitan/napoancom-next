import { Game, GAME_GRAPHQL_FIELDS } from './Game';
import { Person, PERSON_GRAPHQL_FIELDS } from './Person';
import { Platform, PLATFORM_GRAPHQL_FIELDS } from './Platform';
import { Sys } from './Sys';

export interface PostOnlySlug {
  slug: string;
}

interface PostInfo extends PostOnlySlug {
  sys: Sys;
  title: string;
  publishDate: string;
}
const postInfoQuery = `
sys {
  id
  firstPublishedAt
  publishedAt
}
title
slug
publishDate
`;

export interface PostForList extends PostInfo {
  heroImage?: {
    url: string;
  };
}
export const POSTFORLIST_GRAPHQL_FIELDS =
  postInfoQuery +
  `
heroImage {
  url
}
`;

export interface PostForRss extends PostInfo {
  person?: Person;
  description?: string;
}
export const POSTFORRSS_GRAPHQL_FIELDS =
  postInfoQuery +
  `
person {
  ${PERSON_GRAPHQL_FIELDS}
}
description
`;

export interface Post extends PostForRss {
  heroImage?: {
    url: string;
  };
  platformsCollection?: {
    items: Platform[];
  };
  body: string;
  game: Game;
  hideAdsense?: boolean;
}
export const POST_GRAPHQL_FIELDS =
  POSTFORRSS_GRAPHQL_FIELDS +
  `
heroImage {
  url
}
platformsCollection(limit: 5) {
  items {
    ${PLATFORM_GRAPHQL_FIELDS}
  }
}
body
hideAdsense
game {
  ${GAME_GRAPHQL_FIELDS}
}
`;

// これはリッチスニペットのStep用でもある
export interface PostHeadingData {
  name: string;
  text: string;
  level: 1 | 2 | 3 | 4 | 5 | 6;
  // もし見出しの下に画像があれば
  image?: string;
}
export interface PostWithHeading extends Post {
  headings: PostHeadingData[];
  noParagraph: boolean;
}
