import type { LinksFunction } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLocation,
} from "@remix-run/react";

import styles from "./styles/app.css";
import type { ReactNode } from "react";
import { Hero } from "./components/hero";
import { Container } from "./components/container";

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: styles }];
};

export function meta() {
  return [
    { title: "New Remix App" },
    { charset: "utf-8" },
    { viewport: "width=device-width,initial-scale=1" },
  ];
}

function Document({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}

export default function App() {
  const location = useLocation();

  return (
    <Document>
      <Hero showTitle={location.pathname === "/"} />
      <Outlet />
    </Document>
  );
}

export function ErrorBoundary() {
  return (
    <html>
      <head>
        <title>Oh no!</title>
        <Meta />
        <Links />
      </head>
      <body>
        <Container>
          <h1>Algo deu errado!</h1>
        </Container>
        <Scripts />
      </body>
    </html>
  );
}
