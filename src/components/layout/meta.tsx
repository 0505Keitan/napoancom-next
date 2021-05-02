import Head from 'next/head';
import { SITE_NAME } from '@/lib/constants';
import BlogPostSchema from './json-ld/blogPost-schema';
import { Post } from '@/models/contentful/Post';
interface Props {
  desc: string;
  title: string;
  heroImageUrl?: string;
  post?: Post;
}

function trimText(text: string) {
  const body = text.trim().replace(/[ \r\n]/g, '');
  if (body.length < 140) {
    return body;
  }
  return body.substring(0, 140) + '...';
}

export default function Meta({ desc, title, heroImageUrl, post }: Props) {
  const ogpUrl =
    heroImageUrl ??
    process.env.HTTPS_URL + '/api/ogpgen/?text=' + encodeURIComponent(trimText(title));

  // レビューがないならJSONを生成しない
  let validReview = false;
  if (post) validReview = post?.like + post?.dislike > 0;
  return (
    <Head>
      <meta charSet="utf-8" />
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      <link rel="apple-touch-icon" sizes="180x180" href="/icon-180x.png" />
      <link rel="icon" type="image/png" href="/icon.png" />
      <link rel="manifest" href="/site.webmanifest" />
      <meta name="msapplication-TileColor" content="#ffffff" />
      <meta name="theme-color" content="#2687e8"></meta>
      <meta property="og:title" key="ogTItle" content={title} />
      <meta property="og:site_name" key="ogSiteName" content={title} />
      <meta property="og:description" key="ogDescription" content={desc} />
      <meta name="description" content={desc} />

      <meta property="og:image" content={ogpUrl} />
      <meta property="og:image" key="ogImage" content={ogpUrl} />
      <meta name="twitter:card" key="twitterCard" content="summary_large_image" />
      <meta name="twitter:image" key="twitterImage" content={ogpUrl} />

      <title>{title == SITE_NAME ? SITE_NAME : title + ' | ' + SITE_NAME}</title>

      {validReview && post && <BlogPostSchema post={post} />}
    </Head>
  );
}
