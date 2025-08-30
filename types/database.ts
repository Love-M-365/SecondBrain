export interface User {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export interface Note {
  id: string;
  user_id: string;
  title: string;
  content: string;
  type: 'text' | 'task' | 'image' | 'file';
  metadata?: {
    completed?: boolean;
    priority?: 'low' | 'medium' | 'high';
    due_date?: string;
    file_url?: string;
    file_type?: string;
    file_size?: number;
  };
  tags: string[];
  created_at: string;
  updated_at: string;
}

export interface Goal {
  id: string;
  user_id: string;
  title: string;
  description: string;
  target_value: number;
  current_value: number;
  unit: string;
  deadline?: string;
  completed: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserStats {
  id: string;
  user_id: string;
  total_notes: number;
  completed_tasks: number;
  brain_score: number;
  streak_days: number;
  last_activity: string;
  created_at: string;
  updated_at: string;
}