import ErrorPage from 'next/error';
import { Entity, EntityResult } from '@/models/firebase/entities/entity';
import Layout from '@/components/layout';
import { Badge, Box, Center, Heading } from '@chakra-ui/react';

import Head from 'next/head';

import EntityList from '@/components/entityatsume/entity';
import { useRouter } from 'next/router';

interface EntityPageProps {
  firstEntity: Entity;
  preview: boolean;
  revalEnv: number;
  message: string;
}

export default function EntityPage({ preview, firstEntity, revalEnv, message }: EntityPageProps) {
  const router = useRouter();

  if (router.isFallback) {
    return (
      <Layout preview={preview} meta={{ title: 'Loading', desc: '' }} hideAdsense={true}>
        ロード中
      </Layout>
    );
  } else {
    return (
      <>
        {!firstEntity ? (
          <>
            <Layout
              preview={preview}
              meta={{ title: '404 Not found', desc: '' }}
              hideAdsense={true}
            >
              <ErrorPage title="記事が見つかりませんでした" statusCode={404} />
            </Layout>
          </>
        ) : (
          <Layout
            hideAdsense={true}
            meta={{
              title: firstEntity.name,
              desc: firstEntity.description ? firstEntity.description : '',
            }}
            revalEnv={revalEnv}
            preview={preview}
          >
            <Head>
              <link
                rel="canonical"
                href={`${process.env.HTTPS_URL ?? ''}/entityatsume/zukan/${
                  firstEntity.bedrockId ?? ''
                }/`}
              />
            </Head>
            <Box py={20}>
              {message && <Badge>{message}</Badge>}
              {preview && <Box>デバッグ: プレビューON</Box>}

              {firstEntity && (
                <>
                  <Center mb={6}>
                    <Heading as="h1">{firstEntity.nameJapanese ?? firstEntity.name}</Heading>
                  </Center>
                  <EntityList mode="single" entities={[firstEntity]} expand={preview ?? false} />
                </>
              )}
            </Box>
          </Layout>
        )}
      </>
    );
  }
}

interface GSProps {
  params: any;
  preview: boolean;
}

export async function getStaticProps({ params, preview }: GSProps) {
  const bedrockId = params.bedrockId;
  let resultRes = await fetch(
    process.env.API_URL + '/entityatsume-getByBedrockId?bedrockId=' + bedrockId,
    {
      method: 'GET',
      headers: {
        Authorization: `${process.env.FUNCTION_AUTH}`,
      },
    },
  );
  const result = await resultRes.json();

  const revalEnv = parseInt(process.env.REVALIDATE ?? '1800');

  if (!result.entity) {
    return {
      notFound: true,
    };
  }
  return {
    props: {
      preview: preview ?? false,
      firstEntity: result.entity ?? null,
      message: result.message ?? null,
      revalEnv: revalEnv,
    },
    revalidate: revalEnv,
  };
}

export async function getStaticPaths() {
  const allEntitiesRes = await fetch(process.env.API_URL + '/entityatsume-getAll', {
    method: 'GET',
    headers: {
      Authorization: `${process.env.FUNCTION_AUTH}`,
    },
  });

  const allEntitiesData = await allEntitiesRes.json();
  let paths: string[] = [];
  if (allEntitiesData.entities) {
    paths =
      allEntitiesData.entities.map(
        (entity: Entity) => `/entityatsume/zukan/${entity.bedrockId}/`,
      ) ?? [];
  }
  return {
    paths: paths,
    fallback: true,
  };
}
