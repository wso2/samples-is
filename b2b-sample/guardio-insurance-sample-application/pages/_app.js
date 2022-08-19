import { SessionProvider } from "next-auth/react";
import Head from "next/head";
import "rsuite/dist/rsuite.min.css";
import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
  return (
    <SessionProvider session={pageProps?.session}>
       <Head>
        <title>Guardio Insurance</title>
        <meta name="description" content="Guardio Insurance" />
      </Head>

      <Component {...pageProps} />
    </SessionProvider>
  )
}

export default MyApp
