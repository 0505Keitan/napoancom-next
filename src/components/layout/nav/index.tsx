import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { Box, Button, CloseButton, HStack, Spacer, Stack, useColorMode } from '@chakra-ui/react';
import { ASIDE_WITDH, LAYOUT_PADDING, NAV_HEIGHT } from '@/theme/index';
import { Post } from '@/models/contentful/Post';
import ColorSwitch from '../color-switch';
import Logo from '@/components/common/Logo';
import * as gtag from '@/lib/gtag';
import SearchBox from '@/components/common/search-box';
import FaiconDiv from '@/components/common/faicon-div';
import AdsenseBox from '@/components/common/adsense-box';
import HeadingList from '@/components/common/heading-list';
import FukidashiShare from '@/components/common/fukidashi-share';
import LikeDislike from '@/components/common/like-dislike';
import { SITE_FULL_URL } from '@/lib/constants';
import { useAuthentication } from '@/hooks/authentication';
import LinkChakra from '@/components/common/link-chakra';
const SignIn = dynamic(() => import('./signin'), { ssr: false });

interface NavProps {
  post?: Post;
  hideAdsense: boolean;
}

// https://dev.to/guimg/hide-menu-when-scrolling-in-reactjs-47bj

export default function Nav({ post, hideAdsense }: NavProps) {
  const { user } = useAuthentication();
  const { colorMode } = useColorMode();
  const [isOpen, setIsOpen] = useState(false);
  const leftValue = () => {
    if (isOpen) {
      return 0;
    } else {
      return { base: `-${ASIDE_WITDH}px`, lg: 0 };
    }
  };
  return (
    <>
      {/* これは左固定メニュー */}
      <Box
        top={0}
        left={leftValue()}
        position="fixed"
        as="aside"
        sx={{ '.noScrollBar::-webkit-scrollbar': { display: 'none' } }}
        w={`${ASIDE_WITDH}px`}
        h="100vh"
        zIndex={6}
        px={3}
        bg={colorMode == 'light' ? 'white' : '#1A202C'}
        shadow={{ base: 'xl', lg: 'none' }}
        transitionProperty="left"
        transitionDuration=".3s"
        borderRight="gray.400"
        borderRightWidth={2}
      >
        <Box w="full" h="full" overflowY="scroll" className="noScrollBar" pt={3} pb={8}>
          <CloseButton
            display={{ base: 'block', lg: 'none' }}
            onClick={() => {
              setIsOpen(false);
              if (typeof window !== 'undefined') {
                gtag.event({
                  action: 'closeDrawer',
                  category: 'GUI',
                  label: 'ドロワーメニューを閉じる',
                });
              }
            }}
          />
          {hideAdsense != true ? (
            <>
              <AdsenseBox width={300} height={250} layout="fixed" slot={'8321176059'} />
            </>
          ) : (
            <Button
              colorScheme="purple"
              mb={6}
              h={20}
              fontSize="xl"
              w="full"
              as={LinkChakra}
              href="/entityatsume"
            >
              特別企画: GW
              <br />
              エンティティガチャ
              <br />
              開催中！！！！
            </Button>
          )}

          <SignIn />

          {post && (
            <Stack>
              <Box py={4}>
                <FukidashiShare
                  tweetCount={post.tweetCount ?? 0}
                  tweetText={`${post.title}\n${SITE_FULL_URL}/${post.slug}`}
                />
              </Box>
              <Box w="full" py={2} display={{ base: 'none', lg: 'flex' }}>
                <LikeDislike
                  slug={post.slug}
                  likeCount={post.like ?? 0}
                  dislikeCount={post.dislike ?? 0}
                  uid={user ? user.uid : undefined}
                />
              </Box>
              <HeadingList headings={post.headings} />
            </Stack>
          )}
        </Box>
      </Box>

      {/* これが上のメニュー */}
      <Box
        zIndex={5}
        bg={colorMode == 'light' ? 'white' : '#1A202C'}
        h={`${NAV_HEIGHT}px`}
        top={0}
        left={0}
        as="nav"
        w="100vw"
        pt={2}
        borderBottom="gray.400"
        borderBottomWidth={2}
        position="fixed"
        overflow="hidden"
      >
        <HStack px={3} ml="auto" w={{ base: '100vw', lg: `calc(100vw - ${ASIDE_WITDH}px)` }}>
          <Button
            display={{ base: 'block', lg: 'none' }}
            zIndex={10}
            mr={3}
            colorScheme="blue"
            leftIcon={<FaiconDiv icon={['fas', 'bars']} />}
            onClick={() => {
              setIsOpen(true);
              if (typeof window !== 'undefined') {
                gtag.event({
                  action: isOpen ? 'closeDrawer' : 'openDrawer',
                  category: 'GUI',
                  label: `ドロワーメニューを${isOpen ? '閉じる' : '開く'}`,
                });
              }
            }}
          />
          <Box pr={4} display={{ base: 'none', md: 'block' }}>
            <Logo logoSelection="nomaikura" />
          </Box>

          <ColorSwitch />

          <Spacer />

          <HStack display={{ base: 'none', sm: 'block' }}>
            <SearchBox />
          </HStack>
        </HStack>
      </Box>
    </>
  );
}
