import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Dimensions,
} from 'react-native';
import { SquareCheck as CheckSquare, Square, FileText, Image as ImageIcon, Paperclip, Tag } from 'lucide-react-native';
import { Note } from '@/types/database';

interface NoteCardProps {
  note: Note;
  onToggleTask?: (id: string, completed: boolean) => void;
}

const { width } = Dimensions.get('window');

export default function NoteCard({ note, onToggleTask }: NoteCardProps) {
  const isTask = note.type === 'task';
  const isCompleted = note.metadata?.completed;
  const isImage = note.type === 'image';
  const isFile = note.type === 'file';

  const handleToggleTask = () => {
    if (isTask && onToggleTask) {
      onToggleTask(note.id, !isCompleted);
    }
  };

  const getTypeIcon = () => {
    switch (note.type) {
      case 'task':
        return isCompleted ? (
          <CheckSquare size={20} color="#10B981" />
        ) : (
          <Square size={20} color="#6B7280" />
        );
      case 'image':
        return <ImageIcon size={20} color="#8B5CF6" />;
      case 'file':
        return <Paperclip size={20} color="#F59E0B" />;
      default:
        return <FileText size={20} color="#3B82F6" />;
    }
  };

  const getPriorityColor = () => {
    switch (note.metadata?.priority) {
      case 'high':
        return '#EF4444';
      case 'medium':
        return '#F59E0B';
      case 'low':
        return '#10B981';
      default:
        return '#6B7280';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor(diff / (1000 * 60));

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  };

  return (
    <TouchableOpacity
      style={[
        styles.container,
        isTask && isCompleted && styles.completedTask,
      ]}
      onPress={isTask ? handleToggleTask : undefined}
      activeOpacity={isTask ? 0.7 : 1}
    >
      <View style={styles.header}>
        <View style={styles.typeContainer}>
          {getTypeIcon()}
          <Text style={styles.title}>{note.title}</Text>
        </View>
        <Text style={styles.timestamp}>{formatDate(note.created_at)}</Text>
      </View>

      <Text style={[
        styles.content,
        isTask && isCompleted && styles.completedContent,
      ]}>
        {note.content}
      </Text>

      {isImage && note.metadata?.file_url && (
        <Image
          source={{ uri: note.metadata.file_url }}
          style={styles.image}
          resizeMode="cover"
        />
      )}

      {isTask && note.metadata?.priority && (
        <View style={styles.metadata}>
          <View style={[
            styles.priorityBadge,
            { backgroundColor: getPriorityColor() },
          ]}>
            <Text style={styles.priorityText}>
              {note.metadata.priority.toUpperCase()}
            </Text>
          </View>
        </View>
      )}

      {note.tags.length > 0 && (
        <View style={styles.tagsContainer}>
          <Tag size={14} color="#6B7280" style={styles.tagIcon} />
          {note.tags.slice(0, 3).map((tag, index) => (
            <View key={index} style={styles.tag}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
          {note.tags.length > 3 && (
            <Text style={styles.moreTagsText}>+{note.tags.length - 3}</Text>
          )}
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  completedTask: {
    opacity: 0.7,
    backgroundColor: '#F0FDF4',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  typeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginLeft: 8,
    flex: 1,
  },
  timestamp: {
    fontSize: 12,
    color: '#6B7280',
  },
  content: {
    fontSize: 15,
    color: '#374151',
    lineHeight: 22,
    marginBottom: 8,
  },
  completedContent: {
    textDecorationLine: 'line-through',
    color: '#6B7280',
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: 8,
  },
  metadata: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  priorityText: {
    fontSize: 10,
    fontWeight: '700',
    color: 'white',
  },
  tagsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  tagIcon: {
    marginRight: 4,
  },
  tag: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    marginRight: 4,
    marginBottom: 4,
  },
  tagText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  moreTagsText: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 4,
  },
});