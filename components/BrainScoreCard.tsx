import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Brain, Target, CircleCheck as CheckCircle, Flame } from 'lucide-react-native';
import { UserStats } from '@/types/database';

interface BrainScoreCardProps {
  stats: UserStats | null;
}

export default function BrainScoreCard({ stats }: BrainScoreCardProps) {
  const getScoreLevel = (score: number) => {
    if (score >= 80) return { level: 'Genius', color: '#8B5CF6' };
    if (score >= 60) return { level: 'Advanced', color: '#10B981' };
    if (score >= 40) return { level: 'Developing', color: '#F59E0B' };
    return { level: 'Beginner', color: '#6B7280' };
  };

  const scoreLevel = getScoreLevel(stats?.brain_score || 0);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Brain size={24} color={scoreLevel.color} />
        <Text style={styles.title}>Brain Score</Text>
      </View>

      <View style={styles.scoreContainer}>
        <Text style={[styles.score, { color: scoreLevel.color }]}>
          {stats?.brain_score || 0}
        </Text>
        <Text style={styles.scoreLevel}>{scoreLevel.level}</Text>
      </View>

      <View style={styles.progressBar}>
        <View
          style={[
            styles.progressFill,
            {
              width: `${Math.min(100, (stats?.brain_score || 0))}%`,
              backgroundColor: scoreLevel.color,
            },
          ]}
        />
      </View>

      <View style={styles.statsGrid}>
        <View style={styles.statItem}>
          <Target size={18} color="#3B82F6" />
          <Text style={styles.statValue}>{stats?.total_notes || 0}</Text>
          <Text style={styles.statLabel}>Notes</Text>
        </View>

        <View style={styles.statItem}>
          <CheckCircle size={18} color="#10B981" />
          <Text style={styles.statValue}>{stats?.completed_tasks || 0}</Text>
          <Text style={styles.statLabel}>Tasks</Text>
        </View>

        <View style={styles.statItem}>
          <Flame size={18} color="#F59E0B" />
          <Text style={styles.statValue}>{stats?.streak_days || 0}</Text>
          <Text style={styles.statLabel}>Streak</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    margin: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginLeft: 8,
  },
  scoreContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  score: {
    fontSize: 48,
    fontWeight: '800',
  },
  scoreLevel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
    marginTop: 4,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#F3F4F6',
    borderRadius: 4,
    marginBottom: 20,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginTop: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
    marginTop: 2,
  },
});