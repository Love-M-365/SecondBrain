import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Send, Camera, Mic, Plus, LogOut } from 'lucide-react-native';
import { useMessages } from '@/hooks/useMessages';
import { useAuth } from '@/contexts/AuthContext';
import { CameraView, useCameraPermissions } from 'expo-camera';

export default function BrainTab() {
  const { messages, loading, sendMessage } = useMessages();
  const { signOut } = useAuth();
  const [inputText, setInputText] = useState('');
  const [showCamera, setShowCamera] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();
  const scrollViewRef = useRef<ScrollView>(null);

  const handleSendMessage = async () => {
    if (inputText.trim()) {
      await sendMessage(inputText);
      setInputText('');
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }
  };

  const handleCameraCapture = async () => {
    if (!permission?.granted) {
      const result = await requestPermission();
      if (!result.granted) {
        Alert.alert('Permission Required', 'Camera access is needed to capture handwritten notes.');
        return;
      }
    }
    setShowCamera(true);
  };

  const handleVoiceInput = () => {
    Alert.alert('Voice Input', 'Voice input feature coming soon!');
  };

  const handleQuickAdd = () => {
    Alert.alert('Quick Add', 'Quick add feature coming soon!');
  };

  const handleSignOut = async () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Sign Out', style: 'destructive', onPress: signOut },
      ]
    );
  };

  if (showCamera) {
    return (
      <View style={styles.cameraContainer}>
        <CameraView style={styles.camera} facing="back">
          <View style={styles.cameraOverlay}>
            <TouchableOpacity
              style={styles.closeCameraButton}
              onPress={() => setShowCamera(false)}
            >
              <Text style={styles.closeCameraText}>Close</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.captureButton}
              onPress={() => {
                setShowCamera(false);
                Alert.alert('Success', 'Handwritten note captured! Processing with AI...');
              }}
            >
              <Text style={styles.captureText}>Capture</Text>
            </TouchableOpacity>
          </View>
        </CameraView>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text style={styles.loadingText}>Loading your brain...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Brain</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.actionButton} onPress={handleQuickAdd}>
            <Plus size={20} color="#3B82F6" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={handleCameraCapture}>
            <Camera size={20} color="#3B82F6" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={handleSignOut}>
            <LogOut size={20} color="#DC2626" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        ref={scrollViewRef}
        style={styles.messagesContainer}
        showsVerticalScrollIndicator={false}
      >
        {messages.length === 0 && (
          <View style={styles.welcomeContainer}>
            <Text style={styles.welcomeText}>
              Welcome to your Second Brain! I'm here to help you capture thoughts, create tasks, and organize your ideas. What's on your mind?
            </Text>
          </View>
        )}
        {messages.map((message) => (
          <View
            key={message.id}
            style={[
              styles.messageWrapper,
              message.is_user ? styles.userMessageWrapper : styles.aiMessageWrapper,
            ]}
          >
            <View
              style={[
                styles.messageBubble,
                message.is_user ? styles.userMessage : styles.aiMessage,
              ]}
            >
              <Text
                style={[
                  styles.messageText,
                  message.is_user ? styles.userMessageText : styles.aiMessageText,
                ]}
              >
                {message.content}
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.inputContainer}
      >
        <View style={styles.inputWrapper}>
          <TouchableOpacity style={styles.voiceButton} onPress={handleVoiceInput}>
            <Mic size={20} color="#64748B" />
          </TouchableOpacity>
          <TextInput
            style={styles.textInput}
            placeholder="Share your thoughts, tasks, or ideas..."
            value={inputText}
            onChangeText={setInputText}
            multiline
            maxLength={500}
          />
          <TouchableOpacity
            style={[styles.sendButton, inputText.trim() && styles.sendButtonActive]}
            onPress={handleSendMessage}
            disabled={!inputText.trim()}
          >
            <Send size={20} color={inputText.trim() ? '#ffffff' : '#64748B'} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
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
  welcomeContainer: {
    padding: 20,
    margin: 16,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  welcomeText: {
    fontSize: 16,
    color: '#334155',
    lineHeight: 22,
    textAlign: 'center',
  },
  cameraContainer: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  cameraOverlay: {
    flex: 1,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    padding: 20,
  },
  closeCameraButton: {
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  closeCameraText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  captureButton: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  captureText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
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
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0f172a',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  messagesContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  messageWrapper: {
    marginVertical: 6,
  },
  userMessageWrapper: {
    alignItems: 'flex-end',
  },
  aiMessageWrapper: {
    alignItems: 'flex-start',
  },
  messageBubble: {
    maxWidth: '85%',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 18,
  },
  userMessage: {
    backgroundColor: '#3B82F6',
    borderBottomRightRadius: 6,
  },
  aiMessage: {
    backgroundColor: '#ffffff',
    borderBottomLeftRadius: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  userMessageText: {
    color: '#ffffff',
  },
  aiMessageText: {
    color: '#334155',
  },
  inputContainer: {
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: '#f8fafc',
    borderRadius: 24,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 12,
  },
  voiceButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: '#334155',
    maxHeight: 100,
    paddingVertical: 8,
  },
  sendButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e2e8f0',
  },
  sendButtonActive: {
    backgroundColor: '#3B82F6',
  },
});