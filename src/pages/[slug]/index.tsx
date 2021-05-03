import { SinglePostComponent } from '@/components/partials/post/single-post';
import { Post, PostForList, PostOnlySlug } from '@/models/contentful/Post';
import Layout from '@/components/layout';
import ErrorPage from 'next/error';
import { Box, Button, Center, Divider, Heading } from '@chakra-ui/react';
import Head from 'next/head';
import { useRouter } from 'next/router';

import PostList from '@/components/partials/post';
import LinkChakra from '@/components/common/link-chakra';

interface PostPageProps {
  firstPost: Post;
  morePosts: PostForList[];
  preview: boolean;
  slug: string;
  revalEnv: number;
  foundNormalVer: boolean;
}

export default function PostPage({
  foundNormalVer,
  slug,
  firstPost,
  morePosts,
  preview,
  revalEnv,
}: PostPageProps) {
  const router = useRouter();

  if (router.isFallback) {
    return (
      <Layout preview={preview} meta={{ title: 'ロード中', desc: '' }} hideAdsense={true}>
        <Center py={8}>
          記事を探しています... (初回アクセスの場合はまさに今ページを生成しています！ )
        </Center>
      </Layout>
    );
  } else {
    if (firstPost) {
      return (
        <>
          <Layout
            meta={{
              title: firstPost.title,
              desc: firstPost.description ? firstPost.description : '',
              ogpUrl: firstPost.heroImage && firstPost.heroImage.url,
            }}
            revalEnv={revalEnv}
            preview={preview}
            hideAdsense={firstPost.hideAdsense ?? false}
            post={firstPost}
          >
            <Head>
              <link
                rel="canonical"
                href={`${process.env.HTTPS_URL ?? ''}/${firstPost.slug ?? ''}/`}
              />
            </Head>
            <Box>
              {preview && <Box>デバッグ: プレビューON</Box>}

              {firstPost && <SinglePostComponent post={firstPost} />}

              <Divider my={8} borderColor="gray.400" />
              {morePosts && morePosts.length > 0 && (
                <Box my={10}>
                  <PostList
                    mode="more"
                    posts={morePosts}
                    enableAd={!firstPost.hideAdsense ?? true}
                  />
                </Box>
              )}
            </Box>
          </Layout>
        </>
      );
    } else {
      if (foundNormalVer) {
        if (typeof window !== 'undefined') {
          router.push('https://napoan.com/' + slug);
        }
        return null;
      } else {
        return (
          <Layout preview={false} meta={{ title: '記事が見つかりませんでした', desc: '' }}>
            <ErrorPage title="記事が見つかりませんでした" statusCode={404} />
          </Layout>
        );
      }
    }
  }
}

interface GSProps {
  params: any;
  preview: boolean;
}

const TOTAL_LIMIT = parseInt(process.env.TOTAL_PAGINATION ?? '600');

export async function getStaticProps({ params, preview }: GSProps) {
  if (process.env.API_URL == undefined) {
    // 33m means yellow collor
    console.warn(
      '\x1b[33m',
      `FATAL: API URL environment variable is not set. Data fetching will fail!`,
      '\x1b[0m',
    );
  }
  const postsRes = await fetch(
    `${process.env.API_URL}/contentful-getPostAndMorePosts?preview=${
      preview ? 'true' : 'false'
    }&slug=${params.slug}`,
    {
      headers: {
        authorization: process.env.FUNCTION_AUTH ?? '',
      },
    },
  );
  let posts = [];
  if (postsRes.ok) {
    posts = await postsRes.json();
  } else {
    console.error('Fetch error: ' + postsRes.status + (await JSON.stringify(postsRes.json())));
  }

  const revalEnv = parseInt(process.env.REVALIDATE_SINGLE ?? '3600');

  let foundNormalVer = false;
  if (!posts.post) {
    await fetch(`https://napoan.com/${params.slug}/`).then((res) => {
      // 通常盤が見つかったら
      if (res.ok) {
        foundNormalVer = true;
      } else {
        return {
          notFound: true,
        };
      }
    });
  }

  const pageProps = {
    slug: params.slug,
    preview: preview ?? false,
    firstPost: posts.post ?? null,
    morePosts: posts.morePosts ?? [],
    revalEnv: revalEnv,
    hideAdsense: (posts.post && posts.post.hideAdsense == true) ?? false,
    foundNormalVer,
  };
  if (pageProps.firstPost) {
    console.info(
      `ISR ready for: ${pageProps.firstPost.title} ${
        pageProps.hideAdsense ? '(Ad disabled)' : ''
      } / ${pageProps.firstPost.tweetCount} tweets / ${pageProps.firstPost.like} likes`,
    );
  }
  return { props: pageProps, revalidate: revalEnv };
}

export async function getStaticPaths() {
  const allPostsRes = await fetch(
    `${process.env.API_URL}/contentful-getAllPostsWithSlugOnlySlug?preview=false&limit=${TOTAL_LIMIT}`,
    {
      headers: {
        authorization: process.env.FUNCTION_AUTH ?? '',
      },
    },
  );
  let paths = [];
  if (allPostsRes.ok) {
    const allPosts = await allPostsRes.json();
    paths = allPosts?.map((post: PostOnlySlug) => `/${post.slug}/`) ?? [];
  }

  return {
    paths: paths,
    fallback: true,
  };
}
