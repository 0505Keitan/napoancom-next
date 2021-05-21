import { Button } from '@chakra-ui/react';
import LinkChakra from '../link-chakra';

export default function AboutMdVersion({ message }: { message?: string }) {
  return (
    <Button w="full" colorScheme="teal" as={LinkChakra} href="/aboutMdVersion/">
      {message ?? '新サイト ASOBINONオープン!'}
    </Button>
  );
}
