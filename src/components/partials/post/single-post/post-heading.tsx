import dayjs from 'dayjs';
import { Badge, Box, Flex, Spacer, VStack } from '@chakra-ui/react';
import { Post } from '@/models/contentful/Post';

import PlatformList from '../common/platform-list';
import LinkChakra from '@/components/common/link-chakra';
import Image from 'next/image';
import FukidashiShare from '@/components/common/fukidashi-share';
import LikeDislike from '@/components/common/like-dislike';
import { SITE_FULL_URL } from '@/lib/constants';
import { useAuthentication } from '@/hooks/authentication';
import { useState } from 'react';
interface Props {
  post: Post;
}
const PostHeading = ({ post }: Props) => {
  const { user } = useAuthentication();
  const [loadedThumb, setLoadedThumb] = useState(false);
  return (
    <Box>
      {post.heroImage != undefined && (
        <Box w="full" mb={6}>
          <Box
            position="relative"
            bg="gray.900"
            h="300px"
            w="full"
            transitionDuration=".5s"
            opacity={loadedThumb ? '100%' : '0%'}
          >
            {/* この画像は0.5秒のtransitionで表示される */}
            <Image
              onLoad={() => setLoadedThumb(true)}
              objectFit="contain"
              layout="fill"
              src={post.heroImage.url}
            />
          </Box>
        </Box>
      )}

      <Flex mb={2}>
        <Badge area-label="公開日時" colorScheme="blue" fontSize="1.1rem">
          公開: {dayjs(post.publishDate ?? post.sys.firstPublishedAt).format('YYYY/MM/DD')}
        </Badge>
        <Badge area-label="更新日時" colorScheme="green" fontSize="1.1rem">
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

      {!post.publishDate && (
        <Badge colorScheme="red">編集担当へ: 並び替え用の公開日を設定し忘れています!</Badge>
      )}
      <VStack>
        <Spacer />

        <Box w="full" display={{ base: 'block', lg: 'none' }}>
          <Box mb={4}>
            <FukidashiShare
              tweetCount={post.tweetCount ?? 0}
              tweetText={`${post.title}\n${SITE_FULL_URL}/${post.slug}`}
            />
          </Box>
          <LikeDislike
            slug={post.slug}
            likeCount={post.like ?? 0}
            dislikeCount={post.dislike ?? 0}
            uid={user ? user.uid : undefined}
          />
        </Box>
      </VStack>
    </Box>
  );
};

export default PostHeading;
