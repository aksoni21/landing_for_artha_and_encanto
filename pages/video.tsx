import React from 'react';
import Head from 'next/head';

export default function Video() {
  return (
    <>
      <Head>
        <title>Video - Encanto AI</title>
        <meta name="description" content="Encanto Demo Video" />
      </Head>
      <div style={{ margin: 0, padding: 0, height: '100vh', overflow: 'hidden' }}>
        <video
          autoPlay
          loop
          muted
          playsInline
          controls
          style={{
            width: '100%',
            height: '100vh',
            objectFit: 'contain',
            backgroundColor: 'black'
          }}
        >
          <source src="/Encanto Demo Video.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
    </>
  );
}
