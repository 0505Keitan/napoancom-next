import dayjs from 'dayjs';
import { Badge, Box, Center, Flex, Stack } from '@chakra-ui/react';
import { PostForList } from '@/models/contentful/Post';

import LinkChakra from '@/components/common/link-chakra';
import { OGP_W, OGP_H } from '@/theme/index';
import Image from 'next/image';

interface Props {
  post: PostForList;
}
export function CompactPost({ post }: Props) {
  return (
    <LinkChakra href={`/${post.slug}`}>
      {/*<LinkChakra href={`/${post.slug}`}>*/}
      <Flex gridGap={6} p={3} area-label={post.title} borderBottomWidth={2}>
        <Stack w="full" flexGrow={1}>
          <Center
            width={`${OGP_W / 5}px`}
            height={`${OGP_H / 5}px`}
            mb={2}
            overflow="hidden"
            w={{ base: 'full', md: 'auto' }}
            position="relative"
          >
            {post.heroImage ? (
              <Image
                src={post.heroImage.url}
                objectFit="cover"
                width={`${OGP_W / 5}px`}
                height={`${OGP_H / 5}px`}
              />
            ) : (
              <span>NO IMAGE</span>
            )}
          </Center>
          <Box area-label="更新日時">
            <Badge colorScheme="blue">
              公開: {dayjs(post.publishDate ?? post.sys.firstPublishedAt).format('YYYY/MM/DD')}
            </Badge>
            <Badge colorScheme="green">
              最終更新: {dayjs(post.sys.publishedAt).format('YYYY/MM/DD')}
            </Badge>
            {!post.publishDate && (
              <Badge whiteSpace="normal" colorScheme="red">
                編集担当へ: 並び替え用の公開日を設定し忘れています!
              </Badge>
            )}
          </Box>
        </Stack>
        <Box position="relative" w="full">
          <Box
            fontSize="lg"
            fontWeight="bold"
            mb={2}
            overflow="hidden"
            w="full"
            isTruncated
            whiteSpace="normal"
          >
            {post.title}
          </Box>
        </Box>
      </Flex>
      {/*</LinkChakra>*/}
    </LinkChakra>
  );
}
