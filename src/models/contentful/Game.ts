import { Sys } from './Sys';

export interface Game {
  sys: Sys;
  slug: string;
  displayName: string;
  description: string;
}
