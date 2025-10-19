import "./global.css";
import { urbanist } from "./fonts";

export const metadata = {
  title: "Adam Abdullah - Software Engineer Portfolio",
  description:
    "Portfolio showcasing expertise in Next.js, React, TypeScript, Tailwind CSS, and modern web development. Explore my projects, skills, and professional journey.",
  keywords: [
    "portfolio",
    "software engineer",
    "full stack developer",
    "React",
    "Next.js",
    "TypeScript",
    "Tailwind CSS",
    "web development",
    "Adam Abdullah",
  ],
  authors: [{ name: "Adam Abdullah" }],
  creator: "Adam Abdullah",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://your-project.vercel.app", // Update this with your actual Vercel URL after deployment
    title: "Adam Abdullah - Software Engineer Portfolio",
    description:
      "Portfolio showcasing expertise in Next.js, React, TypeScript, and modern web development.",
    siteName: "Adam Abdullah Portfolio",
  },
  twitter: {
    card: "summary_large_image",
    title: "Adam Abdullah - Software Engineer Portfolio",
    description:
      "Portfolio showcasing expertise in Next.js, React, TypeScript, and modern web development.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/logo1.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "any" }, // Fallback for browsers that don't support SVG favicons
    ],
    apple: "/logo1.svg",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // Make the root viewport-height and non-scrollable
    <html lang="en" className={`${urbanist.variable} h-dvh`}>
      <body className="antialiased h-full overflow-hidden bg-black text-white">
        {children}
      </body>
    </html>
  );
}
