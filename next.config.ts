/** @type {import('next').NextConfig} */
const nextConfig = {

  typescript: {
    // ⚠️ UYARI: TypeScript hataları olsa dahi projenin başarılı bir şekilde derlenmesine izin verir.
    ignoreBuildErrors: true,
  },
  eslint: {
    // İsterseniz ESLint (kod stili/uyarı) hatalarını da derleme sırasında görmezden gelebilirsiniz:
    ignoreDuringBuilds: true,
  },

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
