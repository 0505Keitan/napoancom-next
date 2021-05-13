import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import firebaseApi from '@/lib/firebase';
import { useAuthentication } from '../../hooks/authentication';
import * as gtag from '@/lib/gtag';
import {
  Box,
  Stack,
  Button,
  Center,
  Badge,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
} from '@chakra-ui/react';

import getRandom from '@/lib/gacha/getRandom';
import { UserDoc } from '@/models/firebase/users/userDoc';
import EntityFull from './entity/entity-full';

const GachaDialog = () => {
  const { user } = useAuthentication();
  const router = useRouter();

  const [fetching, setFetching] = useState(false);
  const [updatingProfile, setUpdatingProfile] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const defaultJewel = parseInt(process.env.ENTITYATSUME_DEFAULT_JEWEL ?? '5640');
  const oneGachaJewel = parseInt(process.env.ENTITYATSUME_ONE_GACHA_JEWEL ?? '100');
  const [userJewel, setUserJewel] = useState(defaultJewel);
  let { randomEntity, mutateEntity, error } = getRandom(user ? user.uid : null, oneGachaJewel);

  useEffect(() => {
    if (user) {
      const userDoc = firebaseApi.firestore().collection('users').doc(user.uid);
      userDoc.get().then((doc) => {
        if (doc.exists) {
          const data = doc.data() as UserDoc;
          setUserJewel(data.jewel);
        } else {
          userDoc.set({
            jewel: defaultJewel,
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
    <Stack spacing={6} mx="auto">
      <Stack fontSize="xl" mb={8} spacing={4}>
        <Badge>ジュエルは記事にグッド・バッドいずれかを付ければ増えます。</Badge>
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
                        }, 300);
                      }}
                    >
                      プロフィール画像に設定
                    </Button>
                  )}
                </>
                <EntityFull entity={randomEntity} />
              </ModalBody>
            </ModalContent>
          </Modal>
        </>
      )}

      <Center flexDirection="column">
        {error ? (
          <Badge colorScheme="red">{error} : リロードしてください。</Badge>
        ) : (
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
                if (res) {
                  setUserJewel((prev) => prev - oneGachaJewel);
                  onOpen();
                  setFetching(false);
                }
              });
            }}
          >
            エンティティガチャを回す
          </Button>
        )}
        {fetching && <Badge>APIに問い合わせ中...</Badge>}
      </Center>
    </Stack>
  );
};

export default GachaDialog;
