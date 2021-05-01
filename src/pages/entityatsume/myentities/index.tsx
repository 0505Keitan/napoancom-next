import { useRouter } from 'next/router';
import ErrorPage from 'next/error';
import { Entity } from '@/models/firebase/entities/entity';
import { VStack, Divider, Badge, Button } from '@chakra-ui/react';
import Layout from '@/components/layout';
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
      <Layout preview={false} meta={{ title: '404 Not found', desc: '' }} hideAdsense={true}>
        <ErrorPage title="ページが見つかりませんでした" statusCode={404} />
      </Layout>
    );
  }

  return (
    <>
      {!entities ? (
        <Layout preview={false} meta={{ title: '404 Not found', desc: '' }} hideAdsense={true}>
          <ErrorPage title="教科が見つかりませんでした" statusCode={404} />
        </Layout>
      ) : (
        <Layout
          disableAside
          preview={false}
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
        </Layout>
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
