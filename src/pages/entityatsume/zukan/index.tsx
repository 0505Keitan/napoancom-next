import { useRouter } from 'next/router';
import ErrorPage from 'next/error';
import { Entity } from '@/models/firebase/entities/entity';
import { VStack, Divider, Badge } from '@chakra-ui/react';
import LayoutForEntityAtsume from '@/components/entityatsume/layout';
import EntityList from '@/components/entityatsume/entity';

interface EntityIndexProps {
  entities: Entity[];

  message: string;
}

export default function EntityIndex({ entities, message }: EntityIndexProps) {
  const router = useRouter();

  if (!router.isFallback && !entities) {
    return (
      <LayoutForEntityAtsume meta={{ title: '404 Not found', desc: '' }}>
        <ErrorPage title="ページが見つかりませんでした" statusCode={404} />
      </LayoutForEntityAtsume>
    );
  }

  return (
    <>
      {!entities ? (
        <LayoutForEntityAtsume meta={{ title: '404 Not found', desc: '' }}>
          <ErrorPage title="教科が見つかりませんでした" statusCode={404} />
        </LayoutForEntityAtsume>
      ) : (
        <LayoutForEntityAtsume meta={{ title: 'エンティティの一覧', desc: 'エンティティの一覧' }}>
          <VStack textStyle="h1" spacing={4} mb={8}>
            <h1>エンティティの一覧</h1>
            {message && <Badge>{message}</Badge>}
            <Divider />
          </VStack>
          {entities && entities.length > 0 && <EntityList entities={entities} />}
        </LayoutForEntityAtsume>
      )}
    </>
  );
}

export async function getStaticProps() {
  const allEntitiesRes = await fetch(process.env.API_URL + '/entityatsume-getAll', {
    method: 'GET',
    headers: {
      Authorization: `${process.env.FUNCTION_AUTH}`,
    },
  });

  const allEntitiesData = await allEntitiesRes.json().then((res) => {
    console.info('\x1b[36m%s\x1b[0m', `Entity list ready`);
    return res;
  });

  return {
    props: {
      entities: allEntitiesData.entities ?? null,
      message: allEntitiesData.message ?? null,
    },
    revalidate: 300,
  };
}
