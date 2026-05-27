/**
 * DevMenuScreen — developer screen catalog.
 *
 * Lists every screen in the app and jumps straight to it, so you can preview
 * any page without walking through onboarding. Only shown when
 * DEV.START === 'screen-catalog' in src/constants/devConfig.js.
 *
 * This screen (and DevNavigator) are dev-only tools — they are never reachable
 * in a production build.
 */
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/brand';

// Onboarding screens — route names must match the ones registered in DevNavigator.
const ONBOARDING = [
  { route: 'Welcome',               label: 'Welcome' },
  { route: 'PainLocation',          label: 'Pain Location' },
  { route: 'PainIntensity',         label: 'Pain Intensity' },
  { route: 'PainType',              label: 'Pain Type' },
  { route: 'PainTriggers',          label: 'Pain Triggers' },
  { route: 'PainDuration',          label: 'Pain Duration' },
  { route: 'DirectionalPreference', label: 'Directional Preference' },
  { route: 'RadiatingPain',         label: 'Radiating Pain' },
  { route: 'RedFlag',               label: 'Red Flag Check' },
  { route: 'Sitting',               label: 'Sitting Hours' },
  { route: 'ActivityLevel',         label: 'Activity Level' },
  { route: 'AgeRange',              label: 'Age Range' },
  { route: 'Disclaimer',            label: 'Disclaimer' },
  { route: 'Analyzing',             label: 'Analyzing (loader)' },
  { route: 'EmailCapture',          label: 'Email Capture' },
  { route: 'PainProfile',           label: 'Pain Profile' },
  { route: 'Day1Protocol',          label: 'Day 1 Protocol' },
  { route: 'Upgrade',               label: 'Upgrade / Paywall' },
];

// Main-app tabs — these live inside the nested AppNavigator ('MainApp' route).
const MAIN_APP = [
  { tab: 'Home',     label: 'Dashboard (Home)' },
  { tab: 'Workout',  label: 'Workout' },
  { tab: 'Progress', label: 'Progress / History' },
  { tab: 'Explore',  label: 'Explore' },
  { tab: 'Me',       label: 'Profile (Me)' },
];

function Row({ index, label, onPress }) {
  return (
    <TouchableOpacity style={s.row} onPress={onPress} activeOpacity={0.7}>
      {index != null && (
        <View style={s.badge}>
          <Text style={s.badgeText}>{index}</Text>
        </View>
      )}
      <Text style={s.rowLabel}>{label}</Text>
      <Ionicons name="chevron-forward" size={18} color={Colors.textMuted} />
    </TouchableOpacity>
  );
}

function SectionTitle({ children }) {
  return <Text style={s.sectionTitle}>{children}</Text>;
}

export default function DevMenuScreen({ navigation }) {
  const openTab = (tab) =>
    navigation.navigate('MainApp', { screen: 'Tabs', params: { screen: tab } });

  return (
    <SafeAreaView style={s.container} edges={['top', 'bottom']}>
      <View style={s.header}>
        <Text style={s.title}>Screen Catalog</Text>
        <Text style={s.subtitle}>
          Dev preview — tap any screen to open it. To turn this off, set
          {' '}DEV.START to 'onboarding' in src/constants/devConfig.js.
        </Text>
      </View>

      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
        <SectionTitle>Onboarding flow · {ONBOARDING.length} screens</SectionTitle>
        {ONBOARDING.map((item, i) => (
          <Row
            key={item.route}
            index={i + 1}
            label={item.label}
            onPress={() => navigation.navigate(item.route)}
          />
        ))}

        <SectionTitle>Main app · {MAIN_APP.length} tabs</SectionTitle>
        {MAIN_APP.map((item) => (
          <Row
            key={item.tab}
            label={item.label}
            onPress={() => openTab(item.tab)}
          />
        ))}

        <SectionTitle>Sessions</SectionTitle>
        <Row
          label="Recovery Session (guided)"
          onPress={() => navigation.navigate('RecoverySession')}
        />

        <View style={s.footer}>
          <Text style={s.footerText}>
            Every screen opens with a sample pain profile so cards and plans
            have real content. Use the back arrow at the top to return here.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  header: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderSubtle,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: Colors.textPrimary,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 12.5,
    color: Colors.textSecondary,
    lineHeight: 18,
    marginTop: 6,
  },
  scroll: { paddingHorizontal: 16, paddingTop: 8, paddingBottom: 40 },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.8,
    color: Colors.purplePale,
    textTransform: 'uppercase',
    marginTop: 22,
    marginBottom: 8,
    marginLeft: 4,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.bgCard,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingVertical: 14,
    paddingHorizontal: 14,
    marginBottom: 8,
  },
  badge: {
    width: 26,
    height: 26,
    borderRadius: 8,
    backgroundColor: Colors.bgElevated,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  badgeText: { fontSize: 12, fontWeight: '800', color: Colors.purpleLight },
  rowLabel: { flex: 1, fontSize: 15, fontWeight: '600', color: Colors.textPrimary },
  footer: { marginTop: 26, paddingHorizontal: 6 },
  footerText: {
    fontSize: 12,
    color: Colors.textMuted,
    lineHeight: 18,
    textAlign: 'center',
  },
});
