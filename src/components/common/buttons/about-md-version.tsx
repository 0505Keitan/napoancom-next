import { Button } from '@chakra-ui/react';
import LinkChakra from '../link-chakra';

export default function AboutMdVersion({ message }: { message?: string }) {
  return (
    <Button colorScheme="red" as={LinkChakra} href="/aboutMdVersion/">
      {message ?? ' MDバージョンについて'}
    </Button>
  );
}
