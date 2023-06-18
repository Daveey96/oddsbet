import Head from "next/head";
import "/styles/globals.css";
import Layout from "@/components/layout";

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>Odds Bet</title>
        <link
          rel="shortcut icon"
          href="/favicon.ico"
          type="image/x-icon"
        ></link>
      </Head>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </>
  );
}
