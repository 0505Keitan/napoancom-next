import AdsenseBox from '@/components/common/adsense-box';
import { PostForList } from '@/models/contentful/Post';
import { Box, Center, Stack } from '@chakra-ui/react';
import { CompactPost } from './compact-post';

interface MultiPostProps {
  posts: PostForList[];
  mode?: 'archive' | 'more' | 'drawer' | undefined;
}
const MultiPosts = ({ posts, mode }: MultiPostProps) => {
  if (mode == 'archive') {
    return (
      <section>
        <Center flexDirection="column">
          <Stack maxW="100vw" spacing={6}>
            {posts.map((post: PostForList) => (
              <CompactPost key={post.slug} post={post} />
            ))}
          </Stack>
        </Center>
      </section>
    );
  }
  if (mode == 'drawer') {
    return (
      <Stack>
        <Box textStyle="h4" mb={4}>
          <h2>おすすめ記事</h2>
        </Box>
        {posts.map((post) => (
          <CompactPost key={post.slug} post={post} />
        ))}
      </Stack>
    );
  } else {
    return (
      <Box>
        {mode == 'more' && (
          <Box textStyle="h2" mb={4}>
            <h2>おすすめ記事</h2>
          </Box>
        )}
        <Center>
          <Stack spacing={6}>
            {posts.map((post) => (
              <CompactPost key={post.slug} post={post} />
            ))}
          </Stack>
        </Center>
      </Box>
    );
  }
};

interface PostListProps {
  posts: PostForList[];
  mode?: 'archive' | 'more' | 'drawer' | undefined;
  enableAd?: boolean;
}

export const PostList = ({ posts, mode, enableAd }: PostListProps) => {
  return (
    <>
      <MultiPosts mode={mode} posts={posts} />
      {enableAd !== false && <AdsenseBox layout="responsive" slot={'9194360322'} />}
    </>
  );
};

export default PostList;
