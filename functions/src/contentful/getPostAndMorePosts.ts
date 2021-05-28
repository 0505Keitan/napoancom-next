import * as functions from 'firebase-functions';
import { AdminConfig } from '../models/AdminConfig';
const adminConfig = functions.config() as AdminConfig;
import * as extracter from './common/extracter';
import { fetchGraphQL } from './common/fetch-graphql';

import { POST_GRAPHQL_FIELDS, POSTFORLIST_GRAPHQL_FIELDS } from '../models/contentful/Post';
import postBodyConverter from './common/postBodyConverter';

// 最重要。スラッグから記事を取得
const getPostAndMorePosts = functions.region('asia-northeast1').https.onRequest(async (request, response: any) => {
  const secret = request.headers.authorization as string | undefined;

  if (secret !== adminConfig.napoancom.auth) {
    return response.status(401).json({
      message: 'Invalid token',
    });
  }

  if (request.method == 'GET') {
    const maxAge = parseInt(adminConfig.contentful.maxage ?? '3000');
    response.setHeader('Cache-Control', `public, s-maxage=${maxAge}, stale-while-revalidate=86400`);

    const previewQuery = request.query.preview as string | undefined;
    const slug = request.query.slug as string | undefined;
    let preview = false;
    if (previewQuery === 'true') {
      preview = true;
    } else {
      preview = false;
    }

    if (slug == undefined || slug == '') {
      return response.status(500).json({
        error: 'Invalid slug',
      });
    } else {
      const entry = await fetchGraphQL(
        `query {
      blogPostCollection(where: { slug: "${slug}" }, preview: ${preview ? 'true' : 'false'}, limit: 1) {
        items {
          ${POST_GRAPHQL_FIELDS}
        }
      }
    }`,
        preview,
      );

      // 300を上限にスキップしてランダムな記事をおすすめに
      const randomSkipMax = 300;
      const randomSkip = Math.round(Math.random() * randomSkipMax);

      const entries = await fetchGraphQL(
        `query {
      blogPostCollection(skip:${randomSkip} ,where: { slug_not_in: "${slug}" }, order: publishDate_DESC, preview: ${
          preview ? 'true' : 'false'
        }, limit: 2) {
        items {
          ${POSTFORLIST_GRAPHQL_FIELDS}
        }
      }
    }`,
        preview,
      );
      try {
        const post = await extracter.extractPost(entry);
        if (post) {
          functions.logger.info(`Successfully fetched ${slug}.`);
          return response.status(200).json({
            post: await postBodyConverter({ post: post }),
            morePosts: extracter.extractPostForLists(entries),
          });
        } else {
          return response.status(404).json({ error: 'Not found' });
        }
      } catch (e) {
        return response.status(500).send(e);
      }
    }
  } else {
    return response.status(405).json({
      error: 'Please use GET method',
    });
  }
});

export default getPostAndMorePosts;
