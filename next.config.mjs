/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        // Uncomment the 'domains' array if you want to specify certain domains only
        // domains: ['lh3.googleusercontent.com'],
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '**',
                port: '', // Optional, remove if not needed
                pathname: '**',
            },
        ],
    },
};

export default nextConfig;
