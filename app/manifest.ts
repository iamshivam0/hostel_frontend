import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'NIVAS',
        short_name: 'NIVAS',
        description: 'NIVAS',
        start_url: '/',
        display: 'standalone',
        background_color: '#111827',
        theme_color: '#111827',
        icons: [
            {
                "src": "/icons/icon-192x192.png",
                "type": "image/png",
                "sizes": "192x192"
            },
            {
                "src": "/icons/icon-512x512.png",
                "type": "image/png",
                "sizes": "512x512"
            }
        ],
    }
}