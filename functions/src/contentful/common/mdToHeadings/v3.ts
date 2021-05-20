import fromMarkdown from 'mdast-util-from-markdown';
import * as functions from 'firebase-functions';
import { Heading, Paragraph } from 'mdast';
import { PostHeadingData } from '../../../models/contentful/Post';

// https://stackoverflow.com/a/20071776
const htmlToText = (html: string) =>
  html
    .replace(/<style([\s\S]*?)<\/style>/gi, '')
    .replace(/<script([\s\S]*?)<\/script>/gi, '')
    .replace(/<\/div>/gi, '')
    .replace(/<\/li>/gi, ',')
    .replace(/<li>/gi, '')
    .replace(/<\/ul>/gi, '')
    .replace(/<\/p>/gi, '')
    .replace(/<br\s*[/]?>/gi, '')
    .replace(/<[^>]+>/gi, '')
    .replace('\n', '');

// MDをリストに変える

const mdToHeadingsV3 = async (md: string): Promise<{ result: PostHeadingData[]; noParagraph: boolean }> => {
  const AST = fromMarkdown(md).children as any[];
  const headingDataArray: PostHeadingData[] = [];
  let noParagraph = false;

  try {
    const filteredHs = AST.filter((item): item is Heading => item.type === 'heading');
    const filteredPs = AST.filter((item): item is Paragraph => item.type === 'paragraph');

    if (filteredHs.length == 0) {
      headingDataArray.push({
        name: '見出しなし',
        text: '見出しを取得できませんでした',
        level: 1,
      });
      noParagraph = true;
    } else {
      // もはやパラグラフがない場合、普通にタイトルだけを返す(時間の無駄なので)
      if (filteredPs.length == 0) {
        noParagraph = true;
        filteredHs.forEach((item) => {
          const headingTitle = item.children[0].value as string;

          headingDataArray.push({
            name: headingTitle,
            text: headingTitle,
            level: item.depth,
          });
        });
      } else {
        AST.map((node: Heading, n) => {
          // nodeがASTのnode

          // とりあえず初期値を決めておく
          let name = '';
          if (node.children && node.children.length > 0) name = (node.children[0].value as string) ?? `見出し${n}`;

          const extractValue = (c: any): string => {
            // パラグラフはこれでだいたい収穫できる
            if (c.children && c.children.length) {
              return c.children[0].value ?? '';
            }
            // type === 'text'の場合
            return c.value ?? name;
          };

          if (node.type === 'heading') {
            // 一応「次の次」も確認
            const newString = () => {
              if (AST[n + 1]) {
                const nextChi = AST[n + 1].children;

                // 重要: HTMLはchildrenではなく直接valueになる
                if (nextChi) {
                  // 次がMDだった
                  if (nextChi[0].type == 'image') {
                    // 次が画像だった
                    const image = nextChi[0].url as string | undefined;
                    return { string: (node.children[0].value as string) ?? name, image: image };
                  }
                  // 画像じゃない
                  const result = nextChi.map((c: any) => {
                    return extractValue(c);
                  });
                  if (result.join('') == '') {
                    return { string: name };
                  } else {
                    return { string: result.join('') as string };
                  }
                } else {
                  // もしHTMLだったら
                  if (AST[n + 1].type == 'html') {
                    return { string: htmlToText(AST[n + 1].value) ?? name };
                  }
                }
              } else {
                return { string: name };
              }
              return { string: name };
            };

            headingDataArray.push({
              name: name,
              level: node.depth ?? 1,
              text: newString().string ?? name,
              image: newString().image,
            });
          }
        });
      }
      return { result: headingDataArray, noParagraph };
    }
  } catch (e) {
    functions.logger.error(e);
  }

  return { result: headingDataArray, noParagraph };
};

export default mdToHeadingsV3;
