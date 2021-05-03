import { Sys } from './Sys';

export interface Person {
  sys: Sys;
  displayName: string;
  twitterId?: string;
  slug: string;
  description?: string;
  picture: {
    url: string;
  };
}
