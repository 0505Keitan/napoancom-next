export const SITE_NAME = 'ナポアンのマイクラ NEXT';
export const SITE_URL = 'next.napoan.com';
export const CREATOR_ID = 'sasigume';
export const SITE_DESC = '日本最大の個人運営マインクラフト情報サイト 超高速バージョン';
export const SITE_FULL_URL =
  process.env.HTTPS_URL ?? 'https://' + process.env.VERCEL_URL ?? 'https://next.napoan.com';

export const VERCEL_GITHUB_REPOSITORY_TOP =
  'https://github.com/' +
  (process.env.VERCEL_GIT_REPO_OWNER ?? '') +
  '/' +
  (process.env.VERCEL_GIT_REPO_SLUG ?? '');
export const VERCEL_LAST_COMMIT =
  VERCEL_GITHUB_REPOSITORY_TOP + '/commit/' + (process.env.VERCEL_GIT_COMMIT_SHA ?? '');
export const VERCEL_LAST_COMMIT_MESSAGE = process.env.VERCEL_GIT_COMMIT_MESSAGE ?? '';
