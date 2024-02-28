import type { Metadata } from "next";
import React from "react";

import "../../styles/globals.css";

export const metadata: Metadata = {
  title: "Bob-Builder",
  description: "Bob-Builder",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
