import dynamic from 'next/dynamic';
import { ReactNode, useState } from 'react';
import { Box, Button } from '@chakra-ui/react';
import LinkChakra from '@/components/common/link-chakra';
import Meta from './meta';
import { Post } from '@/models/contentful/Post';
import { ASIDE_WITDH, LAYOUT_MAXW, MAIN_WIDTH, NAV_HEIGHT } from '@/theme/index';
const Nav = dynamic(() => import('./nav'));
const LayoutFooter = dynamic(() => import('./layout-footer'));

interface LayoutProps {
  preview: boolean;
  children: ReactNode;
  meta: {
    title: string;
    desc: string;
    ogpUrl?: string;
  };
  revalEnv?: number;
  hideAdsense?: boolean;
  post?: Post;
}

export default function Layout({
  preview,
  children,
  meta,
  revalEnv,
  hideAdsense,
  post,
}: LayoutProps) {
  // サムネ読み込み用
  const [loadedThumb, setLoadedThumb] = useState(false);

  return (
    <>
      {/* OGPの生成 */}
      <Meta
        post={post ?? undefined}
        title={meta.title}
        desc={meta.desc}
        heroImageUrl={meta.ogpUrl}
      />
      <Box
        // Adsenseの制御はsx propで
        sx={
          hideAdsense
            ? {
                '.adsbygoogle': {
                  display: 'none',
                },
                '.google-auto-placed': {
                  display: 'none',
                },
                '.adWrapper': {
                  display: 'none',
                },
              }
            : {}
        }
        w="100vw"
      >
        <Nav post={post} hideAdsense={hideAdsense ?? false} />

        <Box pt={`${NAV_HEIGHT}px`}>
          <Box ml="auto" w={{ base: '100vw', lg: `calc(100vw - ${ASIDE_WITDH}px)` }}>
            <Box
              as="main"
              mx="auto"
              pt={8}
              overflowX="hidden"
              w={{ base: 'full', lg: `${MAIN_WIDTH}px` }}
              px={{ base: 3, lg: 0 }}
            >
              {children}
            </Box>
            <LayoutFooter maxW={LAYOUT_MAXW} revalidate={revalEnv} />
          </Box>
        </Box>

        {preview && (
          <Box zIndex={15} position="fixed" bottom={0} left={0}>
            <Button as={LinkChakra} href="/api/preview?exit=yes">
              プレビュー解除
            </Button>
          </Box>
        )}
      </Box>
    </>
  );
}
