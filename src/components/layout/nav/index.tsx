import React, { useState } from 'react';
import { Box, Button, CloseButton, Flex, Stack, useColorMode } from '@chakra-ui/react';
import { globalLayout, themeColor } from '@/theme/index';
import { Post } from '@/models/contentful/Post';
import ColorSwitch from '../color-switch';
import * as gtag from '@/lib/gtag';
import SearchBox from '@/components/common/search-box';
import FaiconDiv from '@/components/common/faicon-div';
import AdsenseBox from '@/components/common/adsense-box';
import HeadingList from '@/components/common/heading-list';
import FukidashiShare from '@/components/common/fukidashi-share';
import LikeDislike from '@/components/common/like-dislike';

interface NavProps {
  post?: Post;
  hideAdsense: boolean;
}

// https://dev.to/guimg/hide-menu-when-scrolling-in-reactjs-47bj

export default function Nav({ post, hideAdsense }: NavProps) {
  const { colorMode } = useColorMode();
  const [isOpen, setIsOpen] = useState(false);
  const leftValue = () => {
    if (isOpen) {
      return 0;
    } else {
      // 左にずらして隠す
      return { base: `-200vw`, lg: 0 };
    }
  };

  // カラースイッチが二箇所あるので一斉に切り替える
  const switchPoint = {
    nav: 'lg',
    colorSwitch: 'md',
  };
  return (
    <>
      {/* 開いた時にメニュー以外を押して閉じるため */}
      <Box
        position="fixed"
        w={isOpen ? `100vw` : 0}
        h="100vh"
        top={0}
        left={0}
        opacity={isOpen ? 0.5 : 0}
        bg="black"
        transitionProperty="opacity"
        transitionDuration=".3s"
        as="button"
        onClick={() => setIsOpen(false)}
        zIndex={6}
      ></Box>
      {/* これは左固定メニュー */}
      <Box
        top={0}
        left={leftValue()}
        position={{ base: 'fixed', [switchPoint.nav]: 'sticky' }}
        as="nav"
        sx={{ '.noScrollBar::-webkit-scrollbar': { display: 'none' } }}
        w={`${globalLayout.asideWidth}px`}
        h="100vh"
        px={3}
        bg={colorMode == 'light' ? 'white' : '#1A202C'}
        shadow={{ base: 'xl', [switchPoint.nav]: 'none' }}
        transitionProperty="left"
        transitionDuration=".3s"
        zIndex={6}
      >
        <Flex w="full" flexDir="column" h="full" overflowY="scroll" className="noScrollBar" py={3}>
          <CloseButton
            display={{ base: 'block', [switchPoint.nav]: 'none' }}
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
          <Stack flexGrow={1} spacing={8} h="auto">
            {hideAdsense != true && (
              <Stack pb={8} display={{ base: 'none', [switchPoint.nav]: 'block' }}>
                <AdsenseBox width={300} height={250} layout="fixed" slot={'8321176059'} />
              </Stack>
            )}

            <Box w="full">
              <SearchBox />
            </Box>
            <Box display={{ base: 'block', [switchPoint.colorSwitch]: 'none' }}>
              <ColorSwitch />
            </Box>

            {post && (
              <>
                <Box>
                  <FukidashiShare tweetCount={post.tweetCount ?? 0} tweetText={post.title} />
                </Box>

                <LikeDislike
                  slug={post.slug}
                  likeCount={post.like ?? 0}
                  dislikeCount={post.dislike ?? 0}
                />

                <Stack mb={4}>
                  <HeadingList headings={post.headings} />
                </Stack>
              </>
            )}
          </Stack>
        </Flex>
      </Box>

      {/* これが上のメニュー */}
      <Box zIndex={5} top={3} left={3} position="fixed">
        <Button
          shadow="xl"
          display={{ base: 'block', [switchPoint.nav]: 'none' }}
          zIndex={10}
          mr={3}
          pr={2}
          pt={1}
          bg={themeColor}
          color="white"
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
      </Box>

      <Box
        display={{ base: 'none', [switchPoint.colorSwitch]: 'block' }}
        px={3}
        bg="whiteAlpha.300"
        roundedBottomLeft="xl"
        position="fixed"
        right={0}
        top={0}
      >
        <ColorSwitch />
      </Box>
    </>
  );
}
