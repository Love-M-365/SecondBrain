import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Alert,
} from 'react-native';
import { X, Calendar, Flag } from 'lucide-react-native';
import { Button } from '@/components/ui/Button';

interface TaskModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (title: string, description: string, priority: 'high' | 'medium' | 'low', dueDate?: Date) => void;
}

export function TaskModal({ visible, onClose, onSave }: TaskModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<'high' | 'medium' | 'low'>('medium');
  const [dueDate, setDueDate] = useState<Date | undefined>();

  const handleSave = () => {
    if (!title.trim()) {
      Alert.alert('Error', 'Please enter a task title');
      return;
    }

    onSave(title, description, priority, dueDate);
    
    // Reset form
    setTitle('');
    setDescription('');
    setPriority('medium');
    setDueDate(undefined);
    onClose();
  };

  const getPriorityColor = (p: string) => {
    switch (p) {
      case 'high': return '#DC2626';
      case 'medium': return '#F59E0B';
      case 'low': return '#10B981';
      default: return '#64748B';
    }
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>New Task</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <X size={24} color="#64748B" />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Title</Text>
            <TextInput
              style={styles.input}
              value={title}
              onChangeText={setTitle}
              placeholder="Enter task title"
              multiline
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={description}
              onChangeText={setDescription}
              placeholder="Add description (optional)"
              multiline
              numberOfLines={3}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Priority</Text>
            <View style={styles.priorityContainer}>
              {(['high', 'medium', 'low'] as const).map((p) => (
                <TouchableOpacity
                  key={p}
                  style={[
                    styles.priorityButton,
                    priority === p && styles.priorityButtonActive,
                    { borderColor: getPriorityColor(p) },
                    priority === p && { backgroundColor: `${getPriorityColor(p)}15` },
                  ]}
                  onPress={() => setPriority(p)}
                >
                  <Flag size={16} color={getPriorityColor(p)} />
                  <Text
                    style={[
                      styles.priorityText,
                      { color: getPriorityColor(p) },
                    ]}
                  >
                    {p.charAt(0).toUpperCase() + p.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Due Date</Text>
            <TouchableOpacity
              style={styles.dateButton}
              onPress={() => Alert.alert('Date Picker', 'Date picker coming soon!')}
            >
              <Calendar size={20} color="#64748B" />
              <Text style={styles.dateText}>
                {dueDate ? dueDate.toLocaleDateString() : 'Set due date (optional)'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.footer}>
          <Button
            title="Cancel"
            onPress={onClose}
            variant="outline"
            style={styles.cancelButton}
          />
          <Button
            title="Save Task"
            onPress={handleSave}
            style={styles.saveButton}
          />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
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
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0f172a',
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#374151',
    backgroundColor: '#ffffff',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  priorityContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  priorityButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: '#ffffff',
    gap: 8,
  },
  priorityButtonActive: {
    borderWidth: 2,
  },
  priorityText: {
    fontSize: 14,
    fontWeight: '600',
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    backgroundColor: '#ffffff',
    gap: 12,
  },
  dateText: {
    fontSize: 16,
    color: '#64748B',
  },
  footer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
  },
  saveButton: {
    flex: 1,
  },
});