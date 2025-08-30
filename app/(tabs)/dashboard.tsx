import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Calendar, Clock, CircleCheck as CheckCircle, CircleAlert as AlertCircle, TrendingUp, Target, FileText, Brain } from 'lucide-react-native';
import { useTasks } from '@/hooks/useTasks';
import { useDocuments } from '@/hooks/useDocuments';
import { useMessages } from '@/hooks/useMessages';

interface Stat {
  label: string;
  value: string;
  change: string;
  icon: any;
  color: string;
}

export default function DashboardTab() {
  const { tasks, loading: tasksLoading, toggleTask } = useTasks();
  const { documents } = useDocuments();
  const { messages } = useMessages();

  const upcomingTasks = tasks
    .filter(task => !task.completed)
    .sort((a, b) => {
      if (!a.due_date && !b.due_date) return 0;
      if (!a.due_date) return 1;
      if (!b.due_date) return -1;
      return new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
    })
    .slice(0, 3);

  const completedTasksCount = tasks.filter(task => task.completed).length;
  const totalNotes = messages.filter(msg => !msg.is_user).length;
  const productivityScore = tasks.length > 0 ? Math.round((completedTasksCount / tasks.length) * 100) : 0;

  const stats: Stat[] = [
    {
      label: 'Notes Created',
      value: totalNotes.toString(),
      change: '+12%',
      icon: Brain,
      color: '#3B82F6',
    },
    {
      label: 'Tasks Completed',
      value: completedTasksCount.toString(),
      change: '+8%',
      icon: CheckCircle,
      color: '#10B981',
    },
    {
      label: 'Documents',
      value: documents.length.toString(),
      change: '+3%',
      icon: FileText,
      color: '#8B5CF6',
    },
    {
      label: 'Productivity',
      value: `${productivityScore}%`,
      change: '+5%',
      icon: TrendingUp,
      color: '#F59E0B',
    },
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return '#DC2626';
      case 'medium':
        return '#F59E0B';
      case 'low':
        return '#10B981';
      default:
        return '#64748B';
    }
  };

  const handleTaskToggle = async (taskId: string) => {
    await toggleTask(taskId);
  };

  if (tasksLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text style={styles.loadingText}>Loading dashboard...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Good morning!</Text>
          <Text style={styles.headerTitle}>Your Second Brain</Text>
        </View>
        <TouchableOpacity style={styles.calendarButton}>
          <Calendar size={20} color="#3B82F6" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          {stats.map((stat, index) => (
            <View key={index} style={styles.statCard}>
              <View style={[styles.statIcon, { backgroundColor: `${stat.color}15` }]}>
                <stat.icon size={24} color={stat.color} />
              </View>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
              <Text style={[styles.statChange, { color: stat.color }]}>
                {stat.change}
              </Text>
            </View>
          ))}
        </View>

        {/* Upcoming Tasks */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Upcoming Tasks</Text>
            <TouchableOpacity>
              <Text style={styles.viewAll}>View All</Text>
            </TouchableOpacity>
          </View>

          {upcomingTasks.map((task) => (
            <TouchableOpacity 
              key={task.id} 
              style={styles.taskCard}
              onPress={() => handleTaskToggle(task.id)}
            >
              <View style={styles.taskLeft}>
                <View
                  style={[
                    styles.priorityIndicator,
                    { backgroundColor: getPriorityColor(task.priority) },
                  ]}
                />
                <View style={styles.taskInfo}>
                  <Text
                    style={[
                      styles.taskTitle,
                      task.completed && styles.completedTask,
                    ]}
                  >
                    {task.title}
                  </Text>
                  <View style={styles.taskMeta}>
                    <Clock size={14} color="#64748B" />
                    <Text style={styles.taskDue}>
                      {task.due_date ? new Date(task.due_date).toLocaleDateString() : 'No due date'}
                    </Text>
                  </View>
                </View>
              </View>
              <View style={styles.taskRight}>
                {task.completed ? (
                  <CheckCircle size={20} color="#10B981" />
                ) : (
                  <View style={styles.uncheckedCircle} />
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActions}>
            <TouchableOpacity style={styles.actionCard}>
              <View style={[styles.actionIcon, { backgroundColor: '#EFF6FF' }]}>
                <Brain size={24} color="#3B82F6" />
              </View>
              <Text style={styles.actionLabel}>Add Thought</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionCard}>
              <View style={[styles.actionIcon, { backgroundColor: '#F0FDF4' }]}>
                <Target size={24} color="#10B981" />
              </View>
              <Text style={styles.actionLabel}>New Task</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionCard}>
              <View style={[styles.actionIcon, { backgroundColor: '#FEF7FF' }]}>
                <FileText size={24} color="#8B5CF6" />
              </View>
              <Text style={styles.actionLabel}>Upload Doc</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Today's Focus */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Today's Focus</Text>
          <View style={styles.focusCard}>
            <View style={styles.focusHeader}>
              <AlertCircle size={20} color="#F59E0B" />
              <Text style={styles.focusTitle}>High Priority</Text>
            </View>
            <Text style={styles.focusDescription}>
              Complete the project proposal review and prepare for tomorrow's presentation.
            </Text>
            <View style={styles.focusProgress}>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: '65%' }]} />
              </View>
              <Text style={styles.progressText}>65% Complete</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
  },
  loadingText: {
    fontSize: 16,
    color: '#64748B',
    marginTop: 16,
  },
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  greeting: {
    fontSize: 16,
    color: '#64748B',
    fontWeight: '500',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0f172a',
    marginTop: 2,
  },
  calendarButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    paddingTop: 16,
  },
  statCard: {
    flex: 1,
    minWidth: '47%',
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0f172a',
  },
  statLabel: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 4,
  },
  statChange: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
  },
  section: {
    marginTop: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0f172a',
  },
  viewAll: {
    fontSize: 14,
    fontWeight: '600',
    color: '#3B82F6',
  },
  taskCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 16,
    marginBottom: 8,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  taskLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  priorityIndicator: {
    width: 4,
    height: 32,
    borderRadius: 2,
    marginRight: 12,
  },
  taskInfo: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0f172a',
    marginBottom: 4,
  },
  completedTask: {
    textDecorationLine: 'line-through',
    color: '#64748B',
  },
  taskMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  taskDue: {
    fontSize: 14,
    color: '#64748B',
  },
  taskRight: {
    marginLeft: 12,
  },
  uncheckedCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#d1d5db',
  },
  quickActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  actionCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  actionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0f172a',
  },
  focusCard: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 12,
    marginTop: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  focusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  focusTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#F59E0B',
  },
  focusDescription: {
    fontSize: 16,
    color: '#334155',
    lineHeight: 22,
    marginBottom: 16,
  },
  focusProgress: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  progressBar: {
    flex: 1,
    height: 6,
    backgroundColor: '#f1f5f9',
    borderRadius: 3,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#10B981',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#10B981',
  },
});