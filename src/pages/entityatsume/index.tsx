import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import firebaseApi from '@/lib/firebase';
import Layout from '@/components/layout';
import { useAuthentication } from '../../hooks/authentication';
import * as gtag from '@/lib/gtag';
import {
  Box,
  ButtonGroup,
  Stack,
  Button,
  Center,
  Badge,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Heading,
} from '@chakra-ui/react';

import getRandom from '@/lib/gacha/getRandom';
import LinkChakra from '@/components/common/link-chakra';
import { SingleEntityComponent } from '@/components/partials/entity/single-entity';
import { GeTableResult } from '@/models/firebase/entities/entity';
import { UserDoc } from '@/models/firebase/users/userDoc';

export default function UsersMe({ ge, table, message }: GeTableResult) {
  const { user } = useAuthentication();
  const router = useRouter();

  const [fetching, setFetching] = useState(false);
  const [updatingProfile, setUpdatingProfile] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const defaultJewel = parseInt(process.env.ENTITYATSUME_DEFAULT_JEWEL ?? '5640');
  const oneGachaJewel = parseInt(process.env.ENTITYATSUME_ONE_GACHA_JEWEL ?? '100');
  const [userJewel, setUserJewel] = useState(defaultJewel);
  let { randomEntity, mutateEntity, error } = getRandom(
    user ? user.uid : null,
    oneGachaJewel,
    userJewel,
  );

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

  useEffect(() => {
    setFetching(false);
  }, [randomEntity]);

  return (
    <Layout
      preview={false}
      meta={{ title: 'エンティティあつめ', desc: 'マイページ' }}
      hideAdsense={true}
    >
      {user ? (
        <Box mb={8}>
          <Stack spacing={6}>
            <Stack fontSize="xl" mb={8} spacing={4}>
              <Box>現在のジュエル: {userJewel}</Box>
              <Box>ガチャ1回: {oneGachaJewel}</Box>
              {userJewel < oneGachaJewel && <Badge colorScheme="red">ジュエルが足りません！</Badge>}
            </Stack>
            {randomEntity && (
              <>
                <Modal isOpen={isOpen} onClose={onClose}>
                  <ModalOverlay />
                  <ModalContent minW="80vw">
                    <ModalHeader>ガチャ結果</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                      <SingleEntityComponent entity={randomEntity} />

                      <>
                        {randomEntity && randomEntity?.pictureUrl && (
                          <Button
                            isLoading={updatingProfile}
                            onClick={() => {
                              setTimeout(() => {
                                setUpdatingProfile(true);
                                firebaseApi
                                  .auth()
                                  .currentUser?.updateProfile({
                                    photoURL: randomEntity?.pictureUrl,
                                  })
                                  .then(() => {
                                    setUpdatingProfile(false);
                                    router.reload();
                                  });
                              }, 1000);
                            }}
                          >
                            プロフィール画像に設定
                          </Button>
                        )}
                      </>
                    </ModalBody>

                    <ModalFooter>
                      <Button colorScheme="blue" onClick={onClose}>
                        閉じる
                      </Button>
                    </ModalFooter>
                  </ModalContent>
                </Modal>
              </>
            )}

            <Center flexDirection="column">
              {process.env.NODE_ENV == 'development' && (
                <Box bg="gray.200" p={4}>
                  DEBUG
                  <br />
                  fetching : {JSON.stringify(fetching)}
                  <br />
                  randomEntity : {JSON.stringify(randomEntity)}
                  <br />
                  error : {JSON.stringify(error)}
                </Box>
              )}
              {error ? (
                <Badge colorScheme="red">{error} : リロードしてください。</Badge>
              ) : (
                <ButtonGroup>
                  <Stack>
                    <Button
                      disabled={userJewel < oneGachaJewel}
                      isActive={userJewel >= oneGachaJewel}
                      w="full"
                      colorScheme="orange"
                      fontSize="1.4rem"
                      py={6}
                      isLoading={fetching}
                      onClick={() => {
                        if (typeof window !== 'undefined') {
                          gtag.event({
                            action: 'play',
                            category: 'entitygacha',
                            label: 'トップページのガチャ',
                          });
                        }

                        setFetching(true);
                        mutateEntity({ entity: randomEntity }, true).then((res) => {
                          if (res?.entity) {
                            setUserJewel((prev) => prev - oneGachaJewel);
                            onOpen();
                            setFetching(false);
                          }
                        });
                      }}
                    >
                      エンティティガチャを回す
                    </Button>

                    <Button colorScheme="blue" as={LinkChakra} href="/entityatsume/zukan">
                      排出エンティティ一蘭
                    </Button>
                  </Stack>
                </ButtonGroup>
              )}
              {fetching && <Badge>APIに問い合わせ中...</Badge>}
              {message && <Badge>APIよりお知らせ: {message}</Badge>}
            </Center>
          </Stack>
          <Stack>
            <Heading as="h2">確率表</Heading>
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
