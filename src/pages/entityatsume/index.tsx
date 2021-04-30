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
  SkeletonText,
  Heading,
} from '@chakra-ui/react';

import Image from 'next/image';

import getRandom from '@/lib/gacha/getRandom';
import LinkChakra from '@/components/common/link-chakra';
import { SingleEntityComponent } from '@/components/partials/entity/single-entity';
import { GetStaticPropsContext } from 'next';
import { GeTableResult } from '@/models/entityatsume/Entity';
import { faGratipay } from '@fortawesome/free-brands-svg-icons';

export default function UsersMe({ ge, table, message }: GeTableResult) {
  const { user } = useAuthentication();
  const router = useRouter();
  const [fetching, setFetching] = useState(false);
  const [updatingProfile, setUpdatingProfile] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const useStaging = router.query.useStaging == 'yes' ?? false;

  let { randomEntity, mutateEntity, error } = getRandom(useStaging);

  useEffect(() => {
    setFetching(false);
  }, [randomEntity]);

  return (
    <Layout
      preview={false}
      meta={{ title: 'エンティティあつめ', desc: 'マイページ' }}
      hideAdsense={true}
    >
      <Box mb={8}>
        <Stack spacing={6}>
          <>
            {randomEntity && (
              <>
                <Modal isOpen={isOpen} onClose={onClose}>
                  <ModalOverlay />
                  <ModalContent minW="80vw">
                    <ModalHeader>ガチャ結果</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                      <SingleEntityComponent entity={randomEntity} />
                      {user && (
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
                      )}
                    </ModalBody>

                    <ModalFooter>
                      <Button colorScheme="blue" onClick={onClose}>
                        閉じる
                      </Button>
                    </ModalFooter>
                  </ModalContent>
                </Modal>
                {randomEntity && randomEntity.pictureUrl ? (
                  <Image width={128} height={128} src={randomEntity.pictureUrl ?? ''} />
                ) : (
                  <img
                    src={`/api/ogpgen/?text=${randomEntity.name}の画像の設定忘れてるよごめんね!`}
                  />
                )}
              </>
            )}

            <Center flexDirection="column">
              {error ? (
                <Badge colorScheme="red">{error} : リロードしてください。</Badge>
              ) : (
                <ButtonGroup>
                  <Stack>
                    <Button
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
                        mutateEntity().then((res: any) => {
                          if (res) {
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
            </Center>
          </>
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
      </Box>
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
