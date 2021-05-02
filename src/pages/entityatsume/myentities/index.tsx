import { useRouter } from 'next/router';
import ErrorPage from 'next/error';
import { Entity } from '@/models/firebase/entities/entity';
import { VStack, Divider, Badge, Button, Box } from '@chakra-ui/react';
import LayoutForEntityAtsume from '@/components/entityatsume/layout';
import EntityList from '@/components/entityatsume/entity';
import { GetServerSidePropsContext } from 'next';
import { UserResult } from '@/models/firebase/users/userDoc';
import LinkChakra from '@/components/common/link-chakra';

interface EntityIndexProps {
  entities: Entity[];
  message: string;
}

export default function MyEntities({ entities, message }: EntityIndexProps) {
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
        <LayoutForEntityAtsume
          meta={{ title: '自分のエンティティ一覧', desc: 'エンティティの一覧' }}
        >
          <VStack textStyle="h1" spacing={4} mb={8}>
            <h1>自分のエンティティ一覧</h1>
            {message && <Badge>APIより: {message}</Badge>}
            <Button colorScheme="blue" as={LinkChakra} href="/entityatsume/zukan">
              排出エンティティ一覧
            </Button>
            <Divider />
          </VStack>
          {entities && entities.length > 0 && <EntityList entities={entities} />}
          {entities && entities.length == 0 && (
            <Box my={8}>
              まだガチャを引いていないか、データが消えました。(5/1以前のガチャは反映されません)
            </Box>
          )}
        </LayoutForEntityAtsume>
      )}
    </>
  );
}

export async function getServerSideProps({ query }: GetServerSidePropsContext) {
  const user = query.user as string | undefined;
  const allEntitiesRes = await fetch(
    process.env.API_URL + `/entityatsume-getUserEntities?user=${user}`,
    {
      method: 'GET',
      headers: {
        Authorization: `${process.env.FUNCTION_AUTH}`,
      },
    },
  );

  const allEntitiesData = (await allEntitiesRes.json()) as UserResult;

  return {
    props: {
      entities: allEntitiesData.entities ?? null,
      jewel: allEntitiesData.jewel ?? null,
      message: allEntitiesData.message ?? null,
    },
  };
}
