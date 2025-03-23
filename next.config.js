/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://codevigil-alb-1904715017.us-east-2.elb.amazonaws.com/api/:path*',
      },
    ];
  },
};

module.exports = nextConfig;
