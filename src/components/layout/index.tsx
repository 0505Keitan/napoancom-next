import dynamic from 'next/dynamic';
import { ReactNode } from 'react';
import { Flex, Box, Button, useColorMode, Center } from '@chakra-ui/react';
import LinkChakra from '@/components/common/link-chakra';
import Meta from './meta';

import { Post } from '@/models/contentful/Post';

import { ASIDE_WITDH, LAYOUT_MAXW, LAYOUT_PADDING, MAIN_WIDTH, NAV_HEIGHT } from '@/theme/index';
import Image from 'next/image';
const Nav = dynamic(() => import('./nav'));
const Aside = dynamic(() => import('./aside'));
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
  disableAside?: boolean;
}

export default function Layout({
  preview,
  children,
  meta,
  revalEnv,
  hideAdsense,
  post,
  disableAside,
}: LayoutProps) {
  const { colorMode } = useColorMode();

  return (
    <>
      {/* OGPの生成 */}
      <Meta title={meta.title} desc={meta.desc} heroImageUrl={meta.ogpUrl} />
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
        <Nav
          post={post}
          colorMode={colorMode}
          preview={preview}
          hideAdsense={hideAdsense ?? false}
        />

        <Box pt={`${NAV_HEIGHT}px`}>
          {post && post.heroImage && (
            <Center w="full" bg="gray.900">
              <Box h="360px" w="650px" position="relative">
                <Image objectFit="cover" layout="fill" src={post.heroImage.url} />
              </Box>
            </Center>
          )}
          <Flex mx="auto" w="100vw" px={{ base: 3, md: 0 }} flexDirection="row-reverse">
            {/* disableAsideがtrueならこのmainが横幅いっぱいになります */}
            {disableAside ? (
              <Box
                as="main"
                mx="auto"
                pt={8}
                overflowX="hidden"
                maxW={{
                  base: `${MAIN_WIDTH}px`,
                  md: `container.md`,
                  lg: `container.xl`,
                }}
                minW={{ base: '100%', md: `${MAIN_WIDTH}px` }}
                pl={0}
              >
                {children}
              </Box>
            ) : (
              <Box
                as="main"
                mx="auto"
                pt={8}
                overflowX="hidden"
                maxW={{ base: '100vw', md: `${MAIN_WIDTH}px` }}
                minW={{ base: '100%', md: `${MAIN_WIDTH}px` }}
                pl={{ base: 0, lg: `${LAYOUT_PADDING}px` }}
              >
                {children}
              </Box>
            )}
            {!disableAside && (
              <Aside post={post} hideAdsense={hideAdsense ?? false} w={ASIDE_WITDH} />
            )}
          </Flex>
          <LayoutFooter maxW={LAYOUT_MAXW} revalidate={revalEnv} />
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
