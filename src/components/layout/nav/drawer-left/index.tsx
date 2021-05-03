import { useRef } from 'react';

import {
  useDisclosure,
  Button,
  Drawer,
  DrawerBody,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
} from '@chakra-ui/react';

import { useAuthentication } from '@/hooks/authentication';
import { SITE_FULL_URL } from '@/lib/constants';
import { Box, VStack } from '@chakra-ui/layout';

import FaiconDiv from '@/components/common/faicon-div';
import FukidashiShare from '@/components/common/fukidashi-share';
import LikeDislike from '@/components/common/like-dislike';
import LinkChakra from '@/components/common/link-chakra';

import { Post } from '@/models/contentful/Post';
import Logo from '@/components/common/Logo';
import HeadingList from '@/components/common/heading-list';

import * as gtag from '@/lib/gtag';

interface Props {
  post?: Post;
}

export default function DrawerLeft({ post }: Props) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = useRef(null);
  const { user } = useAuthentication();

  return (
    <>
      <Button
        zIndex={10}
        ml={3}
        pr={2}
        ref={btnRef}
        colorScheme="blue"
        leftIcon={<FaiconDiv icon={['fas', 'bars']} />}
        onClick={() => {
          onOpen();
          if (typeof window !== 'undefined') {
            gtag.event({
              action: 'openDrawer',
              category: 'GUI',
              label: 'ドロワーメニューを開く',
            });
          }
        }}
      />
      <Drawer
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        finalFocusRef={btnRef}
        aria-label="ドロワーメニュー(左)"
      >
        <DrawerOverlay>
          <DrawerContent>
            <DrawerCloseButton />
            <DrawerBody minW="320px" px={3} pt={8} pb={6}>
              <Logo logoSelection="nomaikura" />
              <VStack alignItems="start">
                {post && (
                  <>
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
                  </>
                )}

                <Button
                  leftIcon={<FaiconDiv icon={['fas', 'comment-alt']} />}
                  as={LinkChakra}
                  href="/contact/"
                >
                  お問い合わせ
                </Button>

                <Button
                  leftIcon={<FaiconDiv icon={['fas', 'book']} />}
                  as={LinkChakra}
                  href="/eula/"
                >
                  利用規約
                </Button>
              </VStack>
            </DrawerBody>
          </DrawerContent>
        </DrawerOverlay>
      </Drawer>
    </>
  );
}
