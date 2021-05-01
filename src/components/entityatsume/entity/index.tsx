import { Entity } from '@/models/firebase/entities/entity';
import { SimpleGrid } from '@chakra-ui/react';
import LinkChakra from '@/components/common/link-chakra';
import EntityCompact from './entity-compact';
import EntityFull from './entity-full';

interface MultiEntityProps {
  entities: Entity[];
  mode?: string;
}
const Multientities = ({ entities }: MultiEntityProps) => {
  return (
    <SimpleGrid spacing={4} minChildWidth="200px" columns={{ base: 2, lg: 3 }}>
      {entities.map((entity: Entity) => (
        <LinkChakra key={entity.bedrockId} href={`/entityatsume/zukan/${entity.bedrockId}`}>
          <EntityCompact entity={entity} />
        </LinkChakra>
      ))}
    </SimpleGrid>
  );
};

interface EntityListProps {
  entities: Entity[];
  mode?: string;
  expand?: boolean;
}

export const EntityList = ({ entities, mode }: EntityListProps) => {
  if (mode == 'single') {
    return <EntityFull entity={entities[0]} />;
  } else {
    return <Multientities mode={mode} entities={entities} />;
  }
};

export default EntityList;
