import Head from 'next/head';
import ArthaFutureLanding from '../../components/ArthaFutureLanding';

export default function ArthaFuture() {
  return (
    <>
      <Head>
        <title>Artha Investments - Investing Made Simple for Indian Markets</title>
        <meta name="description" content="Learn to invest in Indian markets with confidence. Free educational content on ETFs, stocks, and macroeconomics for retail investors and NRIs." />
        <meta name="keywords" content="Indian investing, ETFs, stock market, personal finance, NRI investments, mutual funds, SIP, Indian markets" />
        <link rel="icon" href="/artha-future-assets/favicon.ico" />
        <meta property="og:title" content="Artha Investments - Investing Made Simple for Indian Markets" />
        <meta property="og:description" content="Free educational content on Indian markets, ETFs, and stock investing for beginners" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://artha-investments.com" />
      </Head>
      <ArthaFutureLanding />
    </>
  );
} 