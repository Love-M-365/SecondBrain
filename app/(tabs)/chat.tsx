import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { useAuth } from '@/hooks/useAuth';
import { useNotes } from '@/hooks/useNotes';
import AuthScreen from '@/components/AuthScreen';
import ChatInput from '@/components/ChatInput';
import NoteCard from '@/components/NoteCard';
import { Note } from '@/types/database';

export default function ChatScreen() {
  const { user, loading: authLoading } = useAuth();
  const { notes, loading: notesLoading, addNote, updateNote } = useNotes(user?.id);
  const [sending, setSending] = useState(false);

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

  const handleSendNote = async (noteData: Omit<Note, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    setSending(true);
    try {
      await addNote(noteData);
    } catch (error) {
      console.error('Failed to send note:', error);
    } finally {
      setSending(false);
    }
  };

  const handleToggleTask = async (id: string, completed: boolean) => {
    await updateNote(id, {
      metadata: {
        ...notes.find(n => n.id === id)?.metadata,
        completed,
      },
    });
  };

  const renderNote = ({ item }: { item: Note }) => (
    <NoteCard note={item} onToggleTask={handleToggleTask} />
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyTitle}>Welcome to your Second Brain!</Text>
      <Text style={styles.emptyDescription}>
        Start by adding your first note, task, or capture something with your camera.
        Your digital memory companion is ready to store everything important.
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Second Brain Chat</Text>
        <Text style={styles.headerSubtitle}>
          Capture thoughts, tasks, and memories
        </Text>
      </View>

      <FlatList
        data={notes}
        renderItem={renderNote}
        keyExtractor={(item) => item.id}
        style={styles.notesList}
        contentContainerStyle={[
          styles.notesListContent,
          notes.length === 0 && styles.emptyListContent,
        ]}
        ListEmptyComponent={notesLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#3B82F6" />
            <Text style={styles.loadingText}>Loading your brain...</Text>
          </View>
        ) : renderEmptyState}
        showsVerticalScrollIndicator={false}
      />

      <ChatInput onSendNote={handleSendNote} disabled={sending} />
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
  header: {
    backgroundColor: 'white',
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  notesList: {
    flex: 1,
  },
  notesListContent: {
    paddingVertical: 8,
  },
  emptyListContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  emptyState: {
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingVertical: 48,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 12,
  },
  emptyDescription: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
  },
});