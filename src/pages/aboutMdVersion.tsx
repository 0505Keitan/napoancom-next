import { Box, Button, Heading, Stack } from '@chakra-ui/react';
import Layout from '@/components/layout';
import LinkChakra from '@/components/common/link-chakra';
import ToMdVersion from '@/components/common/buttons/to-md-version';

const AboutMdVersion = () => {
  return (
    <Layout preview={false} meta={{ title: 'MDバージョンについて', desc: 'MDバージョンについて' }}>
      <Heading as="h1" pb={8}>
        MDバージョンについて
      </Heading>
      <Stack spacing={6}>
        <Box>
          管理人が更新できなくなった時のために、公益性の高い記事については別の公開手段を用意しました。
        </Box>
        <Box>
          MarkdownをMITライセンスでGitHubで公開し、ドキュメントのように誰でも編集可能にしています。
        </Box>
        <ToMdVersion />
      </Stack>
    </Layout>
  );
};

export default AboutMdVersion;
