import RepoInfo from '@/components/common/repo-info';
import { CREATOR_ID } from '@/lib/constants';

export default function Custom500() {
  return (
    <div>
      <h1>サーバーサイドで問題が発生してるみたいです...</h1>

      <p>
        <a href={`https://twitter.com/${CREATOR_ID}`}>https://twitter.com/{CREATOR_ID}</a>
        にスクショと共にご報告いただければ助かります。
      </p>
      <p>
        もしかして: プレビュー用Cookieが消去されていないのかもしれません。
        <a href="/api/preview?exit=yes">こちら</a>をクリックしてみてください。
      </p>
      <RepoInfo />
    </div>
  );
}
