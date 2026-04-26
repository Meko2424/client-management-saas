import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "Mini CRM SaaS",
  description: "Client, project, and invoice management dashboard",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}

        {/* Toast notifications appear here globally */}
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
