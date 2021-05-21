// 利用規約警告

import { Badge, Box } from '@chakra-ui/react';

const Warning = () => (
  <Box background="gray.700" color="white" p={6} rounded="xl">
    <div>
      {/* あえて通常のaリンク(Adsenseのページ単位広告が残ってしまうかもしれないので) */}
      <Badge>
        <a href="/eula/">利用規約(タップで読む)</a>
      </Badge>
      に反した投稿は即刻削除します。
    </div>
    <div>
      サーバーサイドのデータは常時同期しているわけではないので、コメントなどの反映には少し時間がかかります。
    </div>
  </Box>
);
export default Warning;
