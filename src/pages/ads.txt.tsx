import { GetServerSidePropsContext } from 'next';
// 広告掲載用
export const getServerSideProps = async ({ res }: GetServerSidePropsContext) => {
  const text = `google.com, ${process.env.GOOGLE_AD_CLIENT}, DIRECT, ${process.env.ADSENSE_AUTH_ID}`;

  res.statusCode = 200;
  res.setHeader('Cache-Control', `s-maxage=86400, stale-while-revalidate`);
  res.setHeader('Content-Type', 'text/plain');
  res.end(text);

  console.info('\x1b[36m%s\x1b[0m', `Ads.txt ready`);

  return {
    props: {},
  };
};

const Page = () => null;
export default Page;
