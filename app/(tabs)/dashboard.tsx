import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useAuth } from '@/hooks/useAuth';
import { useUserStats } from '@/hooks/useUserStats';
import { useNotes } from '@/hooks/useNotes';
import AuthScreen from '@/components/AuthScreen';
import BrainScoreCard from '@/components/BrainScoreCard';
import { TrendingUp, Calendar, CircleCheck as CheckCircle2, FileText, Camera, Paperclip } from 'lucide-react-native';

export default function DashboardScreen() {
  const { user, loading: authLoading } = useAuth();
  const { stats, loading: statsLoading } = useUserStats(user?.id);
  const { notes, loading: notesLoading } = useNotes(user?.id);

  if (authLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  if (!user) {
    return <AuthScreen />;
  }

  const getActivityData = () => {
    const today = new Date();
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      return date.toISOString().split('T')[0];
    }).reverse();

    return last7Days.map(date => {
      const dayNotes = notes.filter(note => 
        note.created_at.split('T')[0] === date
      );
      return {
        date,
        count: dayNotes.length,
        completed: dayNotes.filter(note => 
          note.type === 'task' && note.metadata?.completed
        ).length,
      };
    });
  };

  const getContentBreakdown = () => {
    const breakdown = {
      text: notes.filter(n => n.type === 'text').length,
      tasks: notes.filter(n => n.type === 'task').length,
      images: notes.filter(n => n.type === 'image').length,
      files: notes.filter(n => n.type === 'file').length,
    };
    return breakdown;
  };

  const activityData = getActivityData();
  const contentBreakdown = getContentBreakdown();

  if (statsLoading || notesLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text style={styles.loadingText}>Loading dashboard...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Dashboard</Text>
          <Text style={styles.headerSubtitle}>
            Track your Second Brain progress
          </Text>
        </View>

        <BrainScoreCard stats={stats} />

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Activity Overview</Text>
          <View style={styles.activityContainer}>
            {activityData.map((day, index) => (
              <View key={index} style={styles.activityDay}>
                <View style={[
                  styles.activityBar,
                  { height: Math.max(4, day.count * 8) }
                ]} />
                <Text style={styles.activityLabel}>
                  {new Date(day.date).toLocaleDateString('en', { weekday: 'short' })}
                </Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Content Breakdown</Text>
          <View style={styles.breakdownGrid}>
            <View style={styles.breakdownCard}>
              <FileText size={24} color="#3B82F6" />
              <Text style={styles.breakdownValue}>{contentBreakdown.text}</Text>
              <Text style={styles.breakdownLabel}>Notes</Text>
            </View>

            <View style={styles.breakdownCard}>
              <CheckCircle2 size={24} color="#10B981" />
              <Text style={styles.breakdownValue}>{contentBreakdown.tasks}</Text>
              <Text style={styles.breakdownLabel}>Tasks</Text>
            </View>

            <View style={styles.breakdownCard}>
              <Camera size={24} color="#8B5CF6" />
              <Text style={styles.breakdownValue}>{contentBreakdown.images}</Text>
              <Text style={styles.breakdownLabel}>Images</Text>
            </View>

            <View style={styles.breakdownCard}>
              <Paperclip size={24} color="#F59E0B" />
              <Text style={styles.breakdownValue}>{contentBreakdown.files}</Text>
              <Text style={styles.breakdownLabel}>Files</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Achievements</Text>
          <View style={styles.achievementCard}>
            <TrendingUp size={24} color="#10B981" />
            <View style={styles.achievementContent}>
              <Text style={styles.achievementTitle}>Knowledge Builder</Text>
              <Text style={styles.achievementDescription}>
                {stats?.total_notes || 0 >= 10 
                  ? 'Completed: Added 10+ items to your Second Brain'
                  : `Progress: ${stats?.total_notes || 0}/10 items added`
                }
              </Text>
            </View>
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
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 16,
  },
  activityContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    height: 120,
  },
  activityDay: {
    alignItems: 'center',
    flex: 1,
  },
  activityBar: {
    width: 8,
    backgroundColor: '#3B82F6',
    borderRadius: 4,
    marginBottom: 8,
  },
  activityLabel: {
    fontSize: 10,
    color: '#6B7280',
    fontWeight: '500',
  },
  breakdownGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  breakdownCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    flex: 1,
    minWidth: '45%',
  },
  breakdownValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginTop: 8,
    marginBottom: 4,
  },
  breakdownLabel: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  achievementCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  achievementContent: {
    flex: 1,
    marginLeft: 16,
  },
  achievementTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  achievementDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
});