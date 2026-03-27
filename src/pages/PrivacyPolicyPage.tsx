// pages/PrivacyPolicyPage.tsx
import { useEffect } from 'react';
import { Navigation } from '../components/Navigation';

export default function PrivacyPolicyPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Navigation />
      <div style={{ minHeight: '100dvh', backgroundColor: '#101214', padding: '80px 24px 60px' }}>
        <div style={{ maxWidth: 720, margin: '0 auto' }}>
          <h1 style={{ color: '#f5f5f5', fontSize: 28, fontWeight: 600, marginBottom: 8 }}>
            Privacy Policy
          </h1>
          <p style={{ color: '#8a8a8a', fontSize: 14, marginBottom: 40 }}>
            Last updated: March 27, 2026
          </p>

          <Section title="Overview">
            J Studios ("we", "us", or "our") operates the J Studios Barbers booking platform at
            jstudiosbarbers.com. This policy explains what information we collect, how we use it,
            and your rights regarding that information.
          </Section>

          <Section title="Information We Collect">
            When you create an account or book an appointment, we collect:
            <ul style={{ marginTop: 12, paddingLeft: 20, lineHeight: 2 }}>
              <li>Name, email address, and phone number</li>
              <li>Appointment history and preferences</li>
              <li>Reward points balance</li>
              <li>If you sign in with Google, your Google account name and email</li>
            </ul>
          </Section>

          <Section title="How We Use Your Information">
            We use your information to:
            <ul style={{ marginTop: 12, paddingLeft: 20, lineHeight: 2 }}>
              <li>Create and manage your account</li>
              <li>Book and confirm appointments</li>
              <li>Send appointment confirmation and reminder emails</li>
              <li>Track and apply reward points</li>
              <li>Respond to customer support requests</li>
            </ul>
            We do not sell your personal information to third parties.
          </Section>

          <Section title="Data Storage">
            Your data is stored securely using Supabase, a hosted database platform. Data is
            encrypted in transit and at rest. We retain your account data for as long as your
            account is active. You may request deletion at any time.
          </Section>

          <Section title="Google Sign-In">
            If you choose to sign in with Google, we receive your name and email address from
            Google. We do not receive your Google password or access to any other Google services.
          </Section>

          <Section title="Your Rights">
            You have the right to:
            <ul style={{ marginTop: 12, paddingLeft: 20, lineHeight: 2 }}>
              <li>Access the personal data we hold about you</li>
              <li>Request correction of inaccurate data</li>
              <li>Request deletion of your account and associated data</li>
            </ul>
            To exercise these rights, contact us at{' '}
            <a href="mailto:cortefino962@gmail.com" style={{ color: '#96cfe0' }}>
              cortefino962@gmail.com
            </a>.
          </Section>

          <Section title="Contact">
            If you have any questions about this privacy policy, please reach out at{' '}
            <a href="mailto:cortefino962@gmail.com" style={{ color: '#96cfe0' }}>
              cortefino962@gmail.com
            </a>.
          </Section>
        </div>
      </div>
    </>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 36 }}>
      <h2 style={{ color: '#f5f5f5', fontSize: 18, fontWeight: 500, marginBottom: 12 }}>
        {title}
      </h2>
      <p style={{ color: '#b0b0b0', fontSize: 15, lineHeight: 1.8 }}>{children}</p>
    </div>
  );
}
