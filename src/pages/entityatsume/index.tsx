import Layout from '@/components/layout';
import { useAuthentication } from '../../hooks/authentication';

import { Box, Stack, HStack, Button, Badge, Heading } from '@chakra-ui/react';

import LinkChakra from '@/components/common/link-chakra';
import { GeTableResult } from '@/models/firebase/entities/entity';
import GachaDialog from '@/components/entityatsume/gacha-dialog';

export default function EntityAtsumeTop({ ge, table, message }: GeTableResult) {
  const { user } = useAuthentication();

  return (
    <Layout
      preview={false}
      meta={{ title: 'エンティティあつめ', desc: 'マイページ' }}
      hideAdsense={true}
    >
      {user ? (
        <Box mb={8}>
          <GachaDialog />
          <HStack spacing={4} my={6}>
            <Button
              colorScheme="blue"
              as={LinkChakra}
              href={`/entityatsume/myentities?user=${user.uid}`}
            >
              自分のエンティティ
            </Button>
            <Button colorScheme="blue" as={LinkChakra} href="/entityatsume/zukan">
              排出エンティティ一覧
            </Button>
          </HStack>
          <Stack>
            <Heading as="h2">確率表</Heading>
            {message && <Badge>APIより: {message}</Badge>}
            {ge && (
              <>
                {ge.map((t, n) => (
                  <Box p={4} key={n} mb={4} bg="gray.100">
                    <Heading as="h3">レアリティ{t.rarelity}</Heading>
                    <Badge fontSize="xl">出やすさ: {t.prob}</Badge>
                    <Box>{t.ids.join(', ')}</Box>
                  </Box>
                ))}
              </>
            )}
            {table && (
              <Box bg="gray.200" p={6} textAlign="left">
                <table>
                  <tr>
                    <th>ID</th> <th>出やすさ</th>
                  </tr>
                  {table.map((t, n) => (
                    <tr key={n}>
                      <th>
                        <Badge mr={4}>{t[0]}</Badge>
                      </th>{' '}
                      <td>{t[1]}</td>
                    </tr>
                  ))}
                </table>
              </Box>
            )}
          </Stack>
        </Box>
      ) : (
        <Box>サインイン処理中...</Box>
      )}
    </Layout>
  );
}

export async function getStaticProps() {
  const geTableRes = await fetch(`${process.env.API_URL}/entityatsume-getGroupedEntitiesAndTable`, {
    headers: {
      Authorization: process.env.FUNCTION_AUTH ?? '',
    },
  });

  const geTable = await geTableRes.json().then((data) => {
    return data as GeTableResult;
  });

  return {
    props: {
      ge: geTable.ge ?? null,
      table: geTable.table ?? null,
      message: geTable.message ?? null,
    },
    revalidate: 300,
  };
}
