//const path = require('path');
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});
module.exports = withBundleAnalyzer({
  // add slash for Twitter card
  // OGPのためにスラッシュ
  trailingSlash: true,
  env: {
    CONTENTFUL_SPACE_ID: process.env.CONTENTFUL_SPACE_ID,
    CONTENTFUL_PREVIEW_SECRET: process.env.CONTENTFUL_PREVIEW_SECRET,
    FIREBASE_API_KEY: process.env.FIREBASE_API_KEY,
    FIREBASE_AUTH_DOMAIN: process.env.FIREBASE_AUTH_DOMAIN,
    FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID,
    FIREBASE_STORAGE_BUCKET: process.env.FIREBASE_STORAGE_BUCKET,
    FIREBASE_MESSAGING_SENDER_ID: process.env.FIREBASE_MESSAGING_SENDER_ID,
    FIREBASE_APP_ID: process.env.FIREBASE_APP_ID,
    HTTPS_URL: process.env.HTTPS_URL,
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
    FUNCTION_AUTH: process.env.FUNCTION_AUTH,
    AD_DELAY: process.env.AD_DELAY,
  },
  images: {
    domains: ['localhost', 'cdn-ak.f.st-hatena.com', 'pbs.twimg.com', 'images.ctfassets.net'],
  },
  future: {
    webpack5: true,
  },
});
