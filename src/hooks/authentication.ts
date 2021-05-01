import firebase from 'firebase/app';
import { useEffect } from 'react';
import { atom, useRecoilState } from 'recoil';
import { User } from '@/models/auth/user';
import { SITE_FULL_URL } from '@/lib/constants';

const userState = atom<User>({
  key: 'user',
  default: null!,
});

export function useAuthentication() {
  const [user, setUser] = useRecoilState(userState);

  useEffect(() => {
    if (user !== null) {
      return;
    }

    firebase
      .auth()
      .signInAnonymously()
      .then((res) => {
        console.info('Successfully login completed: ', res);
      })
      .catch((e) => {
        console.error(e);
      });

    /* const provider = new firebase.auth.TwitterAuthProvider();
    firebase
      .auth()
      .signInWithPopup(provider)
      .catch(function (error) {
        console.error(error);
      }); */

    firebase.auth().onAuthStateChanged(function (firebaseUser) {
      if (firebaseUser) {
        const loginUser: User = {
          uid: firebaseUser.uid,
          isAnonymous: firebaseUser.isAnonymous,
          name: firebaseUser.displayName ?? '未設定',
          email: firebaseUser.email ?? '',
          photoURL: firebaseUser.photoURL ?? `${SITE_FULL_URL}/favicon.png`,
        };
        setUser(loginUser);
      } else {
        setUser(null!);
      }
    });
  }, []);

  return { user };
}
