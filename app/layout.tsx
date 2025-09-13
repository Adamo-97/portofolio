import "./global.css";
import { urbanist } from "./fonts";

export const metadata = { title: "portofolio" };

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
