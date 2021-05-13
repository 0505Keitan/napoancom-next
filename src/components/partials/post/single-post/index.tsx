import { Box, Button, Divider } from '@chakra-ui/react';
import { Post } from '@/models/contentful/Post';

import LinkChakra from '@/components/common/link-chakra';
import PostBody from './post-body';
import FaiconDiv from '@/components/common/faicon-div';
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
        <Divider my={3} />
        <Box>{post.person && <PersonList persons={[post.person]} />}</Box>

        <Box mt={6}>
          <Button
            w="full"
            aria-label="コメント一覧"
            as={LinkChakra}
            href={`/${post.slug}/comments`}
            colorScheme="orange"
            leftIcon={<FaiconDiv icon={['fas', 'comment-alt']} />}
          >
            コメントを見る
          </Button>
        </Box>

        <Divider my={3} />

        {/* 記事下 */}
        {post.hideAdsense !== true && <AdsenseBox layout="responsive" slot={'1529491287'} />}
      </Box>
    </>
  );
}
