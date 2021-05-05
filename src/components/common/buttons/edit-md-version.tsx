import { Button } from '@chakra-ui/react';
import LinkChakra from '../link-chakra';

export default function EditMvVersion({ slug }: { slug: string }) {
  return (
    <Button
      colorScheme="green"
      as={LinkChakra}
      w="full"
      isExternal
      href={`https://md.napoan.com/docs/posts/${slug}`}
    >
      MDバージョンを閲覧
    </Button>
  );
}
