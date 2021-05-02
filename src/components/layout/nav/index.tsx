import React, { Component } from 'react';
import dynamic from 'next/dynamic';
import { Box, Button, ColorMode, HStack, Spacer } from '@chakra-ui/react';
import DrawerLeft from './drawer-left';
import { Post } from '@/models/contentful/Post';
import LinkChakra from '@/components/common/link-chakra';
import FaiconDiv from '@/components/common/faicon-div';
import { CREATOR_ID } from '@/lib/constants';
import { NAV_HEIGHT } from '@/theme/index';
import ColorSwitch from '../color-switch';
import Logo from '@/components/common/Logo';
const SignIn = dynamic(() => import('./signin'), { ssr: false });

interface NavProps {
  preview: boolean;
  post?: Post;
  colorMode: ColorMode;
  hideAdsense?: boolean;
}

// https://dev.to/guimg/hide-menu-when-scrolling-in-reactjs-47bj

export default class Nav extends Component<NavProps, { prevScrollpos: number; visible: boolean }> {
  constructor(props: any) {
    super(props);
    if (typeof window !== 'undefined') {
      this.state = {
        prevScrollpos: window.pageYOffset,
        visible: true,
      };
    } else {
      this.state = {
        prevScrollpos: 0,
        visible: true,
      };
    }
  }

  componentDidMount() {
    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', this.handleScroll);
    }
  }

  componentWillUnmount() {
    if (typeof window !== 'undefined') {
      window.removeEventListener('scroll', this.handleScroll);
    }
  }

  // Hide menu when scroll
  handleScroll = () => {
    if (typeof window !== 'undefined') {
      const { prevScrollpos } = this.state;

      const currentScrollPos = window.pageYOffset;
      let visible = prevScrollpos > currentScrollPos;
      if (currentScrollPos == 0) {
        visible = true;
      }

      this.setState({
        prevScrollpos: currentScrollPos,
        visible,
      });
    }
  };

  render() {
    return (
      <Box
        sx={{
          '.translateY': {
            transform: 'translateY(0)',
            transitionProperty: 'transform',
            transitionDuration: '.3s',
          },
          '.hidden': {
            transform: 'translateY(-100%)',
          },
        }}
      >
        <Box
          zIndex={30}
          bg={this.props.colorMode == 'light' ? 'white' : 'blackAlpha.800'}
          w="100vw"
          h={`${NAV_HEIGHT}px`}
          as="nav"
          py={2}
          px={3}
          shadow="lg"
          position="fixed"
          className={this.state.visible ? 'translateY' : 'translateY hidden'}
        >
          <HStack>
            <Box mr={4}>
              <DrawerLeft post={this.props.post} />
            </Box>
            <Box pr={4} display={{ base: 'none', md: 'inline-block' }}>
              <Logo logoSelection="nomaikura" />
            </Box>

            <ColorSwitch />

            <Spacer />

            <HStack display={{ base: 'none', md: 'inline-block' }}>
              <Button
                isExternal
                leftIcon={<FaiconDiv icon={['fab', 'twitter']} />}
                as={LinkChakra}
                href={`https://twitter.com/${CREATOR_ID}`}
              >
                Twitter
              </Button>
            </HStack>

            <Box pl={4}>
              <SignIn />
            </Box>
          </HStack>
        </Box>
      </Box>
    );
  }
}
