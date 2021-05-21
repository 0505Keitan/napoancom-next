import Layout from '@/components/layout';
import ErrorPage from 'next/error';
export default function Custom404() {
  return (
    <Layout preview={false} meta={{ title: 'ページが見つかりませんでした', desc: '' }}>
      <ErrorPage title="ページが見つかりませんでした" statusCode={404} />
    </Layout>
  );
}
