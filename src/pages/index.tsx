import ErrorPage from 'next/error';
import { Box, Button } from '@chakra-ui/react';
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
            <Box mb={10}>
              {posts && posts.length > 0 && <PostList mode="archive" posts={posts} />}
              <Button mt={12} h={20} fontSize="xl" w="full" as={LinkChakra} href="/postpage/1/">
                記事一覧へ
              </Button>
            </Box>
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
