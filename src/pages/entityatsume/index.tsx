import { useEffect, useState } from 'react';
import firebaseApi from '@/lib/firebase';
import Layout from '@/components/layout';
import { useAuthentication } from '../../hooks/authentication';

import { Box, Stack, Button, Badge, Heading } from '@chakra-ui/react';

import getRandom from '@/lib/gacha/getRandom';
import LinkChakra from '@/components/common/link-chakra';
import { GeTableResult } from '@/models/firebase/entities/entity';
import { UserDoc } from '@/models/firebase/users/userDoc';
import GachaDialog from '@/components/entityatsume/gacha-dialog';

export default function EntityAtsumeTop({ ge, table, message }: GeTableResult) {
  const { user } = useAuthentication();

  const defaultJewel = parseInt(process.env.ENTITYATSUME_DEFAULT_JEWEL ?? '5640');
  const oneGachaJewel = parseInt(process.env.ENTITYATSUME_ONE_GACHA_JEWEL ?? '100');
  const [userJewel, setUserJewel] = useState(defaultJewel);

  useEffect(() => {
    if (user) {
      const userDoc = firebaseApi.firestore().collection('users').doc(user.uid);
      userDoc.get().then((doc) => {
        if (doc.exists) {
          const data = doc.data() as UserDoc;
          setUserJewel(data.jewel);
        } else {
          userDoc
            .set({
              jewel: defaultJewel,
            })
            .then(() => {
              console.info(`Set default jewel: ${defaultJewel}`);
            });
        }
      });
    } else {
      setUserJewel(defaultJewel);
    }
  }, [user]);

  return (
    <Layout
      preview={false}
      meta={{ title: 'エンティティあつめ', desc: 'マイページ' }}
      hideAdsense={true}
    >
      {user ? (
        <Box mb={8}>
          <GachaDialog />
          <Stack>
            <Button colorScheme="blue" as={LinkChakra} href="/entityatsume/myentities">
              自分のエンティティ
            </Button>
            <Button colorScheme="blue" as={LinkChakra} href="/entityatsume/zukan">
              排出エンティティ一覧
            </Button>
          </Stack>
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
