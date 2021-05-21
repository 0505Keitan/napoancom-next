import { Box, Divider } from '@chakra-ui/react';
import { Post } from '@/models/contentful/Post';

import PostBody from './post-body';
import PostHeading from './post-heading';
import AdsenseBox from '@/components/common/adsense-box';
import PersonList from '../common/person-list';

interface Props {
  post: Post;
}

export function SinglePostComponent({ post }: Props) {
  return (
    <>
      <Box as="article">
        <PostHeading post={post} />
        {/* タイトル下 */}
        {post.hideAdsense !== true && <AdsenseBox layout="responsive" slot={'1773582608'} />}
        <Divider my={4} />
        <Box>
          <PostBody source={post.body} />
        </Box>
        <Divider my={6} />
        <Box>{post.person && <PersonList persons={[post.person]} />}</Box>

        {/* 記事下 */}
        {post.hideAdsense !== true && <AdsenseBox layout="responsive" slot={'1529491287'} />}
      </Box>
    </>
  );
}
