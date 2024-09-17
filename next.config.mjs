/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            { hostname: "images.pexels.com" },
            { hostname: "encrypted-tbn0.gstatic.com" },
            { hostname: "avatars.githubusercontent.com" }
        ]
    }
};

export default nextConfig;
