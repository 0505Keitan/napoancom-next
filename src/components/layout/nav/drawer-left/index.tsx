import { useRef } from 'react';

import {
  useDisclosure,
  Button,
  Drawer,
  DrawerBody,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
} from '@chakra-ui/react';

import FaiconDiv from '@/components/common/faicon-div';
import SideContent from '../../side-content';
import { Post } from '@/models/contentful/Post';
import { ASIDE_WITDH } from '@/lib/chakra/theme';
import Logo from '@/components/common/Logo';

interface Props {
  post?: Post;
  hideAdsense?: boolean;
}

export default function DrawerLeft({ post, hideAdsense }: Props) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = useRef(null);

  return (
    <>
      <Button
        zIndex={10}
        ml={3}
        pr={2}
        ref={btnRef}
        colorScheme="blue"
        leftIcon={<FaiconDiv icon={['fas', 'bars']} />}
        onClick={onOpen}
      />
      <Drawer
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        finalFocusRef={btnRef}
        aria-label="ドロワーメニュー(左)"
      >
        <DrawerOverlay>
          <DrawerContent>
            <DrawerCloseButton />
            <DrawerBody minW="320px" px={3} pt={8} pb={6}>
              <Logo logoSelection="nomaikura" />
              <SideContent hideAdsense={hideAdsense ?? false} post={post} />
            </DrawerBody>
          </DrawerContent>
        </DrawerOverlay>
      </Drawer>
    </>
  );
}
