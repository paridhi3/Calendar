import "./globals.css";
import { ReactNode } from "react";
import Provider from "./provider";
import Header from "../components/Header";

export const metadata = {
  title: "Calendar",
  description: "Calendar app with Next.js, Tailwind & Prisma",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/images/logo.png" type="image/png" />
      </head>
      <body>
        <div>
          <Provider>
            <Header />
            {children}
          </Provider>
        </div>
      </body>
    </html>
  );
}
