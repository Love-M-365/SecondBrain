import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { useAuth } from '@/hooks/useAuth';
import { useUserStats } from '@/hooks/useUserStats';
import AuthScreen from '@/components/AuthScreen';
import BrainScoreCard from '@/components/BrainScoreCard';
import { Brain, Sparkles, Target } from 'lucide-react-native';

export default function HomeScreen() {
  const { user, loading } = useAuth();
  const { stats } = useUserStats(user?.id);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Brain size={48} color="#3B82F6" />
        <Text style={styles.loadingText}>Loading Second Brain...</Text>
      </View>
    );
  }

  if (!user) {
    return <AuthScreen />;
  }

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.greeting}>
            {getGreeting()}, {user.user_metadata?.full_name || 'there'}!
          </Text>
          <Text style={styles.subtitle}>
            Welcome to your Second Brain
          </Text>
        </View>

        <BrainScoreCard stats={stats} />

        <View style={styles.featuresContainer}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          
          <View style={styles.featureGrid}>
            <View style={styles.featureCard}>
              <Sparkles size={32} color="#8B5CF6" />
              <Text style={styles.featureTitle}>Capture Ideas</Text>
              <Text style={styles.featureDescription}>
                Store thoughts, notes, and insights instantly
              </Text>
            </View>

            <View style={styles.featureCard}>
              <Target size={32} color="#10B981" />
              <Text style={styles.featureTitle}>Track Goals</Text>
              <Text style={styles.featureDescription}>
                Set and monitor your progress toward achievements
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.insightsContainer}>
          <Text style={styles.sectionTitle}>Today's Insights</Text>
          <View style={styles.insightCard}>
            <Text style={styles.insightText}>
              You've been consistently adding to your Second Brain! 
              {stats?.total_notes && stats.total_notes > 0 
                ? ` You have ${stats.total_notes} items stored and a brain score of ${stats.brain_score}.`
                : ' Start by adding your first note in the Chat tab.'
              }
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
  },
  loadingText: {
    fontSize: 16,
    color: '#6B7280',
    marginTop: 16,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 24,
    paddingBottom: 8,
  },
  greeting: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
  },
  featuresContainer: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 16,
  },
  featureGrid: {
    gap: 16,
  },
  featureCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginTop: 12,
    marginBottom: 8,
  },
  featureDescription: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
  },
  insightsContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  insightCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#3B82F6',
  },
  insightText: {
    fontSize: 15,
    color: '#374151',
    lineHeight: 22,
  },
});