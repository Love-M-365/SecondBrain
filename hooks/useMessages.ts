import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

export interface Message {
  id: string;
  content: string;
  is_user: boolean;
  message_type?: 'note' | 'task' | 'thought' | null;
  created_at: string;
}

export function useMessages() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchMessages();
      
      // Subscribe to real-time updates
      const subscription = supabase
        .channel('messages')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'messages',
            filter: `user_id=eq.${user.id}`,
          },
          () => {
            fetchMessages();
          }
        )
        .subscribe();

      return () => {
        subscription.unsubscribe();
      };
    }
  }, [user]);

  const fetchMessages = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching messages:', error);
        return;
      }

      setMessages(data || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const addMessage = async (content: string, isUser: boolean, messageType?: 'note' | 'task' | 'thought') => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('messages')
        .insert({
          user_id: user.id,
          content,
          is_user: isUser,
          message_type: messageType,
        })
        .select()
        .single();

      if (error) {
        console.error('Error adding message:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error adding message:', error);
      return null;
    }
  };

  const generateAIResponse = async (userMessage: string) => {
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 1000));

    let response = '';
    const lowerMessage = userMessage.toLowerCase();

    if (lowerMessage.includes('task') || lowerMessage.includes('todo') || lowerMessage.includes('remind')) {
      response = "I've captured that as a task for you! I can help you set a due date and priority level. Would you like me to add any specific details or reminders?";
    } else if (lowerMessage.includes('note') || lowerMessage.includes('remember') || lowerMessage.includes('save')) {
      response = "Perfect! I've saved that note to your Second Brain. I can help you organize it into categories or link it to related thoughts. Need me to add any tags or connections?";
    } else if (lowerMessage.includes('idea') || lowerMessage.includes('think') || lowerMessage.includes('thought')) {
      response = "Great idea! I've captured that thought for you. I can help you develop it further or connect it to your existing notes and projects. What would you like to explore next?";
    } else {
      response = "I've captured that for you! I can help you organize this as a note, task, or just keep it as a thought. Would you like me to categorize it or add any reminders?";
    }

    return response;
  };

  const sendMessage = async (content: string) => {
    if (!content.trim()) return;

    // Add user message
    await addMessage(content, true);

    // Generate and add AI response
    const aiResponse = await generateAIResponse(content);
    if (aiResponse) {
      await addMessage(aiResponse, false);
    }
  };

  return {
    messages,
    loading,
    sendMessage,
    addMessage,
  };
}