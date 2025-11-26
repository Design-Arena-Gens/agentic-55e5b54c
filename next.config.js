/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    typedRoutes: true
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'placehold.co' },
      { protocol: 'https', hostname: '**' }
    ]
  },
  env: {
    // Affiliate example tags; override in Vercel env
    AMAZON_TAG: process.env.AMAZON_TAG,
    MERCADO_LIVRE_TAG: process.env.MERCADO_LIVRE_TAG,
    SHOPEE_TAG: process.env.SHOPEE_TAG,
    MAGALU_TAG: process.env.MAGALU_TAG,
    CLICKBANK_NICK: process.env.CLICKBANK_NICK,
    HOTMART_ID: process.env.HOTMART_ID,
    EDUZZ_ID: process.env.EDUZZ_ID,
    KIWIFY_ID: process.env.KIWIFY_ID,
    BRAIP_ID: process.env.BRAIP_ID,
    NANOBANANA_API_URL: process.env.NANOBANANA_API_URL,
    NANOBANANA_API_KEY: process.env.NANOBANANA_API_KEY,
    LANGUAGETOOL_API_URL: process.env.LANGUAGETOOL_API_URL || 'https://api.languagetool.org/v2/check'
  }
};

module.exports = nextConfig;
