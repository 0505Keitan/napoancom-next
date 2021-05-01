import { useRouter } from 'next/router';
import ErrorPage from 'next/error';
import { Entity } from '@/models/firebase/entities/entity';
import { VStack, Divider, Badge } from '@chakra-ui/react';
import Layout from '@/components/layout';
import EntityList from '@/components/partials/entity/';

interface EntityIndexProps {
  entities: Entity[];
  preview: boolean;
  message: string;
}

export default function EntityIndex({ entities, preview, message }: EntityIndexProps) {
  const router = useRouter();

  if (!router.isFallback && !entities) {
    return (
      <Layout preview={preview} meta={{ title: '404 Not found', desc: '' }} hideAdsense={true}>
        <ErrorPage title="ページが見つかりませんでした" statusCode={404} />
      </Layout>
    );
  }

  return (
    <>
      {!entities ? (
        <Layout preview={preview} meta={{ title: '404 Not found', desc: '' }} hideAdsense={true}>
          <ErrorPage title="教科が見つかりませんでした" statusCode={404} />
        </Layout>
      ) : (
        <Layout
          disableAside
          preview={preview}
          meta={{ title: 'エンティティの一覧', desc: 'エンティティの一覧' }}
        >
          <VStack textStyle="h1" spacing={4} mb={8}>
            <h1>エンティティの一覧</h1>
            {message && <Badge>{message}</Badge>}
            <Divider />
          </VStack>
          {entities && entities.length > 0 && <EntityList entities={entities} />}
        </Layout>
      )}
    </>
  );
}

interface GSProps {
  params: any;
  preview: boolean;
}

export async function getStaticProps({ preview }: GSProps) {
  const allEntitiesRes = await fetch(process.env.API_URL + '/entityatsume-getAll', {
    method: 'GET',
    headers: {
      Authorization: `${process.env.FUNCTION_AUTH}`,
    },
  });

  const allEntitiesData = await allEntitiesRes.json();

  return {
    props: {
      preview: preview ?? false,
      entities: allEntitiesData.entities ?? null,
      message: allEntitiesData.message ?? null,
    },
    revalidate: 300,
  };
}
