import {
  SITE_DESC,
  SITE_FULL_URL,
  VERCEL_GITHUB_REPOSITORY_TOP,
  VERCEL_LAST_COMMIT,
  VERCEL_LAST_COMMIT_MESSAGE,
} from '@/lib/constants';
import { Button, Box, Container, Flex, Stack, useColorMode, Badge, Center } from '@chakra-ui/react';
import LinkChakra from '@/components/common/link-chakra';
import Logo from '@/components/common/Logo';

interface FooterProps {
  revalidate?: number;
  maxW: number;
}

const LayoutFooter = ({ revalidate, maxW }: FooterProps) => {
  const { colorMode } = useColorMode();

  return (
    <Box as="footer" w="full" background="gray.700" py={8} color="white">
      <Container maxW={`${maxW}px`}>
        <Flex
          flexDirection={{ base: 'column', md: 'row' }}
          justifyContent={{ base: 'center', lg: 'space-between' }}
          alignItems={{ base: 'center', lg: 'flex-end' }}
          px={{ base: 3, lg: 0 }}
        >
          <Box textAlign={{ base: 'center', lg: 'left' }} pr={6} mb={{ base: 6, lg: 0 }}>
            <Flex mb={4} justifyContent={{ base: 'center', lg: 'flex-start' }}>
              <Logo logoSelection="nomaikura" fill="white" />
            </Flex>

            <Box mb={4}>{SITE_DESC}</Box>

            <Flex flexWrap="wrap" spacing={4}>
              <Button
                colorScheme="blue"
                leftIcon={
                  <div className="w-5 mr-1">
                    <img src="/svg/next-js.svg" width="10" />
                  </div>
                }
                href="https://nextjs.org/"
                as={LinkChakra}
                mr={2}
              >
                Next.js
              </Button>

              <Button
                colorScheme={colorMode == 'light' ? 'gray' : 'black'}
                href="https://www.contentful.com/"
                as={LinkChakra}
              >
                <img
                  src={colorMode == 'light' ? '/svg/contentful-black.svg' : '/svg/contentful.svg'}
                  width="100"
                />
              </Button>
            </Flex>
          </Box>
          <Box textAlign={{ base: 'center', lg: 'right' }}>
            <Box mb={3}>
              Released under MIT License.{` `}
              <br />
              <LinkChakra href={VERCEL_GITHUB_REPOSITORY_TOP + '/blob/main/LICENSE'}>
                (License text is on GitHub)
              </LinkChakra>
            </Box>
            <Stack direction="column">
              {revalidate && (
                <Box>
                  <Badge colorScheme="purple" textTransform="none">
                    速度向上のため、記事の内容は{revalidate / 60}分間変わりません
                  </Badge>
                </Box>
              )}
              <Box>
                <Badge maxW="20rem" whiteSpace="nowrap" textTransform="none" isTruncated>
                  Last commit:{' '}
                  <LinkChakra href={VERCEL_LAST_COMMIT}>{VERCEL_LAST_COMMIT_MESSAGE}</LinkChakra>
                </Badge>
              </Box>
            </Stack>
          </Box>
        </Flex>
      </Container>
    </Box>
  );
};

export default LayoutFooter;
