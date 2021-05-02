import { JsonLdStep, Post } from '@/models/contentful/Post';

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

export default function BlogPostSchema({ post }: { post: Post }) {
  return (
    <script
      key={`blogPostJSON-${post.slug}`}
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(makePostSchema(post)) }}
    />
  );
}
