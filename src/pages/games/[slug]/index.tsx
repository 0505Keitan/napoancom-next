import ErrorPage from 'next/error';
import Layout from '@/components/layout';
import { Game } from '@/models/contentful/Game';
import { Box } from '@chakra-ui/react';
import { PostForList } from '@/models/contentful/Post';
import PostList from '@/components/partials/post';

interface IndexProps {
  game: Game;
  preview: boolean;
  posts: PostForList[];
}

const TOTAL_LIMIT = 11;

const gameIndex = ({ game, preview, posts }: IndexProps) => {
  return (
    <>
      {!game ? (
        <>
          <Layout preview={preview} meta={{ title: '404 Not found', desc: '' }} hideAdsense={true}>
            <ErrorPage title="ページが見つかりませんでした" statusCode={404} />
          </Layout>
        </>
      ) : (
        <Layout
          preview={preview}
          meta={{
            title: `${game.displayName}の記事一覧`,
            desc: game.description ?? '説明文がありません。',
          }}
          hideAdsense={true}
        >
          <Box mb={16}>
            <Box textStyle="h1" mb={8}>
              <h1>{game.displayName}の記事一覧</h1>
            </Box>
            <Box my={4}>{game.description ?? '説明文がありません。'}</Box>
          </Box>
          <Box textStyle="h2" mb={8}>
            <h2>
              {posts[0]
                ? `${game.displayName}の記事一覧 最新${posts.length}件`
                : `${game.displayName}の記事はありません`}
            </h2>
          </Box>
          {posts && posts.length > 0 && <PostList mode="archive" posts={posts} />}
        </Layout>
      )}
    </>
  );
};

export default gameIndex;

interface GSProps {
  params: any;
  preview: boolean;
}

export async function getStaticProps({ params, preview = false }: GSProps) {
  const slug = params.slug ?? '';
  let gameData = undefined;
  let posts = [];

  const gameDataRes = await fetch(
    `${process.env.API_URL}/contentful-getGame?slug=${slug}&preview=${preview ? 'true' : 'false'}`,
    {
      headers: {
        authorization: process.env.FUNCTION_AUTH ?? '',
      },
    },
  );
  if (gameDataRes.ok) {
    gameData = await gameDataRes.json();
  }
  if (gameData) {
    const postsRes = await fetch(
      `${process.env.API_URL}/contentful-getAllPostsForGame?slug=${gameData.slug}&preview=${
        preview ? 'true' : 'false'
      }&limit=${TOTAL_LIMIT}`,
      {
        headers: {
          authorization: process.env.FUNCTION_AUTH ?? '',
        },
      },
    );
    if (postsRes.ok) {
      posts = await postsRes.json();
    }
  }
  return {
    props: {
      game: gameData ?? null,
      posts: posts ?? null,
      preview: preview,
    },
    revalidate: 300,
  };
}

export async function getStaticPaths() {
  let allGames = [];
  const allGamesRes = await fetch(`${process.env.API_URL}/contentful-getAllGamesWithSlug`, {
    headers: {
      authorization: process.env.FUNCTION_AUTH ?? '',
    },
  });
  if (allGamesRes.ok) {
    allGames = await allGamesRes.json();
  }
  return {
    paths: allGames?.map((game: Game) => `/games/${game.slug}`) || [],
    fallback: true,
  };
}
