import fromMarkdown from 'mdast-util-from-markdown';

import { Content, Heading } from 'mdast';
import { PostHeadingData } from '../../../models/contentful/Post';

// MDをリストに変える
// 参考: https://github.com/kyoncy/react-markdown-heading

const pickHeadingFromAST = (markdownAst: Content[]): Heading[] => {
  const filteredAst = markdownAst.filter((item): item is Heading => item.type === 'heading');
  return filteredAst;
};

const mdToHeadings = (md: string): PostHeadingData[] => {
  const AST = fromMarkdown(md).children;
  const headingAst = pickHeadingFromAST(AST);
  let headingTitle: string;
  const headingList: PostHeadingData[] = [];

  headingAst.forEach((item) => {
    headingTitle = item.children[0].value as string;

    // ASTに見出し以外の本文テキストを入れるのは難しいので、とりあえずtextも同じものを返す
    // levelは見出しの深さ
    headingList.push({
      name: headingTitle,
      text: headingTitle,
      level: item.depth,
    });
  });

  // 見出しがないなら[]が返る
  return headingList;
};

export default mdToHeadings;
