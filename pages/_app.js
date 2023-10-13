import Head from "next/head";
import "/styles/globals.css";
import "keen-slider/keen-slider.min.css";
import Layout from "@/components/layout";
import Index from "@/components/extras";

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>Oddsbet</title>
        <link rel="shortcut icon" href="/favicon.svg"></link>
      </Head>
      <Index />
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </>
  );
}
