import Head from 'next/head';
import { SITE_DESC, SITE_NAME } from '@/lib/constants';
import { Post } from '@/models/contentful/Post';
interface Props {
  desc: string;
  title: string;
  heroImageUrl?: string;
  post?: Post;
}

interface JsonLdStep {
  '@type': 'HowToStep';
  name: string;
  url: string;
  text: string;
}

interface PostSchema {}

// https://dev.to/aviaryan/rendering-json-ld-data-in-nextjs-and-reactjs-29op
const generateReviewSchema = (post: Post): PostSchema => {
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
        name: h.name,
        text: h.text,
        // 一応アンカーリンク
        url: `${process.env.HTTPS_URL}/${post.slug}#${h.name.replace(` `, `-`)}`,
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

const generateGraphSchema = (post: Post) => {
  const defaultOgp = process.env.HTTPS_URL + '/api/ogpgen?text=' + encodeURIComponent(post.title);
  return {
    '@context': 'http://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': `${process.env.HTTPS_URL}/#website`,
        url: process.env.HTTPS_URL,
        name: SITE_NAME,
        description: SITE_DESC,
        publisher: {
          '@id': `${process.env.HTTPS_URL}/#organization`,
        },
      },
      {
        '@type': 'Organization',
        '@id': `${process.env.HTTPS_URL}/#organization`,
        name: 'アエルヨネ',
        url: 'https://aely.one/',
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${process.env.HTTPS_URL}/${post.slug}#breadcrumblist`,
        itemListElement: [
          {
            '@type': 'ListItem',
            '@id': `${process.env.HTTPS_URL}/#listItem`,
            position: '1',
            item: {
              '@id': `${process.env.HTTPS_URL}/#item`,
              name: 'ホーム',
              description: SITE_DESC,
              url: process.env.HTTPS_URL,
            },
            nextItem: `${process.env.HTTPS_URL}/${post.slug}/#listItem`,
          },
          {
            '@type': 'ListItem',
            '@id': `${process.env.HTTPS_URL}/${post.slug}/#listItem`,
            position: '2',
            item: {
              '@id': `${process.env.HTTPS_URL}/${post.slug}/#item`,
              name: post.title,
              description: post.description ?? post.title,
              url: `${process.env.HTTPS_URL}/${post.slug}/`,
            },
            previousItem: `${process.env.HTTPS_URL}/#listItem`,
          },
        ],
      },
      {
        '@type': 'Person',
        '@id': `${process.env.HTTPS_URL}/persons/${post.person?.slug}#author`,
        url: `${process.env.HTTPS_URL}/persons/${post.person?.slug}`,
        name: post.person?.displayName,
        image: {
          '@type': 'ImageObject',
          '@id': `${post.person?.picture.url}/#authorImage`,
          url: post.person?.picture.url,
          width: '96',
          height: '96',
          caption: post.person?.displayName,
        },
        sameAs: [post.person?.displayName],
      },
      {
        '@type': 'WebPage',
        '@id': `${process.env.HTTPS_URL}/${post.slug}/#webpage`,
        url: `${process.env.HTTPS_URL}/${post.slug}/`,
        name: post.title,
        description: post.description ?? post.title,
        inLanguage: 'ja',
        isPartOf: {
          '@id': `${process.env.HTTPS_URL}/#website`,
        },
        breadcrumb: {
          '@id': `${process.env.HTTPS_URL}/${post.slug}/#webpage`,
        },
        author: `${process.env.HTTPS_URL}/persons/${post.person?.slug}#author`,
        creator: `${process.env.HTTPS_URL}/persons/${post.person?.slug}#author`,
        image: {
          '@type': 'ImageObject',
          '@id': `${process.env.HTTPS_URL}/#mainImage`,
          url: post.heroImage != undefined ? post.heroImage.url : defaultOgp,
        },
        primaryImageOfPage: {
          '@id': `${process.env.HTTPS_URL}/${post.slug}/#mainImage`,
        },
        datePublished: post.sys.firstPublishedAt,
        dateModified: post.sys.publishedAt,
      },
      {
        '@type': 'BlogPosting',
        '@id': `${process.env.HTTPS_URL}/${post.slug}/#blogposting`,
        name: post.title,
        description: post.description ?? post.title,
        headline: post.title,
        author: {
          '@id': `${process.env.HTTPS_URL}/persons/${post.person?.slug}#author`,
        },
        publisher: {
          '@id': `${process.env.HTTPS_URL}/#organization`,
        },
        datePublished: post.sys.firstPublishedAt,
        dateModified: post.sys.publishedAt,
        articleSection:
          post.platformsCollection != undefined
            ? post.platformsCollection.items[0].displayName
            : '',
        mainEntityOfPage: {
          '@id': `${process.env.HTTPS_URL}/${post.slug}/#webpage`,
        },
        isPartOf: {
          '@id': `${process.env.HTTPS_URL}/${post.slug}/#webpage`,
        },
        image: {
          '@type': 'ImageObject',
          '@id': `${process.env.HTTPS_URL}/${post.slug}/#articleImage`,
          url: post.heroImage != undefined ? post.heroImage.url : defaultOgp,
        },
      },
    ],
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
          // これはレビューがある場合だけ
          <script
            key={`reviewJSON-${post.slug}`}
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(generateReviewSchema(post)) }}
          />
        )}
        {post && (
          // これは全記事で生成
          <script
            key={`graphJSON-${post.slug}`}
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(generateGraphSchema(post)) }}
          />
        )}
      </Head>
    </>
  );
}
