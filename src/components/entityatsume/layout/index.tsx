import { ReactNode } from 'react';
import { Flex, Box, Button, useColorMode, Center, HStack, Heading } from '@chakra-ui/react';
import LinkChakra from '@/components/common/link-chakra';
import Meta from '../../layout/meta';

import { LAYOUT_PADDING, MAIN_WIDTH, NAV_HEIGHT } from '@/theme/index';
import { useAuthentication } from '@/hooks/authentication';

interface LayoutProps {
  children: ReactNode;
  meta: {
    title: string;
    desc: string;
    ogpUrl?: string;
  };
  isTop?: boolean;
}

export default function LayoutForEntityAtsume({ children, meta, isTop }: LayoutProps) {
  const { colorMode } = useColorMode();
  const { user } = useAuthentication();

  return (
    <>
      {/* OGPの生成 */}
      <Meta title={meta.title} desc={meta.desc} heroImageUrl={meta.ogpUrl} />
      <Box w="100vw">
        <Box
          w="100vw"
          bg={colorMode == 'light' ? 'white' : 'dark'}
          as="nav"
          py={3}
          position="fixed"
          top={0}
          shadow="lg"
          zIndex={30}
          px={3}
        >
          <HStack>
            {isTop ? (
              <Button colorScheme="blue" as={LinkChakra} href="/">
                &lt;- トップに戻る
              </Button>
            ) : (
              <Button colorScheme="purple" as={LinkChakra} href="/entityatsume/">
                &lt;- ガチャに戻る
              </Button>
            )}

            <Center flexGrow={1}>
              <b>特別企画: エンティティあつめ</b>
            </Center>
          </HStack>
        </Box>

        <Center w="100vw" position="fixed" bottom={0} zIndex={30}>
          <HStack
            spacing={3}
            roundedTop="xl"
            bg={colorMode == 'light' ? 'white' : 'dark'}
            as="nav"
            py={3}
            shadow="xl"
            px={3}
          >
            <Button colorScheme="blue" as={LinkChakra} href="/entityatsume/">
              ガチャ
            </Button>

            <Button
              colorScheme="purple"
              as={LinkChakra}
              href={`/entityatsume/myentities?user=${user ? user.uid : ''}`}
            >
              編成
            </Button>

            <Button colorScheme="green" as={LinkChakra} href="/entityatsume/zukan/">
              図鑑
            </Button>
          </HStack>
        </Center>

        <Box pt={`${NAV_HEIGHT}px`}>
          <Flex mx="auto" w="100vw" px={{ base: 3, md: 0 }}>
            <Box
              as="main"
              mx="auto"
              pt={8}
              overflowX="hidden"
              maxW={{ base: '100vw', md: `${MAIN_WIDTH}px` }}
              minW={{ base: '100%', md: `${MAIN_WIDTH}px` }}
              pl={{ base: 0, lg: `${LAYOUT_PADDING}px` }}
            >
              {children}
            </Box>
          </Flex>
        </Box>
      </Box>
    </>
  );
}
