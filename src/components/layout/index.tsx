import { ReactNode } from 'react';
import { Box, Button, Flex, Stack } from '@chakra-ui/react';
import LinkChakra from '@/components/common/link-chakra';
import Meta from './meta';
import { Post } from '@/models/contentful/Post';
import Nav from './nav';
import LayoutFooter from './layout-footer';
import { globalLayout } from '@/theme/index';
import Logo from '../common/Logo';
import { SITE_DESC } from '@/lib/constants';

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
  isTop?: boolean;
}

export default function Layout({
  preview,
  children,
  meta,
  revalEnv,
  hideAdsense,
  post,
  isTop,
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
        <>
          {/* globalTheme.tsの内容でレスポンシブの表示が変わる */}
          <Flex
            mx="auto"
            flexDirection={{ base: 'column', lg: 'row-reverse' }}
            w={{
              base: '100vw',
              lg: `${globalLayout.maxW}px`,
            }}
            gridGap={`${globalLayout.layoutPadding}px`}
          >
            <Stack flexGrow={1} spacing={6} alignItems="center" mt={8} mb={4}>
              <Logo logoSelection="nomaikura" />
              {isTop && <Box>{SITE_DESC}</Box>}

              <Box
                as="main"
                mx="auto"
                py={8}
                overflowX="hidden"
                w={{ base: 'full', md: `${globalLayout.mainWidth}px` }}
                px={{ base: 3, lg: 0 }}
              >
                {children}
              </Box>
            </Stack>
            <Box minW={`${globalLayout.asideWidth}px`} flexGrow={0}>
              <Nav post={post} hideAdsense={hideAdsense ?? false} />
            </Box>
          </Flex>
          <LayoutFooter maxW={globalLayout.maxW} revalidate={revalEnv} />
        </>

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
