import { Box } from '@chakra-ui/react';
import { Post } from '@/models/contentful/Post';
import { NAV_HEIGHT } from '@/theme/index';
import SideContent from '../side-content';

interface LeftStickyProps {
  w: number;
  post?: Post;
  hideAdsense?: boolean;
}

const Aside = ({ w, post, hideAdsense }: LeftStickyProps) => {
  return (
    <Box
      top={`${NAV_HEIGHT}px`}
      bottom={0}
      left={0}
      position="sticky"
      as="aside"
      sx={{ '.noScrollBar::-webkit-scrollbar': { display: 'none' } }}
      display={{ base: 'none', md: 'none', lg: 'flex' }}
      w={`${w}px`}
      h="100vh"
      zIndex={5}
      pl={3}
    >
      <Box w="full" h="full" overflowY="scroll" className="noScrollBar" pt={6} pb={8}>
        <SideContent post={post} hideAdsense={hideAdsense ?? false} />
      </Box>
    </Box>
  );
};

export default Aside;
