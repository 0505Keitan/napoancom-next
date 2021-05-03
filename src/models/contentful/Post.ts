import { Person } from './Person';
import { Platform } from './Platform';
import { Sys } from './Sys';
import { Game } from './Game';

export interface PostOnlySlug {
  slug: string;
}

interface PostInfo extends PostOnlySlug {
  sys: Sys;
  title: string;
  publishDate: string;
}

export interface PostForList extends PostInfo {
  heroImage?: {
    url: string;
  };
}

export interface PostForRss extends PostInfo {
  person?: Person;
  description?: string;
}
export interface PostHeadingData {
  name: string;
  text: string;
  level: 1 | 2 | 3 | 4 | 5 | 6;
}

export interface Post extends PostForRss {
  heroImage?: {
    url: string;
  };
  platformsCollection?: {
    items: Platform[];
  };
  game?: Game;
  body: string;
  hideAdsense?: boolean;
  headings: PostHeadingData[];
  like: number;
  dislike: number;
  tweetCount?: number;
}
