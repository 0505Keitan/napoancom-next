import { Post } from './Post';

export interface Series {
  slug: string;
  postsCollection: {
    items: Post[];
  };
}
