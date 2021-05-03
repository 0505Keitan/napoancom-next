import { Icon } from './Icon';
import { Sys } from './Sys';

export interface Platform {
  sys: Sys;
  displayName: string;
  slug: string;
  bgColor?: string; // for chakra UI
  description?: string | null;
  icon?: Icon | null;
}
