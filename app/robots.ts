import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/'],
    },
    // Update this with your actual Vercel URL after deployment
    sitemap: 'https://your-project.vercel.app/sitemap.xml',
  };
}
