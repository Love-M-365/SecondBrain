import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

export interface Task {
  id: string;
  title: string;
  description?: string;
  due_date?: string;
  priority: 'high' | 'medium' | 'low';
  completed: boolean;
  created_at: string;
}

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchTasks();
      
      // Subscribe to real-time updates
      const subscription = supabase
        .channel('tasks')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'tasks',
            filter: `user_id=eq.${user.id}`,
          },
          () => {
            fetchTasks();
          }
        )
        .subscribe();

      return () => {
        subscription.unsubscribe();
      };
    }
  }, [user]);

  const fetchTasks = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching tasks:', error);
        return;
      }

      setTasks(data || []);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const addTask = async (
    title: string,
    description?: string,
    dueDate?: Date,
    priority: 'high' | 'medium' | 'low' = 'medium'
  ) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('tasks')
        .insert({
          user_id: user.id,
          title,
          description,
          due_date: dueDate?.toISOString(),
          priority,
          completed: false,
        })
        .select()
        .single();

      if (error) {
        console.error('Error adding task:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error adding task:', error);
      return null;
    }
  };

  const updateTask = async (id: string, updates: Partial<Task>) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('tasks')
        .update(updates)
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) {
        console.error('Error updating task:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error updating task:', error);
      return null;
    }
  };

  const toggleTask = async (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    return updateTask(id, { completed: !task.completed });
  };

  const deleteTask = async (id: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error deleting task:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error deleting task:', error);
      return false;
    }
  };

  return {
    tasks,
    loading,
    addTask,
    updateTask,
    toggleTask,
    deleteTask,
  };
}