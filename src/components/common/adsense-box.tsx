// 広告コンポーネント

import { globalLayout } from '@/theme/index';
import { Badge, Box } from '@chakra-ui/layout';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';

type LayoutValue = 'responsive' | 'fixed';
type AdsenseProps =
  | {
      slot: string;
      width?: never;
      height?: never;
      layout: 'responsive';
    }
  | {
      slot: string;
      width: number;
      height: number;
      layout?: Exclude<LayoutValue, 'responsive'>;
    };

// https://qiita.com/qrusadorz/items/14972b6e069feaf777a9
export default function AdsenseBox({ slot, width, height, layout }: AdsenseProps) {
  const { asPath } = useRouter();

  useEffect(
    () => {
      // めちゃくちゃ苦労したが、結局useEffectで発火するのが最適解だった
      // これは画面上の広告コンポーネントの数だけ呼ばれる
      if (typeof window !== 'undefined') {
        setTimeout(() => {
          try {
            if (window.adsbygoogle && process.env.NODE_ENV !== 'development') {
              window.adsbygoogle.push({});
            }
          } catch (err) {
            console.error(err);
          }
        }, parseInt(process.env.AD_DELAY ?? '100'));
      }
    },
    [
      /*asPath*/
    ],
  );

  return (
    <Box
      textAlign="center"
      className="adWrapper"
      key={asPath}
      minWidth={`${width ?? 320}px`}
      maxWidth={`${globalLayout.mainWidth}px`}
      mx="auto"
      py={8}
    >
      <Badge mt={2} mb={3}>
        スポンサーリンク
      </Badge>

      {layout == 'responsive' ? (
        <ins
          className="adsbygoogle"
          style={{
            display: 'block',
          }}
          data-ad-client={process.env.GOOGLE_AD_CLIENT}
          data-ad-slot={slot}
          data-ad-format="auto"
          data-full-width-responsive="true"
        ></ins>
      ) : (
        <ins
          className="adsbygoogle"
          style={{
            display: 'inline-block',
            width: `${width ?? 320}px`,
            height: `${height ?? 250}px`,
            marginBottom: '10px',
          }}
          data-ad-client={process.env.GOOGLE_AD_CLIENT}
          data-ad-slot={slot}
        ></ins>
      )}
    </Box>
  );
}
