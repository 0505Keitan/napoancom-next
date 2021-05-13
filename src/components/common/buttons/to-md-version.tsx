import { Button } from '@chakra-ui/react';
import LinkChakra from '../link-chakra';

export default function ToMdVersion({ message }: { message?: string }) {
  return (
    <Button colorScheme="green" as={LinkChakra} isExternal href="https://md.napoan.com">
      {message ?? '新サイトMarkdown Gamingへ'}
    </Button>
  );
}
