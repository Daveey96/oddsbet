import Head from "next/head";
import "/styles/globals.css";
import Layout from "@/components/layout";

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>Oddsbet</title>
        <link rel="shortcut icon" href="/favicon.svg"></link>
      </Head>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </>
  );
}
