import dayjs from 'dayjs';
import { Badge, Box, Center, Flex, Spacer, VStack } from '@chakra-ui/react';
import { Post } from '@/models/contentful/Post';

import PlatformList from '../common/platform-list';
import LinkChakra from '@/components/common/link-chakra';
import Image from 'next/image';
import FukidashiShare from '@/components/common/fukidashi-share';
import LikeDislike from '@/components/common/like-dislike';

import { useState } from 'react';
import GameList from '../common/game-list';
import { globalLayout } from '@/theme/index';
interface Props {
  post: Post;
}
const PostHeading = ({ post }: Props) => {
  const [loadedThumb, setLoadedThumb] = useState(false);
  return (
    <Box maxW="100vw" overflow="hidden">
      {post.heroImage != undefined && (
        <Center mb={6}>
          <Box
            objectFit="cover"
            w="full"
            mx="auto"
            transitionDuration=".5s"
            opacity={loadedThumb ? '100%' : '0%'}
          >
            {/* この画像は0.5秒のtransitionで表示される */}
            {/* これmainWidthと揃えてもいいけど、ピクセルが不安なんだよな〜 */}
            <Image
              width={`${globalLayout.ogp.w / 2}px`}
              height={'auto'}
              onLoad={() => setLoadedThumb(true)}
              src={post.heroImage.url}
              layout="responsive"
            />
          </Box>
        </Center>
      )}

      {post.game && post.game.slug != undefined && (
        <Box mb={4}>
          <GameList games={[post.game]} mode="wrap" />
        </Box>
      )}

      <Flex mb={2}>
        <Badge area-label="公開日時" colorScheme="blue">
          公開: {dayjs(post.sys.firstPublishedAt).format('YYYY/MM/DD')}
        </Badge>
        <Badge area-label="更新日時" colorScheme="green">
          最終更新: {dayjs(post.sys.publishedAt).format('YYYY/MM/DD')}
        </Badge>
      </Flex>
      <Box fontSize={{ base: '32px', md: '40px' }} lineHeight="1.2em" fontWeight="bold" mb={4}>
        <LinkChakra href={`/${post.slug}`}>
          <h1>{post.title}</h1>
        </LinkChakra>
      </Box>

      {post.platformsCollection?.items && post.platformsCollection.items.length > 0 && (
        <Box mb={4}>
          <PlatformList mode="wrap" platforms={post.platformsCollection.items} />
        </Box>
      )}

      <VStack>
        <Spacer />
        <Box w="full" display={{ base: 'block', lg: 'none' }}>
          <Box mb={4}>
            <FukidashiShare tweetCount={post.tweetCount ?? 0} tweetText={post.title} />
          </Box>
          <LikeDislike
            slug={post.slug}
            likeCount={post.like ?? 0}
            dislikeCount={post.dislike ?? 0}
          />
        </Box>
      </VStack>
    </Box>
  );
};

export default PostHeading;
