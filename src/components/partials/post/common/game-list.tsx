import LinkChakra from '@/components/common/link-chakra';
import { Box, Button, Flex, Heading } from '@chakra-ui/react';
import { Game } from '@/models/contentful/Game';

interface Props {
  game: Game;
}

interface ListProps {
  games: Game[];
  heading?: boolean;
  mode?: 'wrap';
}

const OneGame = ({ game }: Props) => {
  return (
    <Button
      mr={2}
      fontSize={{ base: '0.8rem', sm: '1rem' }}
      mb={2}
      href={`/games/${game.slug}`}
      colorScheme={'green'}
      as={LinkChakra}
    >
      <Box>{game.displayName}</Box>
    </Button>
  );
};

const GameList = ({ games, heading, mode }: ListProps) => {
  return (
    <Box>
      {heading && (
        <Heading fontSize="1.6rem" m={2} mt={8} as="h2">
          機種から記事を探す
        </Heading>
      )}
      <Flex flexWrap="wrap" flexDirection={mode == 'wrap' ? 'row' : 'column'}>
        {games.reverse().map((g: Game) => (
          <OneGame game={g} key={g.slug} />
        ))}
      </Flex>
    </Box>
  );
};

export default GameList;
