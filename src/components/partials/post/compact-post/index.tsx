import dayjs from 'dayjs';
import { Badge, Box, Flex, Stack } from '@chakra-ui/react';
import { PostForList } from '@/models/contentful/Post';

import LinkChakra from '@/components/common/link-chakra';
import { globalLayout } from '@/theme/index';
import Image from 'next/image';

interface Props {
  post: PostForList;
}
export function CompactPost({ post }: Props) {
  return (
    <LinkChakra href={`/${post.slug}`}>
      <Flex
        borderBlockEndWidth={1}
        borderColor="gray.400"
        gridGap={6}
        p={3}
        pb={8}
        area-label={post.title}
        flexDirection={{ base: 'column', sm: 'row' }}
      >
        <Stack width={`${globalLayout.ogp.w / 5}px`}>
          <Box>
            {post.heroImage ? (
              <Image
                src={post.heroImage.url}
                objectFit="cover"
                width={`${globalLayout.ogp.w / 5}px`}
                height={`${globalLayout.ogp.h / 5}px`}
              />
            ) : (
              <span>NO IMAGE</span>
            )}
          </Box>
          <Box area-label="更新日時">
            <Badge colorScheme="blue">
              公開: {dayjs(post.sys.firstPublishedAt).format('YYYY/MM/DD')}
            </Badge>
            <Badge colorScheme="green">
              最終更新: {dayjs(post.sys.publishedAt).format('YYYY/MM/DD')}
            </Badge>
          </Box>
        </Stack>
        <Box w="full" flexGrow={1}>
          <Box
            fontSize={{ base: 'xl', md: '2xl' }}
            fontWeight="bold"
            mb={2}
            overflow="hidden"
            w="full"
            isTruncated
            whiteSpace="normal"
          >
            {post.title}
          </Box>

          {/* カッコつけ */}
          <Badge whiteSpace="normal" fontSize={{ base: 'sm', md: 'lg' }} fontStyle="italic">
            <Box mt={-2}>{post.slug}</Box>
          </Badge>
        </Box>
      </Flex>
      {/*</LinkChakra>*/}
    </LinkChakra>
  );
}
