import Head from 'next/head';
import EncantoAILanding from '../components/EncantoAILanding';

export default function EncantoAI() {
  return (
    <>
      <Head>
        <title>Encanto AI - Master Languages Through Natural Voice Conversations</title>
        <meta name="description" content="Practice Spanish and German with AI tutors in real-time voice conversations. Speak naturally, learn effortlessly, and track your progress with Encanto AI." />
        <meta name="keywords" content="language learning, voice conversation, Spanish tutor, German tutor, AI language practice, voice AI, conversation practice" />
        {/* Favicon */}
        <link rel="icon" type="image/svg+xml" href="/encanto-ai-assets/favicon-e.svg" />
        <link rel="icon" type="image/x-icon" href="/encanto-ai-assets/favicon.ico" />
        <link rel="apple-touch-icon" href="/encanto-ai-assets/apple-touch-icon.png" />
        {/* Open Graph */}
        <meta property="og:title" content="Encanto AI - Master Languages Through Natural Voice Conversations" />
        <meta property="og:description" content="Practice Spanish and German with AI tutors in real-time voice conversations. Speak naturally, learn effortlessly." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://encanto-ai.com" />
        <meta property="og:image" content="/encanto-ai-assets/og-image.jpg" />
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Encanto AI - Voice-First Language Learning" />
        <meta name="twitter:description" content="Practice Spanish and German with AI tutors in real-time voice conversations." />
      </Head>
      <EncantoAILanding />
    </>
  );
}
