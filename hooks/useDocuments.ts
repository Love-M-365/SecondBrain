import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

export interface Document {
  id: string;
  name: string;
  file_type: string;
  file_size: number;
  file_url: string;
  category: string;
  created_at: string;
}

export function useDocuments() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchDocuments();
      
      // Subscribe to real-time updates
      const subscription = supabase
        .channel('documents')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'documents',
            filter: `user_id=eq.${user.id}`,
          },
          () => {
            fetchDocuments();
          }
        )
        .subscribe();

      return () => {
        subscription.unsubscribe();
      };
    }
  }, [user]);

  const fetchDocuments = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching documents:', error);
        return;
      }

      setDocuments(data || []);
    } catch (error) {
      console.error('Error fetching documents:', error);
    } finally {
      setLoading(false);
    }
  };

  const addDocument = async (
    name: string,
    fileType: string,
    fileSize: number,
    fileUrl: string,
    category: string = 'General'
  ) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('documents')
        .insert({
          user_id: user.id,
          name,
          file_type: fileType,
          file_size: fileSize,
          file_url: fileUrl,
          category,
        })
        .select()
        .single();

      if (error) {
        console.error('Error adding document:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error adding document:', error);
      return null;
    }
  };

  const deleteDocument = async (id: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('documents')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error deleting document:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error deleting document:', error);
      return false;
    }
  };

  return {
    documents,
    loading,
    addDocument,
    deleteDocument,
  };
}