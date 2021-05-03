import ErrorPage from 'next/error';
import { Box, Button, Divider, VStack } from '@chakra-ui/react';
import { SITE_DESC, SITE_NAME } from '@/lib/constants';
import { Post } from '@/models/contentful/Post';

import Layout from '@/components/layout';

import PostList from '@/components/partials/post';
import LinkChakra from '@/components/common/link-chakra';
import { Game } from '@/models/contentful/Game';
import GameList from '@/components/partials/post/common/game-list';

interface IndexProps {
  posts: Post[];
  environment: boolean;
  allGames: Game[];
}

const Index = ({ posts, environment, allGames }: IndexProps) => {
  return (
    <>
      {!posts ? (
        <Layout preview={false} meta={{ title: '404 Not found', desc: '' }}>
          <ErrorPage title="ページのデータを取得できませんでした" statusCode={404} />
        </Layout>
      ) : (
        <Layout games={allGames} preview={environment} meta={{ title: SITE_NAME, desc: SITE_DESC }}>
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
  let allGames: Game[] = [];
  const allGamesRes = await fetch(`${process.env.API_URL}/contentful-getAllGamesWithSlug`, {
    headers: {
      authorization: process.env.FUNCTION_AUTH ?? '',
    },
  });
  if (allGamesRes.ok) {
    allGames = await allGamesRes.json();
  }
  const revalEnv = parseInt(process.env.REVALIDATE_HOME ?? '1200');

  return {
    props: {
      posts: allPostsForIndex ?? null,
      preview: preview ?? null,
      allGames: allGames,
    },
    revalidate: revalEnv,
  };
}
