import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Buzz",
    template: "%s · Buzz",
  },
  description: "A personal, accessible job application tracker.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en-GB">
      <body>{children}</body>
    </html>
  );
}
