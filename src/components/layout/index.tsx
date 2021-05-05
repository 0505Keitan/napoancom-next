import { ReactNode } from 'react';
import { Box, Button } from '@chakra-ui/react';
import LinkChakra from '@/components/common/link-chakra';
import Meta from './meta';
import { Post } from '@/models/contentful/Post';
import { ASIDE_WITDH, LAYOUT_MAXW, LAYOUT_PADDING, MAIN_WIDTH, NAV_HEIGHT } from '@/theme/index';
import Nav from './nav';
import LayoutFooter from './layout-footer';
import { Game } from '@/models/contentful/Game';

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
  games?: Game[];
}

export default function Layout({
  preview,
  children,
  meta,
  revalEnv,
  hideAdsense,
  post,
  games,
}: LayoutProps) {
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
        <Nav games={games} post={post} hideAdsense={hideAdsense ?? false} />

        <Box pt={`${NAV_HEIGHT}px`}>
          <Box
            ml="auto"
            w={{ base: '100vw', lg: `calc(100vw - ${ASIDE_WITDH + LAYOUT_PADDING}px)` }}
          >
            <Box
              as="main"
              mx="auto"
              pt={8}
              pb={8}
              overflowX="hidden"
              w={{ base: 'full', lg: `${MAIN_WIDTH}px` }}
              px={{ base: 3, lg: 0 }}
            >
              {children}
            </Box>
            <LayoutFooter maxW={MAIN_WIDTH} revalidate={revalEnv} />
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
