import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Note } from '@/types/database';
import uuid from 'react-native-uuid';

export function useNotes(userId?: string) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (userId) {
      fetchNotes();
    }
  }, [userId]);

  const fetchNotes = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('notes')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setNotes(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch notes');
    } finally {
      setLoading(false);
    }
  };

  const addNote = async (note: Omit<Note, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    try {
      const newNote: Omit<Note, 'created_at' | 'updated_at'> = {
        id: uuid.v4() as string,
        user_id: userId!,
        ...note,
      };

      const { data, error } = await supabase
        .from('notes')
        .insert(newNote)
        .select()
        .single();

      if (error) throw error;
      setNotes(prev => [data, ...prev]);
      
      // Update user stats
      await updateUserStats();
      
      return { data, error: null };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add note';
      setError(errorMessage);
      return { data: null, error: errorMessage };
    }
  };

  const updateNote = async (id: string, updates: Partial<Note>) => {
    try {
      const { data, error } = await supabase
        .from('notes')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      setNotes(prev => prev.map(note => note.id === id ? data : note));
      
      // Update user stats if task was completed
      if (updates.metadata?.completed) {
        await updateUserStats();
      }
      
      return { data, error: null };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update note';
      setError(errorMessage);
      return { data: null, error: errorMessage };
    }
  };

  const deleteNote = async (id: string) => {
    try {
      const { error } = await supabase
        .from('notes')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setNotes(prev => prev.filter(note => note.id !== id));
      return { error: null };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete note';
      setError(errorMessage);
      return { error: errorMessage };
    }
  };

  const updateUserStats = async () => {
    if (!userId) return;

    try {
      const totalNotes = notes.length;
      const completedTasks = notes.filter(
        note => note.type === 'task' && note.metadata?.completed
      ).length;
      
      const brainScore = Math.min(100, totalNotes * 2 + completedTasks * 5);

      const { error } = await supabase
        .from('user_stats')
        .upsert({
          user_id: userId,
          total_notes: totalNotes,
          completed_tasks: completedTasks,
          brain_score: brainScore,
          last_activity: new Date().toISOString(),
        });

      if (error) throw error;
    } catch (err) {
      console.error('Failed to update user stats:', err);
    }
  };

  return {
    notes,
    loading,
    error,
    addNote,
    updateNote,
    deleteNote,
    refreshNotes: fetchNotes,
  };
}