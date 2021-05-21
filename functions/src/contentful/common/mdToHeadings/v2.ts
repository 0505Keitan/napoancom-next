// 今は使ってません
// 一番複雑なバージョン

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

const mdToHeadingsV2 = async (md: string): Promise<{ result: PostHeadingData[]; noParagraph: boolean }> => {
  const AST = fromMarkdown(md).children as any[];
  const headingDataArray: PostHeadingData[] = [];
  let noParagraph = false;

  try {
    const filteredHs = AST.filter((item): item is Heading => item.type === 'heading');
    const filteredPs = AST.filter((item): item is Paragraph => item.type === 'paragraph');

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
        if (node.children && node.children.length > 0) name = (node.children[0].value as string) ?? '';

        const extractValue = (c: any): string => {
          // パラグラフはこれでだいたい収穫できる
          if (c.children && c.children.length) {
            return c.children[0].value ?? c.children[0].children[0].value ?? JSON.stringify(c);
          }
          // type === 'text'の場合
          return c.value ?? name;
        };

        const newString = (): { string?: string; image?: string } => {
          if (node.type === 'heading') {
            // 一応「次の次」も確認
            if (AST[n + 1]) {
              const nextChi = AST[n + 1].children;

              // 重要: HTMLはchildrenではなく直接valueになる
              if (nextChi) {
                // 次がMDだった
                if (nextChi[0].type == 'image') {
                  // 次が画像だった
                  const image = nextChi[0].url as string | undefined;

                  if (AST[n + 2]) {
                    const nextChi2 = AST[n + 2].children;
                    // 「次の次」を見る
                    if (nextChi2) {
                      const result = nextChi2.map((c: any) => {
                        if (typeof extractValue(c) == 'string') return extractValue(c);
                        return JSON.stringify(extractValue(c));
                      });
                      return { string: result.join('') as string, image: image };
                    } else {
                      // もしHTMLだったら
                      return { string: htmlToText(AST[n + 2].value) ?? name, image: image };
                    }
                  }
                  // 次の次がない
                  return { string: (node.children[0].value as string) ?? '', image: image };
                }
                // 画像じゃない
                const result = nextChi.map((c: any) => {
                  return extractValue(c);
                });
                if (result.join('') == '') {
                  return { string: (nextChi[0].value as string) ?? (node.children[0].value as string) ?? '' };
                } else {
                  return { string: result.join('') as string };
                }
              } else {
                // もしHTMLだったら
                if (AST[n + 1].type == 'html') {
                  return { string: htmlToText(AST[n + 1].value) ?? name };
                }
              }
            }

            return { string: name };
          } else {
            // まず見出しじゃない
            return { string: undefined };
          }
        };

        if (!newString().string) {
          // 何も捕獲できないならなし！
        } else {
          headingDataArray.push({
            name: name,
            level: node.depth ?? 0,
            text: newString().string ?? name,
            image: newString().image,
          });
        }
      });
    }
    return { result: headingDataArray, noParagraph };
  } catch (e) {
    functions.logger.error(e);
  }

  return { result: headingDataArray, noParagraph };
};

export default mdToHeadingsV2;
