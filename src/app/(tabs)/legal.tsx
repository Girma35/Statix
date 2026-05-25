import React, { useState } from 'react';
import { StyleSheet, ScrollView, View, Text, Pressable, Platform } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

const BLUE = '#0C5AC3';
const BG = '#F4F7FD';

type Tab = 'privacy' | 'terms';

// ─── Section Components ───────────────────────────────────────────
function Heading({ children }: { children: React.ReactNode }) {
  return <Text style={s.heading}>{children}</Text>;
}

function SubHeading({ children }: { children: React.ReactNode }) {
  return <Text style={s.subHeading}>{children}</Text>;
}

function Body({ children }: { children: React.ReactNode }) {
  return <Text style={s.body}>{children}</Text>;
}

function Bullet({ children }: { children: React.ReactNode }) {
  return <Text style={s.bullet}>•  {children}</Text>;
}

function Divider() {
  return <View style={s.divider} />;
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={s.section}>
      <Heading>{title}</Heading>
      {children}
    </View>
  );
}

function Bold({ children }: { children: React.ReactNode }) {
  return <Text style={s.bold}>{children}</Text>;
}

// ─── Privacy Policy Content ────────────────────────────────────────
function PrivacyPolicy() {
  return (
    <>
      <Text style={s.updated}>Last updated: May 25, 2026</Text>

      <Section title="1. Introduction">
        <Body>
          This Privacy Policy explains how Gold List ("we," "us," or "our") collects, uses, discloses, and
          safeguards your information when you use our mobile application <Bold>Gold List</Bold> (the "App").
          The App is a spaced-repetition vocabulary learning tool that helps you build and retain knowledge
          through the Gold List distillation method.
        </Body>
        <Body>
          We are committed to protecting your privacy. By using the App, you agree to the collection and use
          of information in accordance with this policy. If you do not agree, please do not use the App.
        </Body>
        <Body>
          <Bold>Contact:</Bold> If you have any questions, please contact us at:
        </Body>
        <Bullet>Email: girmawakeyo4@gmail.com</Bullet>
        <Bullet>Address: Addis Ababa, Ethiopia</Bullet>
      </Section>
      <Divider />

      <Section title="2. Information We Collect">
        <SubHeading>2.1 Information You Provide Directly</SubHeading>
        <Bullet><Bold>Email address</Bold> — Account creation, authentication, password reset</Bullet>
        <Bullet><Bold>Display name</Bold> — Personalizing your in-app experience</Bullet>
        <Bullet><Bold>Learning content</Bold> (words, translations, notes) — Core vocabulary storage</Bullet>
        <Bullet><Bold>Progress data</Bold> (streaks, cycles, rates) — Learning analytics</Bullet>

        <SubHeading>2.2 Information Collected Automatically</SubHeading>
        <Bullet><Bold>Firebase Auth</Bold> (Google) — Email and hashed password for secure login</Bullet>
        <Bullet><Bold>Firebase Firestore</Bold> (Google) — Cloud data storage</Bullet>
        <Bullet><Bold>Expo Notifications</Bold> — Device identifiers for study reminders</Bullet>
        <Bullet><Bold>AsyncStorage</Bold> — Local caching for offline functionality</Bullet>

        <SubHeading>2.3 Information We Do NOT Collect</SubHeading>
        <Bullet>❌ Real-time location data</Bullet>
        <Bullet>❌ Contact lists or address book data</Bullet>
        <Bullet>❌ Photos, camera, or microphone data</Bullet>
        <Bullet>❌ Browsing history or web tracking data</Bullet>
        <Bullet>❌ Payment or financial information</Bullet>
        <Bullet>❌ Biometric data</Bullet>
      </Section>
      <Divider />

      <Section title="3. How We Use Your Information">
        <Body>We use your information solely to:</Body>
        <Bullet>Provide and maintain the App — authenticate, store lists, track progress</Bullet>
        <Bullet>Improve your experience — personalize content and send reminders (with permission)</Bullet>
        <Bullet>Communicate with you — account-related notifications (e.g., password reset)</Bullet>
        <Bullet>Analyze aggregate usage — improve features without personal data</Bullet>
        <Body>We do <Bold>not</Bold> sell, rent, or share your personal information for marketing purposes.</Body>
      </Section>
      <Divider />

      <Section title="4. Third-Party Services">
        <Body>We use the following services that process your data:</Body>
        <Bullet><Bold>Google Firebase</Bold> (Auth, Firestore) — Email, profile, learning data</Bullet>
        <Bullet><Bold>Google Cloud Platform</Bold> — Infrastructure hosting (US servers)</Bullet>
        <Bullet><Bold>Expo</Bold> — Device push tokens for notifications (optional)</Bullet>
        <Body>
          These third parties have access only to perform these tasks on our behalf and are obligated
          not to disclose or use your data for any other purpose.
        </Body>
      </Section>
      <Divider />

      <Section title="5. Data Storage and Security">
        <SubHeading>5.1 Where Data Is Stored</SubHeading>
        <Body>Your data is stored on Google Cloud Platform (Firebase) servers in the United States. Local caching occurs on your device via AsyncStorage.</Body>

        <SubHeading>5.2 Security Measures</SubHeading>
        <Bullet>Encryption in transit — all data transferred via TLS/SSL</Bullet>
        <Bullet>Encryption at rest — Firestore uses AES-256 encryption</Bullet>
        <Bullet>Secure authentication — passwords are hashed and salted by Firebase Auth</Bullet>
        <Bullet>Access controls — only authenticated users can access their own data</Bullet>

        <SubHeading>5.3 Data Retention</SubHeading>
        <Body>We retain your data for as long as your account is active. You may request deletion at any time.</Body>
      </Section>
      <Divider />

      <Section title="6. Children's Privacy">
        <Body>
          The App is <Bold>not directed at children under 13</Bold>. We do not knowingly collect personal
          information from children under 13. If we become aware of such data, we will delete it promptly.
        </Body>
      </Section>
      <Divider />

      <Section title="7. Your Rights and Choices">
        <SubHeading>7.1 For All Users</SubHeading>
        <Bullet>Access and portability — request a copy of your data</Bullet>
        <Bullet>Correction — update profile info in Settings</Bullet>
        <Bullet>Deletion — request account and data deletion</Bullet>
        <Bullet>Withdraw consent — disable notifications in device settings</Bullet>

        <SubHeading>7.2 GDPR Rights (EEA)</SubHeading>
        <Bullet>Right to be informed</Bullet>
        <Bullet>Right of access</Bullet>
        <Bullet>Right to rectification</Bullet>
        <Bullet>Right to erasure ("Right to be forgotten")</Bullet>
        <Bullet>Right to restrict processing</Bullet>
        <Bullet>Right to data portability</Bullet>
        <Bullet>Right to object</Bullet>

        <SubHeading>7.3 CCPA Rights (California)</SubHeading>
        <Bullet>Know what personal information we collect, use, and share</Bullet>
        <Bullet>Request deletion of your data</Bullet>
        <Bullet>Opt out of data sale (we do not sell personal data)</Bullet>
        <Bullet>Not be discriminated against for exercising rights</Bullet>
        <Body>To exercise rights, email girmawakeyo4@gmail.com.</Body>
      </Section>
      <Divider />

      <Section title="8. Account Deletion">
        <Body>You may delete your account at any time:</Body>
        <Bullet>In-app: Settings → Account → Delete Account (if implemented)</Bullet>
        <Bullet>By email: girmawakeyo4@gmail.com with subject "Delete My Account"</Bullet>
        <Body>Upon deletion, we permanently remove your profile, headlists, words, and progress data.</Body>
      </Section>
      <Divider />

      <Section title="9. Changes to This Policy">
        <Body>We may update this policy. Changes are effective immediately upon posting. We will notify you of material changes via in-app notification or email.</Body>
      </Section>
      <Divider />

      <Section title="10. Governing Law">
        <Body>This Privacy Policy is governed by the laws of Ethiopia.</Body>
      </Section>
      <Divider />

      <Section title="11. Contact Us">
        <Bullet>Email: girmawakeyo4@gmail.com</Bullet>
        <Bullet>Address: Addis Ababa, Ethiopia</Bullet>
        <Bullet>Response time: within 30 days</Bullet>
      </Section>
    </>
  );
}

