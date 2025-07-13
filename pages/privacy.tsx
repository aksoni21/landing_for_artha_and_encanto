import React from 'react';

const PrivacyPolicy = () => (
  <div style={{ 
    minHeight: '100vh', 
    backgroundColor: '#f8fafc',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
  }}>
    <main style={{ 
      maxWidth: 800, 
      margin: '0 auto', 
      padding: '40px 24px',
      backgroundColor: 'white',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      borderRadius: '12px',
      marginTop: '40px',
      marginBottom: '40px'
    }}>
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 style={{ 
          fontSize: '2.5rem', 
          fontWeight: '700', 
          color: '#1e293b',
          marginBottom: '8px'
        }}>
          Encanto AI Privacy Policy
        </h1>
        <p style={{ 
          color: '#64748b', 
          fontSize: '1rem',
          margin: 0
        }}>
          Last updated: {new Date().toLocaleDateString()}
        </p>
      </div>

      <div style={{ lineHeight: '1.7', color: '#334155' }}>
        <section style={{ marginBottom: '32px' }}>
          <h2 style={{ 
            fontSize: '1.5rem', 
            fontWeight: '600', 
            color: '#1e293b',
            marginBottom: '16px',
            paddingBottom: '8px',
            borderBottom: '2px solid #e2e8f0'
          }}>
            1. Introduction
          </h2>
          <p style={{ fontSize: '1.1rem', margin: 0 , paddingLeft: '24px' }}>
            Encanto AI (&ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo;) is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and store your information when you use our app and services. We do not share your personal information with third parties.
          </p>
        </section>

        <section style={{ marginBottom: '32px' }}>
          <h2 style={{ 
            fontSize: '1.5rem', 
            fontWeight: '600', 
            color: '#1e293b',
            marginBottom: '16px',
            paddingBottom: '8px',
            borderBottom: '2px solid #e2e8f0'
          }}>
            2. Data We Collect
          </h2>
          <ul style={{ fontSize: '1.1rem', paddingLeft: '24px' }}>
            <li style={{ marginBottom: '12px' }}>
              <strong style={{ color: '#1e293b' }}>Account Information:</strong> Username, email address, and profile details you provide.
            </li>
            <li style={{ marginBottom: '12px' }}>
              <strong style={{ color: '#1e293b' }}>Voice Data:</strong> Speech transcripts (converted to text) for conversation tracking and progress monitoring. Raw audio is not stored or processed beyond real-time transcription.
            </li>
            <li style={{ marginBottom: '12px' }}>
              <strong style={{ color: '#1e293b' }}>Learning Data:</strong> Conversation transcripts, progress tracking (XP, achievements, streaks), and session information for personalized language learning.
            </li>
          </ul>
        </section>

        <section style={{ marginBottom: '32px' }}>
          <h2 style={{ 
            fontSize: '1.5rem', 
            fontWeight: '600', 
            color: '#1e293b',
            marginBottom: '16px',
            paddingBottom: '8px',
            borderBottom: '2px solid #e2e8f0'
          }}>
            3. How We Use Your Data
          </h2>
          <ul style={{ fontSize: '1.1rem', paddingLeft: '24px' }}>
            <li style={{ marginBottom: '12px' }}>To provide and improve our language learning services.</li>
            <li style={{ marginBottom: '12px' }}>To personalize your experience and track your progress.</li>
            <li style={{ marginBottom: '12px' }}>To analyze usage and improve app features.</li>
            <li style={{ marginBottom: '12px' }}>To ensure security and prevent abuse.</li>
          </ul>
        </section>

        <section style={{ marginBottom: '32px' }}>
          <h2 style={{ 
            fontSize: '1.5rem', 
            fontWeight: '600', 
            color: '#1e293b',
            marginBottom: '16px',
            paddingBottom: '8px',
            borderBottom: '2px solid #e2e8f0'
          }}>
            4. Data Storage & Security
          </h2>
          <p style={{ fontSize: '1.1rem', margin: 0 , paddingLeft: '24px' }}>
            Your data is securely stored on our servers and protected using industry-standard security measures. We do not sell your personal data.
          </p>
        </section>

        <section style={{ marginBottom: '32px' }}>
          <h2 style={{ 
            fontSize: '1.5rem', 
            fontWeight: '600', 
            color: '#1e293b',
            marginBottom: '16px',
            paddingBottom: '8px',
            borderBottom: '2px solid #e2e8f0'
          }}>
            5. Sharing & Third Parties
          </h2>
          <p style={{ fontSize: '1.1rem', margin: 0 , paddingLeft: '24px' }}>
            We do not share your personal information with any third parties, advertisers, or external organizations. Your data is used solely for providing and improving our language learning services. We do not sell, rent, or trade your personal information with anyone.
          </p>
        </section>

        <section style={{ marginBottom: '32px' }}>
          <h2 style={{ 
            fontSize: '1.5rem', 
            fontWeight: '600', 
            color: '#1e293b',
            marginBottom: '16px',
            paddingBottom: '8px',
            borderBottom: '2px solid #e2e8f0'
          }}>
            6. User Rights
          </h2>
          <ul style={{ fontSize: '1.1rem', paddingLeft: '24px' }}>
            <li style={{ marginBottom: '12px' }}>
              You can request access to or deletion of your personal data by contacting us at nkr.soni@gmail.com. </li>
            <li style={{ marginBottom: '12px' }}>
              You may update your profile information in the app at any time.
            </li>
          </ul>
        </section>

        <section style={{ marginBottom: '32px' }}>
          <h2 style={{ 
            fontSize: '1.5rem', 
            fontWeight: '600', 
            color: '#1e293b',
            marginBottom: '16px',
            paddingBottom: '8px',
            borderBottom: '2px solid #e2e8f0'
          }}>
            7. Changes to This Policy
          </h2>
          <p style={{ fontSize: '1.1rem', margin: 0 , paddingLeft: '24px' }}>
            We may update this Privacy Policy from time to time. We will notify you of any significant changes via the app or email.
          </p>
        </section>

        <section style={{ marginBottom: '32px' }}>
          <h2 style={{ 
            fontSize: '1.5rem', 
            fontWeight: '600', 
            color: '#1e293b',
            marginBottom: '16px',
            paddingBottom: '8px',
            borderBottom: '2px solid #e2e8f0'
          }}>
            8. Contact Us
          </h2>
          <p style={{ fontSize: '1.1rem', margin: 0 , paddingLeft: '24px' }}>
            If you have any questions or concerns about this Privacy Policy, please contact us at nkr.soni@gmail.com.
          </p>
        </section>
      </div>
    </main>
  </div>
);

export default PrivacyPolicy; 