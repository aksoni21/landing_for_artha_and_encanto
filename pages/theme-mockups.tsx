import React from 'react';
import Head from 'next/head';
import { ThemeMockups } from '../components/assessment/theme-mockups/ThemeMockups';

export default function ThemeMockupsPage() {
  return (
    <>
      <Head>
        <title>UI Theme Options - Casco Antiguo Assessment</title>
        <meta name="description" content="Visual theme options for Casco Antiguo Spanish School assessment platform" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <ThemeMockups />
    </>
  );
}