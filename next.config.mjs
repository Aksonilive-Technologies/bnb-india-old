/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        // Specific domains for image optimization
        domains: [
            'lh3.googleusercontent.com', // Google user profile images
            'firebasestorage.googleapis.com', // Firebase Storage
            'storage.googleapis.com',
        ],
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'firebasestorage.googleapis.com',
                pathname: '**',
            },
            {
                protocol: 'https',
                hostname: 'storage.googleapis.com',
                pathname: '**',
            },
        ],
        // Image optimization settings
        deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048], // Device width breakpoints
        imageSizes: [16, 32, 48, 64, 96, 128, 256, 384], // Image width breakpoints
        formats: ['image/webp', 'image/avif'], // Modern image formats for better compression
        minimumCacheTTL: 60 * 60 * 24 * 7, // Cache optimized images for 7 days
        dangerouslyAllowSVG: false, // Prevent SVG security issues
    },
    // Enable experimental image optimization
    experimental: {
        optimizeCss: true,
        optimisticClientCache: true,
    },
};

export default nextConfig;
