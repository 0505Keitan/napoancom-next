import FaiconDiv from '@/components/common/faicon-div';
import LinkChakra from '@/components/common/link-chakra';
import { Person } from '@/models/contentful/Person';
import { Avatar, Box, Button, Flex, Heading, Stack, useColorMode } from '@chakra-ui/react';

interface OneProps {
  person: Person;
}
interface ListProps {
  persons: Person[];
}

const OnePerson = ({ person }: OneProps) => {
  const { colorMode } = useColorMode();
  return (
    <Flex
      justifyContent="space-between"
      flexDirection={{ base: 'column', sm: 'row' }}
      p={4}
      rounded="lg"
      bg={colorMode == 'light' ? 'gray.200' : 'gray.900'}
    >
      <Box mb={{ base: 4, sm: 0 }}>
        <Flex mb={3} alignItems="center">
          <Avatar
            w={12}
            h={12}
            src={person.picture ? person.picture.url : process.env.HTTPS_URL + '/favicon.png'}
            name={person.displayName ? person.displayName : '(名前なし)'}
            mr={3}
          />
          <Heading as="h3" textStyle="h3">
            <LinkChakra href={`/persons/${person.slug}`} zIndex={5}>
              {person.displayName ? person.displayName : '(名前なし)'}
            </LinkChakra>
          </Heading>
        </Flex>

        {person.twitterId && (
          <Stack w={64}>
            <Button
              aria-label="フォロー"
              target="_blank"
              as={LinkChakra}
              href={`https://twitter.com/${person.twitterId}`}
              colorScheme="twitter"
              leftIcon={<FaiconDiv icon={['fab', 'twitter']} />}
            >
              フォロー
            </Button>
          </Stack>
        )}
      </Box>
      <Box ml={{ base: 0, sm: 4 }} flexGrow={1} p={4} bg="gray.100">
        {person.description ?? '(自己紹介なし)'}
      </Box>
    </Flex>
  );
};

const PersonList = ({ persons }: ListProps) => {
  return (
    <Stack mb={4} spacing={2} w="full">
      <Heading as="h2" textStyle="h2">
        著者
      </Heading>
      {persons && persons.map((c: Person) => <OnePerson person={c} key={c.slug} />)}
    </Stack>
  );
};

export default PersonList;
