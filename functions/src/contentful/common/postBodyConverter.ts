/*

ここでContentfulのデータと、

- Like/Dislike
- ツイート数
- 目次データ

が合成されます。

*/

// import * as functions from 'firebase-functions';
import { Post, PostHeadingData, PostWithHeading } from '../../models/contentful/Post';

// MDヘッダー変換機
// import mdToHeadings from './mdToHeadings';
// import mdToHeadingsV2 from './mdToHeadings/v2';
import mdToHeadingsV3 from './mdToHeadings/v3';

const postBodyConverter = async ({ post }: { post: Post | null }): Promise<PostWithHeading | null> => {
  if (post) {
    // MarkdownにHTMLの見出しがあれば変換する
    const postBodyConverted = post.body
      .replace(/<h2>(.+?)<\/h2>/g, '\n ## $1\n')
      .replace(/<h2 id="(.+?)">(.+?)<\/h2>/g, '\n ## $2\n')
      .replace(/<h3>(.+?)<\/h3>/g, '\n ### $1\n')
      .replace(/<h3 id="(.+?)">(.+?)<\/h3>/g, '\n ### $2\n')
      .replace(/<h4>(.+?)<\/h4>/g, '\n #### $1\n')
      .replace(/<h4 id="(.+?)">(.+?)<\/h4>/g, '\n #### $2\n');

    let headingData: PostHeadingData[] = [];

    // エラーになる恐れもあるので一応async/await
    return await mdToHeadingsV3(postBodyConverted).then((res) => {
      headingData = res.result;
      return {
        ...post,
        body: postBodyConverted,
        headings: headingData,
        noParagraph: res.noParagraph,
      };
    });
  } else {
    return null;
  }
};

export default postBodyConverter;
