import Head from 'next/head';
import { SITE_NAME } from '@/lib/constants';
import { JsonLdStep, Post } from '@/models/contentful/Post';
interface Props {
  desc: string;
  title: string;
  heroImageUrl?: string;
  post?: Post;
}

// https://dev.to/aviaryan/rendering-json-ld-data-in-nextjs-and-reactjs-29op
const makePostSchema = (post: Post) => {
  let sum = post.like + post.dislike;
  let ratio: number;
  // 擬似的に五段階評価っぽくする
  ratio = (post.like / sum) * 5;

  const defaultOgp = process.env.HTTPS_URL + '/api/ogpgen?text=' + encodeURIComponent(post.title);

  const supplies = post.platformsCollection?.items.map((pl) => {
    return {
      '@type': 'HowToSupply',
      name: pl.displayName,
    };
  });

  // ISO8601
  const totalTime = (body: string) => `PT${Math.round(body.length / 400)}M`;

  /* HowToのステップを定義する
  https://developers.google.com/search/docs/data-types/how-to
  APIから見出しが送られてくるのでそれを解析
  */
  let steps: JsonLdStep[] = [];
  if (post.headings) {
    steps = post.headings.map((h) => {
      return {
        // この「h」の中身(text/name)はAPIが作ってくれる
        ...h,
        '@type': 'HowToStep',
      };
    });
  }

  return {
    // schema truncated for brevity
    '@context': 'http://schema.org',
    '@type': 'AggregateRating',
    itemReviewed: {
      '@type': 'HowTo',
      name: post.title,
      description: post.description ?? post.title,
      image: {
        '@type': 'ImageObject',
        url: post.heroImage != undefined ? post.heroImage.url : defaultOgp,
        height: '650',
        width: '365',
      },
      supply: supplies,
      totalTime: totalTime(post.body),
      step: steps,
    },
    ratingValue: ratio ?? 0,
    bestRating: '5',
    worstRating: '0',
    ratingCount: sum ?? 1,
  };
};

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
    <>
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
        {validReview && post && (
          <script
            key={`blogPostJSON-${post.slug}`}
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(makePostSchema(post)) }}
          />
        )}
      </Head>
    </>
  );
}
