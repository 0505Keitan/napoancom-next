import dayjs from 'dayjs';
import { Badge, Box, Center, Flex, useColorMode } from '@chakra-ui/react';
import { PostForList } from '@/models/contentful/Post';

import LinkChakra from '@/components/common/link-chakra';
import { OGP_W, OGP_H } from '@/theme/index';
import Image from 'next/image';

interface Props {
  post: PostForList;
}
export function CompactPost({ post }: Props) {
  const { colorMode } = useColorMode();
  return (
    <LinkChakra href={`/${post.slug}`}>
      {/*<LinkChakra href={`/${post.slug}`}>*/}
      <Flex
        bg={colorMode == 'light' ? 'white' : 'gray.900'}
        rounded="xl"
        borderWidth={3}
        p={3}
        border="gray.600"
        area-label={post.title}
      >
        <Flex w="full" flexGrow={1} flexDirection={{ base: 'column', md: 'column' }}>
          <Center
            mb={2}
            overflow="hidden"
            w={{ base: 'full', md: 'auto' }}
            position="relative"
            rounded="lg"
            borderWidth={2}
            borderColor="gray.400"
          >
            {post.heroImage ? (
              <Image
                src={post.heroImage.url}
                objectFit="cover"
                width={`${OGP_W / 5}px`}
                height={`${OGP_H / 5}px`}
              />
            ) : (
              <Center width={`${OGP_W / 5}px`} height={`${OGP_H / 5}px`}>
                NO IMAGE
              </Center>
            )}
          </Center>
          <Box position="relative" w="full">
            <Box
              fontSize="lg"
              fontWeight="bold"
              mb={2}
              h={'90px'}
              overflow="hidden"
              w="full"
              isTruncated
              whiteSpace="normal"
            >
              {post.title}
            </Box>

            <Box area-label="更新日時">
              <Badge colorScheme="blue">
                公開: {dayjs(post.publishDate ?? post.sys.firstPublishedAt).format('YYYY/MM/DD')}
              </Badge>
              <Badge colorScheme="green">
                最終更新: {dayjs(post.sys.publishedAt).format('YYYY/MM/DD')}
              </Badge>
            </Box>
            {!post.publishDate && (
              <Badge whiteSpace="normal" colorScheme="red">
                編集担当へ: 並び替え用の公開日を設定し忘れています!
              </Badge>
            )}
          </Box>
        </Flex>
      </Flex>
      {/*</LinkChakra>*/}
    </LinkChakra>
  );
}
