import { VERCEL_LAST_COMMIT, VERCEL_LAST_COMMIT_MESSAGE } from '@/lib/constants';
import { Button, Box, Container, Flex, Stack, Badge } from '@chakra-ui/react';
import LinkChakra from '@/components/common/link-chakra';
import FaiconDiv from '@/components/common/faicon-div';
import AboutMdVersion from '@/components/common/buttons/about-md-version';

interface FooterProps {
  revalidate?: number;
  maxW: number;
}

const LayoutFooter = ({ revalidate, maxW }: FooterProps) => {
  return (
    <Box as="footer" w="full" background="gray.700" py={8}>
      <Container maxW={`${maxW}px`}>
        <Flex
          flexDirection={{ base: 'column', md: 'row' }}
          justifyContent={{ base: 'center', lg: 'space-between' }}
          alignItems={{ base: 'center', lg: 'flex-end' }}
          px={{ base: 3, lg: 0 }}
        >
          <Box textAlign={{ base: 'center', lg: 'left' }} pr={6} mb={{ base: 6, lg: 0 }}>
            <Stack spacing={2}>
              <AboutMdVersion />
              <Button
                leftIcon={<FaiconDiv icon={['fas', 'comment-alt']} />}
                as={LinkChakra}
                href="/contact/"
              >
                お問い合わせ
              </Button>

              <Button leftIcon={<FaiconDiv icon={['fas', 'book']} />} as={LinkChakra} href="/eula/">
                利用規約
              </Button>
              <Button
                leftIcon={<FaiconDiv icon={['fas', 'user']} />}
                as={LinkChakra}
                href="/privacy-policy/"
              >
                プライバシーポリシー
              </Button>
            </Stack>
          </Box>
          <Stack color="white" textAlign={{ base: 'center', md: 'right' }}>
            <Box>
              Some articles are not up-to-date.
              <br />
              更新されていない記事があります。
              <br />
              Not affiliated with Mojang/Microsoft.
              <br />
              Mojang/Microsoftとは無関係です。
            </Box>
            <Box>
              Copyright &copy; 2021 AELYONE.
              <br />
              Contents created by Ryo Ando.
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
          </Stack>
        </Flex>
      </Container>
    </Box>
  );
};

export default LayoutFooter;
