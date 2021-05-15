//const path = require('path');
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});
module.exports = withBundleAnalyzer({
  // add slash for Twitter card
  trailingSlash: true,
  async redirects() {
    return [
      {
        // 2021-05-14追加
        source: '/bedrock-friend-multiplayer-guide/',
        destination:
          'https://md.napoan.com/docs/minecraft/howto/bedrock-friend-multiplayer-guide/intro',
        permanent: true,
      },
      {
        source: '/bedrock-command-list/',
        destination: 'https://md.napoan.com/docs/minecraft/reference/command-bedrock/intro',
        permanent: true,
      },
      {
        source: '/bedrock-command-list-command-:name/',
        destination: 'https://md.napoan.com/docs/minecraft/reference/command-bedrock/:name',
        permanent: true,
      },
      {
        source: '/bedrock-command-list-command-:name',
        destination: 'https://md.napoan.com/docs/minecraft/reference/command-bedrock/:name',
        permanent: true,
      },
      // 2021-05-15追加
      {
        source: '/new-way-to-install-mod/',
        destination: 'https://md.napoan.com/docs/minecraft/howto/install-forge/intro',
        permanent: true,
      },
      {
        source: '/optifine-setup-guide/',
        destination: 'https://md.napoan.com/docs/minecraft/howto/install-optifine/intro',
        permanent: true,
      },
    ];
  },
  env: {
    CONTENTFUL_SPACE_ID: process.env.CONTENTFUL_SPACE_ID,
    CONTENTFUL_PREVIEW_SECRET: process.env.CONTENTFUL_PREVIEW_SECRET,
    FIREBASE_API_KEY: process.env.FIREBASE_API_KEY,
    FIREBASE_AUTH_DOMAIN: process.env.FIREBASE_AUTH_DOMAIN,
    FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID,
    FIREBASE_STORAGE_BUCKET: process.env.FIREBASE_STORAGE_BUCKET,
    FIREBASE_MESSEGING_SENDER_ID: process.env.FIREBASE_MESSEGING_SENDER_ID,
    FIREBASE_APP_ID: process.env.FIREBASE_APP_ID,
    FIREBASE_MEASUREMENT_ID: process.env.FIREBASE_MEASUREMENT_ID,
    HTTPS_URL: process.env.HTTPS_URL,
    TWITTER_SECRET: process.env.TWITTER_SECRET,
    TWITTER_BEARER: process.env.TWITTER_BEARER,
    API_URL: process.env.API_URL,
    REVALIDATE_HOME: process.env.REVALIDATE_HOME,
    REVALIDATE_SINGLE: process.env.REVALIDATE_SINGLE,
    REVALIDATE_ARCHIVE: process.env.REVALIDATE_ARCHIVE,
    REVALIDATE_RSSSITEMAP: process.env.REVALIDATE_RSSSITEMAP,
    GOOGLE_AD_CLIENT: process.env.GOOGLE_AD_CLIENT,
    ENABLE_AD: process.env.ENABLE_AD,
    PAGINATION: process.env.PAGINATION,
    TOTAL_PAGINATION: process.env.TOTAL_PAGINATION,
    ADSENSE_AUTH_ID: process.env.ADSENSE_AUTH_ID,
    GTM_ID: process.env.GTM_ID,
    VERCEL_GIT_REPO_OWNER: process.env.VERCEL_GIT_REPO_OWNER,
    VERCEL_GIT_REPO_SLUG: process.env.VERCEL_GIT_REPO_SLUG,
    VERCEL_GIT_COMMIT_SHA: process.env.VERCEL_GIT_COMMIT_SHA,
    VERCEL_GIT_COMMIT_MESSAGE: process.env.VERCEL_GIT_COMMIT_MESSAGE,
    VERCEL_URL: process.env.VERCEL_URL,
    NAPOANCOM_NEST_URL: process.env.NAPOANCOM_NEST_URL,
    NAPOANCOM_NEST_URL_STATING: process.env.NAPOANCOM_NEST_URL_STATING,
    NAPOANCOM_NEST_SECRET: process.env.NAPOANCOM_NEST_SECRET,
    NAPOANCOM_NEST_LIMIT: process.env.NAPOANCOM_NEST_LIMIT,
    FUNCTION_AUTH: process.env.FUNCTION_AUTH,
    AD_DELAY: process.env.AD_DELAY,
    ENTITYATSUME_DEFAULT_JEWEL: process.env.ENTITYATSUME_DEFAULT_JEWEL,
    ENTITYATSUME_ONE_GACHA_JEWEL: process.env.ENTITYATSUME_ONE_GACHA_JEWEL,
  },
  images: {
    domains: ['localhost', 'static.wikia.nocookie.net', 'pbs.twimg.com', 'images.ctfassets.net'],
  },
  future: {
    webpack5: true,
  },
});
