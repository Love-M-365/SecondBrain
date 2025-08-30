import React, { useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Platform,
} from 'react-native';
import { Send, Camera, Paperclip, SquareCheck as CheckSquare } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { Note } from '@/types/database';

interface ChatInputProps {
  onSendNote: (note: Omit<Note, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => Promise<void>;
  disabled?: boolean;
}

export default function ChatInput({ onSendNote, disabled }: ChatInputProps) {
  const [input, setInput] = useState('');
  const [isTask, setIsTask] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    await onSendNote({
      title: input.length > 50 ? input.substring(0, 50) + '...' : input,
      content: input.trim(),
      type: isTask ? 'task' : 'text',
      metadata: isTask ? { completed: false, priority: 'medium' } : undefined,
      tags: [],
    });

    setInput('');
    setIsTask(false);
  };

  const handleCamera = async () => {
    try {
      const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
      
      if (!permissionResult.granted) {
        Alert.alert('Permission needed', 'Camera permission is required to capture notes');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        await onSendNote({
          title: 'Captured Note',
          content: 'Handwritten note captured via camera',
          type: 'image',
          metadata: {
            file_url: result.assets[0].uri,
            file_type: 'image/jpeg',
            file_size: result.assets[0].fileSize,
          },
          tags: ['camera', 'handwritten'],
        });
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to capture image');
    }
  };

  const handleFileUpload = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: false,
        quality: 1,
      });

      if (!result.canceled && result.assets[0]) {
        await onSendNote({
          title: result.assets[0].fileName || 'Uploaded File',
          content: 'File uploaded to Second Brain',
          type: 'file',
          metadata: {
            file_url: result.assets[0].uri,
            file_type: result.assets[0].mimeType,
            file_size: result.assets[0].fileSize,
          },
          tags: ['upload', 'file'],
        });
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to upload file');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputRow}>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            placeholder={isTask ? "Add a new task..." : "Share your thoughts..."}
            value={input}
            onChangeText={setInput}
            multiline
            
            editable={!disabled}
          />
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={[styles.actionButton, isTask && styles.actionButtonActive]}
              onPress={() => setIsTask(!isTask)}
              disabled={disabled}
            >
              <CheckSquare 
                size={20} 
                color={isTask ? '#3B82F6' : '#6B7280'} 
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={handleCamera}
              disabled={disabled}
            >
              <Camera size={20} color="#6B7280" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={handleFileUpload}
              disabled={disabled}
            >
              <Paperclip size={20} color="#6B7280" />
            </TouchableOpacity>
          </View>
        </View>
        <TouchableOpacity
          style={[styles.sendButton, disabled && styles.sendButtonDisabled]}
          onPress={handleSend}
          disabled={disabled || !input.trim()}
        >
          <Send size={20} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 12,
  },
  inputContainer: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    minHeight: 44,
  },
  textInput: {
    fontSize: 16,
    color: '#111827',
    maxHeight: 100,
  },
  actionButtons: {
    flexDirection: 'row',
    marginTop: 8,
    gap: 8,
  },
  actionButton: {
    padding: 6,
    borderRadius: 8,
  },
  actionButtonActive: {
    backgroundColor: '#DBEAFE',
  },
  sendButton: {
    backgroundColor: '#3B82F6',
    borderRadius: 22,
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
});