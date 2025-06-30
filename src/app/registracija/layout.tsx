import type { Metadata } from "next";

export const metadata: Metadata = {
  icons: {
    icon: "/favicon.png", // ili "/favicon.ico" ako koristiš .ico
  },
};

export default function RegistracijaLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
} 