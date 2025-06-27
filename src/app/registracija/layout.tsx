import type { Metadata } from "next";

export const metadata: Metadata = {
  icons: {
    icon: "ikonice/human-resources.svg", // ili "/favicon.ico" ako koristiš .ico
  },
};

export default function RegistracijaLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
} 