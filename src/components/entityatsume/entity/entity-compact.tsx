import { Badge, Box, Center, Flex, Heading, Stack, useColorMode } from '@chakra-ui/react';
import { Entity } from '@/models/firebase/entities/entity';
import Image from 'next/image';

interface Props {
  entity: Entity;
}

export default function EntityCompact({ entity }: Props) {
  let entityType = 'エンティティ';
  let colorScheme = 'blue';
  if (entity.type == 'friendly') {
    entityType = '友好モブ';
    colorScheme = 'green';
  }
  if (entity.type == 'hostile') {
    entityType = '敵対モブ';
    colorScheme = 'red';
  }
  if (entity.type == 'passive') {
    entityType = '中立モブ';
  }
  return (
    <>
      <Box w="200px" h="380px" overflow="hidden" m={4} p={4} rounded="xl" shadow="xl">
        <Stack mb={6} spacing={2}>
          <Flex mb={3} alignItems="center">
            <Box
              my={4}
              ml={6}
              mr={8}
              w="16px"
              h="16px"
              transform="scale(3)"
              backgroundImage={`url(${entity.iconUrl ?? ``})`}
              backgroundPosition={entity.iconBgPos ?? ''}
            />

            <Heading as="h2" isTruncated fontSize="md">
              {entity.nameJapanese ? entity.nameJapanese : entity.name}
            </Heading>
          </Flex>
          <Badge colorScheme={colorScheme}>{entityType}</Badge>
          <Box>
            {entity.dec && <Badge>DEC: {entity.dec}</Badge>}
            {entity.hex && <Badge>HEX: {entity.hex}</Badge>}
          </Box>
        </Stack>

        <Flex>
          {entity.pictureUrl ? (
            <Box position="relative" w="200px" h="200px">
              <Image layout="fill" objectFit="contain" src={entity.pictureUrl ?? ''} />
            </Box>
          ) : (
            <img src={`/api/ogpgen/?text=${entity.name}の画像の設定忘れてるよごめんね!`} />
          )}
        </Flex>
      </Box>
    </>
  );
}
