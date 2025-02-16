import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'HMS',
        short_name: 'HMS',
        description: 'Hostel APP',
        start_url: '/',
        display: 'standalone',
        background_color: '#111827',
        theme_color: '#111827',
        icons: [
            {
                src: '/favicon.ico',
                sizes: 'any',
                type: 'image/x-icon',
            },
        ],
    }
}