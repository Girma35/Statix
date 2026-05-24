import React from 'react';
import { StyleSheet, View, Text, Pressable, SafeAreaView, Platform } from 'react-native';
import { Link } from 'expo-router';
import { Colors } from '@/constants/theme';

export default function LandingScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        
        {/* Icon Container */}
        <View style={styles.iconContainer}>
          <View style={styles.iconShape}>
            {/* Simple CSS-based icon resembling the mockup */}
            <View style={styles.iconLinesContainer}>
              <View style={[styles.iconLine, { width: 40 }]} />
              <View style={[styles.iconLine, { width: 40 }]} />
              <View style={[styles.iconLine, { width: 24 }]} />
            </View>
            <View style={styles.pencilBody}>
              <View style={styles.pencilTip} />
            </View>
          </View>
        </View>

        {/* Title & Subtitle */}
        <Text style={styles.title}>Gold List</Text>
        <Text style={styles.subtitle}>
          Long-term memory through methodical{'\n'}distillation.
        </Text>

      </View>

      {/* Buttons & Footer */}
      <View style={styles.bottomContainer}>
        <Link href="/(auth)/signup" asChild>
          <Pressable style={styles.primaryButton}>
            <Text style={styles.primaryButtonText}>Get Started</Text>
            <Text style={styles.primaryButtonIcon}>➔</Text>
          </Pressable>
        </Link>

        <Link href="/(auth)/login" asChild>
          <Pressable style={styles.secondaryButton}>
            <Text style={styles.secondaryButtonText}>Sign In</Text>
          </Pressable>
        </Link>

        <Text style={styles.footerText}>
          The low-stress approach to language learning.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F6FD', // Light blue/grayish background
    justifyContent: 'space-between',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    marginTop: 60,
  },
  iconContainer: {
    marginBottom: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
  },
  iconShape: {
    width: 120,
    height: 120,
    backgroundColor: '#0C5AC3',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  iconLinesContainer: {
    position: 'absolute',
    top: 36,
    left: 32,
    gap: 8,
  },
  iconLine: {
    height: 6,
    backgroundColor: '#FFFFFF',
    borderRadius: 3,
  },
  pencilBody: {
    position: 'absolute',
    bottom: 34,
    right: 30,
    width: 24,
    height: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 2,
    transform: [{ rotate: '-45deg' }],
  },
  pencilTip: {
    position: 'absolute',
    left: -6,
    top: 0,
    width: 0,
    height: 0,
    borderTopWidth: 4,
    borderBottomWidth: 4,
    borderRightWidth: 6,
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
    borderRightColor: '#FFFFFF',
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#0C5AC3',
    marginBottom: 16,
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
  },
  subtitle: {
    fontSize: 16,
    color: '#4B5563',
    textAlign: 'center',
    lineHeight: 24,
  },
  bottomContainer: {
    paddingHorizontal: 24,
    paddingBottom: 40,
    gap: 16,
  },
  primaryButton: {
    backgroundColor: '#0C5AC3',
    paddingVertical: 16,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  primaryButtonIcon: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#374151',
    fontSize: 16,
    fontWeight: '700',
  },
  footerText: {
    color: '#6B7280',
    fontSize: 13,
    textAlign: 'center',
    marginTop: 16,
  },
});