// ─── Terms of Service Content ──────────────────────────────────────
function TermsOfService() {
  return (
    <>
      <Text style={s.updated}>Last updated: May 25, 2026</Text>

      <Section title="1. Acceptance of Terms">
        <Body>
          By downloading, installing, or using Gold List, you agree to be bound by these Terms. If you do not
          agree, please do not use the App.
        </Body>
        <Body>
          The App is operated by <Bold>Girma</Bold>, based in Addis Ababa, Ethiopia. By creating an account,
          you represent that you are at least 13 years of age.
        </Body>
      </Section>
      <Divider />

      <Section title="2. Description of Service">
        <Body>Gold List is a spaced-repetition vocabulary learning app that allows you to:</Body>
        <Bullet>Create and manage vocabulary lists ("headlists")</Bullet>
        <Bullet>Review words using the Gold List distillation method</Bullet>
        <Bullet>Track learning progress, streaks, and retention rates</Bullet>
        <Bullet>Receive scheduled study reminders</Bullet>
      </Section>
      <Divider />

      <Section title="3. Account Registration and Security">
        <SubHeading>3.1 Account Creation</SubHeading>
        <Body>You must create an account with a valid email and password. You agree to provide accurate information and not share your credentials.</Body>

        <SubHeading>3.2 Account Responsibility</SubHeading>
        <Body>You are responsible for maintaining the confidentiality of your password and for all activity under your account.</Body>

        <SubHeading>3.3 Account Termination</SubHeading>
        <Body>We may suspend or terminate your account for violating these Terms, harmful conduct, inactivity, or illegal activity.</Body>
      </Section>
      <Divider />

      <Section title="4. User Content">
        <SubHeading>4.1 Ownership</SubHeading>
        <Body>You retain ownership of all content you create (vocabulary, translations, notes, headlist names).</Body>

        <SubHeading>4.2 License to Gold List</SubHeading>
        <Body>By creating content, you grant us a non-exclusive, royalty-free license to store, display, and back up your content solely to provide the service.</Body>

        <SubHeading>4.3 Content Standards</SubHeading>
        <Body>You agree not to create or store illegal, obscene, defamatory, or infringing content.</Body>
      </Section>
      <Divider />

      <Section title="5. Acceptable Use">
        <Body>The App is for personal, non-commercial educational use only. You may not:</Body>
        <Bullet>Use the App for illegal purposes</Bullet>
        <Bullet>Reverse engineer, decompile, or disassemble the App</Bullet>
        <Bullet>Access another user's account or data</Bullet>
        <Bullet>Scrape or collect user data from the App</Bullet>
        <Bullet>Reproduce or resell any part of the App without permission</Bullet>
      </Section>
      <Divider />

      <Section title="6. Intellectual Property">
        <Body>
          The App, including its name "Gold List," logo, design, code, and user interface, is owned by Girma
          and protected by copyright and trademark laws.
        </Body>
      </Section>
      <Divider />

      <Section title="7. Privacy">
        <Body>
          Your use of the App is governed by our Privacy Policy, which is incorporated into these Terms. We do
          not sell your personal information. You may delete your account at any time.
        </Body>
      </Section>
      <Divider />

      <Section title="8. Disclaimer of Warranties">
        <Body>
          <Bold>The App is provided "as is" without warranties of any kind.</Bold> We do not guarantee that the
          App will be uninterrupted, error-free, or that learning results will be achieved.
        </Body>
      </Section>
      <Divider />

      <Section title="9. Limitation of Liability">
        <Body>
          To the maximum extent permitted by law, Gold List shall not be liable for any indirect, incidental,
          or consequential damages arising from your use of the App. Our total liability shall not exceed the
          amount you paid us in the 12 months preceding the claim.
        </Body>
      </Section>
      <Divider />

      <Section title="10. Governing Law and Dispute Resolution">
        <Body>These Terms are governed by the laws of Ethiopia. Disputes shall be resolved through binding individual arbitration.</Body>
      </Section>
      <Divider />

      <Section title="11. Contact">
        <Bullet>Email: girmawakeyo4@gmail.com</Bullet>
        <Bullet>Address: Addis Ababa, Ethiopia</Bullet>
      </Section>
    </>
  );
}

