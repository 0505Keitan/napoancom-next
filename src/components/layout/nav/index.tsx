import React from 'react';
import dynamic from 'next/dynamic';
import { Box, HStack, Spacer, useColorMode } from '@chakra-ui/react';
import DrawerLeft from './drawer-left';
import { Post } from '@/models/contentful/Post';
import { NAV_HEIGHT } from '@/theme/index';
import ColorSwitch from '../color-switch';
import Logo from '@/components/common/Logo';
import SearchBox from '@/components/common/search-box';
const SignIn = dynamic(() => import('./signin'), { ssr: false });

interface NavProps {
  post?: Post;
}

// https://dev.to/guimg/hide-menu-when-scrolling-in-reactjs-47bj

export default function Nav({ post }: NavProps) {
  const { colorMode } = useColorMode();
  return (
    <Box>
      <Box
        zIndex={30}
        bg={colorMode == 'light' ? 'white' : 'blackAlpha.800'}
        w="100vw"
        h={`${NAV_HEIGHT}px`}
        as="nav"
        pt={2}
        px={3}
        shadow="lg"
        position="fixed"
      >
        <HStack>
          <Box mr={4}>
            <DrawerLeft post={post} />
          </Box>
          <Box pr={4} display={{ base: 'none', md: 'inline-block' }}>
            <Logo logoSelection="nomaikura" />
          </Box>

          <ColorSwitch />

          <Spacer />

          <HStack display={{ base: 'none', sm: 'inline-block' }}>
            <SearchBox />
          </HStack>

          <Box pl={4}>
            <SignIn />
          </Box>
        </HStack>
      </Box>
    </Box>
  );
}
