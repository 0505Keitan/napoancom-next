import ErrorPage from 'next/error';
import { Entity } from '@/models/firebase/entities/entity';
import LayoutForEntityAtsume from '@/components/entityatsume/layout';
import { Box, Center, Heading } from '@chakra-ui/react';

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
      <LayoutForEntityAtsume meta={{ title: 'Loading', desc: '' }}>ロード中</LayoutForEntityAtsume>
    );
  } else {
    return (
      <>
        {!firstEntity ? (
          <>
            <LayoutForEntityAtsume meta={{ title: '404 Not found', desc: '' }}>
              <ErrorPage title="エンティティが見つかりませんでした" statusCode={404} />
            </LayoutForEntityAtsume>
          </>
        ) : (
          <LayoutForEntityAtsume
            meta={{
              title: firstEntity.name,
              desc: firstEntity.description ? firstEntity.description : '',
            }}
          >
            <Head>
              <link
                rel="canonical"
                href={`${process.env.HTTPS_URL ?? ''}/entityatsume/zukan/${
                  firstEntity.bedrockId ?? ''
                }/`}
              />
            </Head>
            <Box py={8}>
              {firstEntity && (
                <>
                  <Center mb={6}>
                    <Heading as="h1">{firstEntity.nameJapanese ?? firstEntity.name}</Heading>
                  </Center>
                  <EntityList mode="single" entities={[firstEntity]} expand={preview ?? false} />
                </>
              )}
            </Box>
          </LayoutForEntityAtsume>
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
  const result: { entity?: Entity; message?: string } = await resultRes.json();

  const revalEnv = parseInt(process.env.REVALIDATE ?? '1800');

  if (!result.entity) {
    return {
      notFound: true,
    };
  } else {
    console.info('\x1b[36m%s\x1b[0m', `ISR ready for ${result.entity.name}`);
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