// ─── Main Screen ───────────────────────────────────────────────────
export default function LegalScreen() {
  const params = useLocalSearchParams<{ tab?: string }>();
  const [tab, setTab] = useState<Tab>(
    params.tab === 'terms' ? 'terms' : 'privacy'
  );

  return (
    <SafeAreaView style={s.container}>
      {/* Header */}
      <View style={s.header}>
        <Pressable onPress={() => router.back()} style={s.backBtn}>
          <Text style={s.backTxt}>← Back</Text>
        </Pressable>
        <Text style={s.headerTitle}>Gold List</Text>
        <View style={s.backBtn} />
      </View>

      {/* Page Title */}
      <View style={s.titleArea}>
        <Text style={s.pageTitle}>Legal</Text>
        <Text style={s.pageSub}>
          {tab === 'privacy'
            ? 'How we collect, use, and protect your data.'
            : 'Rules and guidelines for using Gold List.'}
        </Text>
      </View>

      {/* Tab Switcher */}
      <View style={s.tabRow}>
        <Pressable
          style={[s.tabBtn, tab === 'privacy' && s.tabActive]}
          onPress={() => setTab('privacy')}
        >
          <Text style={[s.tabTxt, tab === 'privacy' && s.tabTxtActive]}>
            Privacy Policy
          </Text>
        </Pressable>
        <Pressable
          style={[s.tabBtn, tab === 'terms' && s.tabActive]}
          onPress={() => setTab('terms')}
        >
          <Text style={[s.tabTxt, tab === 'terms' && s.tabTxtActive]}>
            Terms of Service
          </Text>
        </Pressable>
      </View>

      {/* Content */}
      <ScrollView
        contentContainerStyle={s.scroll}
        showsVerticalScrollIndicator={false}
      >
        <View style={s.docCard}>
          {tab === 'privacy' ? <PrivacyPolicy /> : <TermsOfService />}
          <View style={{ height: 60 }} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Styles ────────────────────────────────────────────────────────
const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: BG },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingVertical: 14,
    backgroundColor: '#FFF', borderBottomWidth: 1, borderBottomColor: '#F1F5F9',
  },
  backBtn: { width: 60 },
  backTxt: { fontSize: 16, fontWeight: '600', color: BLUE },
  headerTitle: {
    fontSize: 20, fontWeight: '800', color: BLUE,
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
  },
  titleArea: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 4 },
  pageTitle: { fontSize: 28, fontWeight: '800', color: '#0F172A', marginBottom: 4 },
  pageSub: { fontSize: 14, color: '#64748B', lineHeight: 20 },
  tabRow: {
    flexDirection: 'row', backgroundColor: '#F1F5F9',
    borderRadius: 12, padding: 4, marginHorizontal: 20, marginTop: 16, marginBottom: 16,
  },
  tabBtn: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 10 },
  tabActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 4, elevation: 2,
  },
  tabTxt: { fontSize: 14, fontWeight: '600', color: '#64748B' },
  tabTxtActive: { color: BLUE },
  scroll: { paddingHorizontal: 20, paddingBottom: 40 },
  docCard: {
    backgroundColor: '#FFFFFF', borderRadius: 16, padding: 20,
    borderWidth: 1, borderColor: '#E8EEF9',
  },
  updated: { fontSize: 13, color: '#94A3B8', marginBottom: 20, fontStyle: 'italic' },
  section: { marginBottom: 6 },
  heading: {
    fontSize: 18, fontWeight: '800', color: '#0F172A', marginBottom: 10, marginTop: 8,
  },
  subHeading: {
    fontSize: 15, fontWeight: '700', color: '#0F172A', marginTop: 14, marginBottom: 8,
  },
  body: { fontSize: 15, color: '#334155', lineHeight: 24, marginBottom: 10 },
  bold: { fontWeight: '700', color: '#0F172A' },
  bullet: { fontSize: 15, color: '#334155', lineHeight: 24, marginBottom: 5, paddingLeft: 8 },
  divider: { height: 1, backgroundColor: '#F1F5F9', marginVertical: 16 },
});
