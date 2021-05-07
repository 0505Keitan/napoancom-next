/*

ここでContentfulのデータと、

- Like/Dislike
- ツイート数
- 目次データ

が合成されます。

*/

import * as functions from 'firebase-functions';
import { Post, PostHeadingData, PostWithHeading } from '../../models/contentful/Post';

// MDヘッダー変換機
// import mdToHeadings from './mdToHeadings';
import mdToHeadingsTest from './mdToHeadings/v2';

const postBodyConverter = async ({ post }: { post: Post | null }): Promise<PostWithHeading | null> => {
  if (post) {
    // MarkdownにHTMLの見出しがあれば変換する
    let postBodyConverted = post.body;

    if (post.body.includes('<h2' || '<h3' || '<h4')) {
      functions.logger.debug('Replacing HTML h2/3/4 tag');
      postBodyConverted = post.body
        .replace(/<h2>(.+?)<\/h2>/g, '\n ## $1\n')
        .replace(/<h2 id="(.+?)">(.+?)<\/h2>/g, '\n ## $2\n')
        .replace(/<h3>(.+?)<\/h3>/g, '\n ### $1\n')
        .replace(/<h3 id="(.+?)">(.+?)<\/h3>/g, '\n ### $2\n')
        .replace(/<h4>(.+?)<\/h4>/g, '\n #### $1\n')
        .replace(/<h4 id="(.+?)">(.+?)<\/h4>/g, '\n #### $2\n');
    }
    let headingData: PostHeadingData[] = [];

    // エラーになる恐れもあるので一応async/await
    return await mdToHeadingsTest(postBodyConverted).then((res) => {
      if (res.result.length > 0) {
        headingData = res.result;
        return {
          ...post,
          body: postBodyConverted,
          headings: headingData,
          noParagraph: res.noParagraph,
        };
      } else {
        // あっちでエラー起こった時用
        return {
          ...post,
          body: postBodyConverted,
          headings: [],
          noParagraph: true,
        };
      }
    });
  } else {
    return null;
  }
};

export default postBodyConverter;
