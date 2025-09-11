import "./global.css";
import { urbanist } from "./fonts";

export const metadata = { title: "portofolio" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={urbanist.variable}>
      <body className="antialiased">{children}</body>
    </html>
  );
}
