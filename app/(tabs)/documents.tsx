import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FileText, Upload, Search, Filter, FolderOpen, File, MoveVertical as MoreVertical } from 'lucide-react-native';
import { useDocuments } from '@/hooks/useDocuments';

export default function DocumentsTab() {
  const [activeTab, setActiveTab] = useState<'all' | 'pdfs' | 'docs' | 'notes'>('all');
  const { documents, loading, deleteDocument } = useDocuments();

  const filteredDocuments = documents.filter(doc => {
    if (activeTab === 'all') return true;
    if (activeTab === 'pdfs') return doc.file_type === 'pdf';
    if (activeTab === 'docs') return doc.file_type === 'doc' || doc.file_type === 'docx';
    if (activeTab === 'notes') return doc.file_type === 'note' || doc.file_type === 'txt';
    return true;
  });

  const getFileIcon = (fileType: string) => {
    switch (fileType) {
      case 'pdf':
        return <File size={24} color="#DC2626" />;
      case 'doc':
      case 'docx':
        return <FileText size={24} color="#2563EB" />;
      case 'note':
      case 'txt':
        return <FileText size={24} color="#059669" />;
      default:
        return <File size={24} color="#64748B" />;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleUpload = () => {
    Alert.alert('Upload Document', 'Document upload feature coming soon!');
  };

  const handleDocumentAction = (documentId: string) => {
    Alert.alert(
      'Document Actions',
      'Choose an action',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'View', onPress: () => console.log('View document') },
        { 
          text: 'Delete', 
          style: 'destructive', 
          onPress: () => handleDeleteDocument(documentId) 
        },
      ]
    );
  };

  const handleDeleteDocument = async (documentId: string) => {
    const success = await deleteDocument(documentId);
    if (success) {
      Alert.alert('Success', 'Document deleted successfully');
    } else {
      Alert.alert('Error', 'Failed to delete document');
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text style={styles.loadingText}>Loading documents...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Documents</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.actionButton}>
            <Search size={20} color="#3B82F6" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Filter size={20} color="#3B82F6" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.uploadButton} onPress={handleUpload}>
            <Upload size={20} color="#ffffff" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.tabsContainer}>
        {[
          { key: 'all', label: 'All Files' },
          { key: 'pdfs', label: 'PDFs' },
          { key: 'docs', label: 'Docs' },
          { key: 'notes', label: 'Notes' },
        ].map((tab) => (
          <TouchableOpacity
            key={tab.key}
            style={[
              styles.tab,
              activeTab === tab.key && styles.activeTab,
            ]}
            onPress={() => setActiveTab(tab.key as any)}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === tab.key && styles.activeTabText,
              ]}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={styles.documentsContainer} showsVerticalScrollIndicator={false}>
        {filteredDocuments.length === 0 ? (
          <View style={styles.emptyState}>
            <FolderOpen size={64} color="#94a3b8" />
            <Text style={styles.emptyTitle}>No documents yet</Text>
            <Text style={styles.emptySubtitle}>
              Upload your first document or capture a note to get started
            </Text>
          </View>
        ) : (
          filteredDocuments.map((doc) => (
            <TouchableOpacity key={doc.id} style={styles.documentCard}>
              <View style={styles.documentIcon}>
                {getFileIcon(doc.file_type)}
              </View>
              <View style={styles.documentInfo}>
                <Text style={styles.documentName}>{doc.name}</Text>
                <Text style={styles.documentDetails}>
                  {doc.category} • {formatFileSize(doc.file_size)} • {new Date(doc.created_at).toLocaleDateString()}
                </Text>
              </View>
              <TouchableOpacity 
                style={styles.moreButton}
                onPress={() => handleDocumentAction(doc.id)}
              >
                <MoreVertical size={20} color="#64748B" />
              </TouchableOpacity>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
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
  uploadButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#3B82F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: '#eff6ff',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748B',
  },
  activeTabText: {
    color: '#3B82F6',
  },
  documentsContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 80,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#475569',
    marginTop: 16,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#94a3b8',
    textAlign: 'center',
    marginTop: 8,
    paddingHorizontal: 32,
  },
  documentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  documentIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#f8fafc',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  documentInfo: {
    flex: 1,
  },
  documentName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0f172a',
    marginBottom: 4,
  },
  documentDetails: {
    fontSize: 14,
    color: '#64748B',
  },
  moreButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
});