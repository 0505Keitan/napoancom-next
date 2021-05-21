import ErrorPage from 'next/error';
import { Box, Button, Flex, Heading, Stack } from '@chakra-ui/react';
import { SITE_DESC, SITE_NAME } from '@/lib/constants';
import { PostForList } from '@/models/contentful/Post';

import Layout from '@/components/layout';

import PostList from '@/components/partials/post';
import LinkChakra from '@/components/common/link-chakra';

interface IndexProps {
  posts: PostForList[];
  environment: boolean;
}

const Index = ({ posts, environment }: IndexProps) => {
  return (
    <>
      {!posts ? (
        <Layout preview={false} meta={{ title: '404 Not found', desc: '' }}>
          <ErrorPage title="ページのデータを取得できませんでした" statusCode={404} />
        </Layout>
      ) : (
        <Layout preview={environment} meta={{ title: SITE_NAME, desc: SITE_DESC }}>
          {posts && (
            <Stack mb={10} spacing={6}>
              <Stack spacing={3}>
                <Heading as="h1" textStyle="h1">
                  {SITE_NAME}
                </Heading>
                <Box>{SITE_DESC}</Box>
              </Stack>
              {posts && posts.length > 0 && <PostList mode="archive" posts={posts} />}

              {/* ここは横並び */}
              <Flex gridGap={4} flexDirection={{ base: 'column', sm: 'row' }}>
                <Button flexGrow={2} fontSize="xl" as={LinkChakra} href="/postpage/1/">
                  記事一覧へ
                </Button>
                <Button colorScheme="orange" flexGrow={1} fontSize="xl" as="a" href="/feed">
                  RSS
                </Button>
                <Button colorScheme="teal" flexGrow={1} fontSize="xl" as="a" href="/sitemap.xml">
                  Sitemap
                </Button>
              </Flex>
            </Stack>
          )}
        </Layout>
      )}
    </>
  );
};

export default Index;

const PER_PAGE = parseInt(process.env.PAGINATION ?? '10');

export async function getStaticProps({ preview = false }) {
  let allPostsForIndex = [];
  const allPostsForIndexRes = await fetch(
    `${process.env.API_URL}/contentful-getAllPostsByRange?skip=0&limit=${PER_PAGE}`,
    {
      headers: {
        authorization: process.env.FUNCTION_AUTH ?? '',
      },
    },
  );
  if (allPostsForIndexRes.ok) {
    allPostsForIndex = await allPostsForIndexRes.json();
  }

  const revalEnv = parseInt(process.env.REVALIDATE_HOME ?? '1200');

  return {
    props: {
      posts: allPostsForIndex ?? null,
      preview: preview ?? null,
    },
    revalidate: revalEnv,
  };
}
