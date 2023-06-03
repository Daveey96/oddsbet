import Head from "next/head";
import "/styles/globals.css";
import Layout from "@/components/layout";
// <SessionProvider session={pageProps.session}>

export default function App({ Component, pageProps }) {
  return (
    <Layout>
      <Head>
        <title>odds</title>
        <link
          rel="shortcut icon"
          href="/favicon.ico"
          type="image/x-icon"
        ></link>
      </Head>
      <Component {...pageProps} />
    </Layout>
  );
}
