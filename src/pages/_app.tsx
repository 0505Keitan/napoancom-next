import { AppProps } from 'next/app';
import { useEffect } from 'react';
import NextNprogress from 'nextjs-progressbar';
import TagManager from 'react-gtm-module';
import * as gtag from '@/lib/gtag';
import dayjs from 'dayjs';
import 'dayjs/locale/ja';
dayjs.locale('ja');

import addIcon from '@/lib/fontawesome';
import { Chakra } from '@/components/providers/chakra';
import { useRouter } from 'next/router';
import { themeColor } from '../theme/index';
import initApp from '@/lib/firebase';
interface Props {
  shallow: boolean;
}

function App({ Component, pageProps }: AppProps) {
  initApp();
  addIcon();

  useEffect(() => {
    if (typeof localStorage === null) {
      console.error('Cannot use Local Storage!');
    }
    TagManager.initialize({
      gtmId: process.env.GTM_ID,
      dataLayer: {
        hideAdsense: false,
      },
    });
  });

  /* Analytics https://zenn.dev/okumura_daiki/articles/839685a90c06db */
  const router = useRouter();
  useEffect(() => {
    const handleRouteChange = (url: string, { shallow }: Props) => {
      if (!shallow) {
        gtag.pageview(url);
      }
    };
    router.events.on('routeChangeComplete', handleRouteChange);
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router.events]);

  return (
    <Chakra cookies={pageProps.cookies}>
      <NextNprogress color={themeColor} startPosition={0.3} stopDelayMs={200} height={6} />
      <Component {...pageProps} />
    </Chakra>
  );
}

export default App;

// https://chakra-ui.com/docs/features/color-mode
export { getServerSideProps } from '@/components/providers/chakra';
