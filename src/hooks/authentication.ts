import firebase from 'firebase/app';
import { useEffect } from 'react';
import { atom, useRecoilState } from 'recoil';
import { User, UserError } from '@/models/auth/user';
import { SITE_FULL_URL } from '@/lib/constants';
import { UserDoc } from '@/models/firebase/users/userDoc';
const userErrorState = atom<UserError>({
  key: 'userError',
  default: {
    message: '',
  },
});
const userState = atom<User>({
  key: 'user',
  default: null!,
});
const userDataState = atom<UserDoc>({
  key: 'userData',
  default: {
    jewel: 0,
  },
});

export function useAuthentication() {
  const [userError, setUserError] = useRecoilState(userErrorState);
  const [user, setUser] = useRecoilState(userState);
  const [userData, setUserData] = useRecoilState(userDataState);

  useEffect(() => {
    if (user !== null) {
      return;
    }

    firebase
      .auth()
      .signInAnonymously()
      .then((res) => {
        console.info(`Successfully login completed: ${res}`);
      })
      .catch((e) => {
        console.error(e);
        setUserError((prev) => ({ ...prev, message: e }));
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
        // ジュエル数を取得(ガチャ用)
        const userDoc = firebase.firestore().collection('users').doc(loginUser.uid);

        userDoc
          .get()
          .then((doc) => {
            if (doc.exists) {
              const data = doc.data() as UserDoc;
              setUserData({ jewel: data.jewel ?? 0 });
            } else {
              userDoc.set({ jewel: 0 });
            }
            console.info(`Getd user jewel: ${userData.jewel ?? 0}`);
          })
          .catch((e) => console.error(e));
      } else {
        setUserData({ jewel: 0 });
        setUser(null!);
      }
    });
  }, []);

  return { user, userData, userError };
}
