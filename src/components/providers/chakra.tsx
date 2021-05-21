import { ChakraProvider, cookieStorageManager, localStorageManager } from '@chakra-ui/react';
import { ReactNode } from 'react';
import { theme } from '@/theme/index';
interface Props {
  cookies: any;
  children: ReactNode;
}

// チャクラプロバイダーにカラーモードのクッキーを与えるために、さらにこのコンポーネントで包みます
export function Chakra({ cookies, children }: Props) {
  const colorModeManager =
    typeof cookies === 'string' ? cookieStorageManager(cookies) : localStorageManager;
  return (
    <ChakraProvider colorModeManager={colorModeManager} theme={theme}>
      {children}
    </ChakraProvider>
  );
}
export function getServerSideProps({ req }: any) {
  return {
    props: {
      cookies: req.headers.cookie ?? '',
    },
  };
}
