import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Switch,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { User, Bell, Shield, Palette, Download, CircleHelp as HelpCircle, LogOut, ChevronRight, Moon, Globe, Smartphone } from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';

interface SettingItem {
  id: string;
  title: string;
  subtitle?: string;
  icon: any;
  type: 'navigation' | 'toggle' | 'action';
  value?: boolean;
  color?: string;
}

export default function SettingsTab() {
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [biometric, setBiometric] = useState(true);
  const { user, signOut } = useAuth();

  const settingSections = [
    {
      title: 'Account',
      items: [
        {
          id: 'profile',
          title: 'Profile',
          subtitle: 'Manage your personal information',
          icon: User,
          type: 'navigation' as const,
        },
        {
          id: 'security',
          title: 'Security',
          subtitle: 'Password, biometric, and privacy settings',
          icon: Shield,
          type: 'navigation' as const,
        },
      ],
    },
    {
      title: 'Preferences',
      items: [
        {
          id: 'notifications',
          title: 'Notifications',
          subtitle: 'Manage your notification preferences',
          icon: Bell,
          type: 'toggle' as const,
          value: notifications,
        },
        {
          id: 'theme',
          title: 'Dark Mode',
          subtitle: 'Switch between light and dark themes',
          icon: Moon,
          type: 'toggle' as const,
          value: darkMode,
        },
        {
          id: 'language',
          title: 'Language',
          subtitle: 'English',
          icon: Globe,
          type: 'navigation' as const,
        },
      ],
    },
    {
      title: 'Data & Privacy',
      items: [
        {
          id: 'biometric',
          title: 'Biometric Lock',
          subtitle: 'Use fingerprint or face ID to unlock',
          icon: Smartphone,
          type: 'toggle' as const,
          value: biometric,
        },
        {
          id: 'export',
          title: 'Export Data',
          subtitle: 'Download all your data',
          icon: Download,
          type: 'navigation' as const,
        },
      ],
    },
    {
      title: 'Support',
      items: [
        {
          id: 'help',
          title: 'Help & Support',
          subtitle: 'Get help and contact support',
          icon: HelpCircle,
          type: 'navigation' as const,
        },
        {
          id: 'logout',
          title: 'Sign Out',
          subtitle: 'Sign out of your account',
          icon: LogOut,
          type: 'action' as const,
          color: '#DC2626',
        },
      ],
    },
  ];

  const handleToggle = (id: string, value: boolean) => {
    switch (id) {
      case 'notifications':
        setNotifications(value);
        break;
      case 'theme':
        setDarkMode(value);
        break;
      case 'biometric':
        setBiometric(value);
        break;
    }
  };


  const handleAction = (id: string) => {
    if (id === 'logout') {
      Alert.alert(
        'Sign Out',
        'Are you sure you want to sign out?',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Sign Out', style: 'destructive', onPress: signOut },
        ]
      );
    }
  };

  const handleNavigation = (id: string) => {
    switch (id) {
      case 'profile':
        Alert.alert('Profile', 'Profile editing coming soon!');
        break;
      case 'security':
        Alert.alert('Security', 'Security settings coming soon!');
        break;
      case 'language':
        Alert.alert('Language', 'Language selection coming soon!');
        break;
      case 'export':
        Alert.alert('Export Data', 'Data export feature coming soon!');
        break;
      case 'help':
        Alert.alert('Help & Support', 'Help center coming soon!');
        break;
      default:
        console.log(`Navigate to: ${id}`);
    }
  };

  const renderSettingItem = (item: SettingItem) => (
    <TouchableOpacity
      key={item.id}
      style={styles.settingItem}
      onPress={() => {
        if (item.type === 'navigation') {
          handleNavigation(item.id);
        } else if (item.type === 'action') {
          handleAction(item.id);
        }
      }}
    >
      <View style={styles.settingLeft}>
        <View style={[styles.settingIcon, item.color && { backgroundColor: `${item.color}15` }]}>
          <item.icon 
            size={20} 
            color={item.color || '#3B82F6'} 
          />
        </View>
        <View style={styles.settingText}>
          <Text style={[styles.settingTitle, item.color && { color: item.color }]}>
            {item.title}
          </Text>
          {item.subtitle && (
            <Text style={styles.settingSubtitle}>{item.subtitle}</Text>
          )}
        </View>
      </View>
      <View style={styles.settingRight}>
        {item.type === 'toggle' ? (
          <Switch
            value={item.value || false}
            onValueChange={(value) => handleToggle(item.id, value)}
            trackColor={{ false: '#f1f5f9', true: '#bfdbfe' }}
            thumbColor={item.value ? '#3B82F6' : '#f4f3f4'}
          />
        ) : (
          <ChevronRight size={20} color="#94a3b8" />
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Settings</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* User Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>JD</Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>
              {user?.user_metadata?.full_name || 'User'}
            </Text>
            <Text style={styles.profileEmail}>{user?.email}</Text>
          </View>
          <TouchableOpacity style={styles.editButton}>
            <Text style={styles.editButtonText}>Edit</Text>
          </TouchableOpacity>
        </View>

        {/* Settings Sections */}
        {settingSections.map((section, index) => (
          <View key={index} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <View style={styles.sectionContent}>
              {section.items.map(renderSettingItem)}
            </View>
          </View>
        ))}

        {/* App Info */}
        <View style={styles.appInfo}>
          <Text style={styles.appInfoText}>Second Brain v1.0.0</Text>
          <Text style={styles.appInfoText}>© 2024 Your Digital Memory</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
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
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 20,
    marginTop: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#3B82F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  avatarText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#ffffff',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0f172a',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    color: '#64748B',
  },
  editButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#f1f5f9',
    borderRadius: 6,
  },
  editButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#3B82F6',
  },
  section: {
    marginTop: 32,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  sectionContent: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f8fafc',
  },
  settingLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#eff6ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingText: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0f172a',
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 14,
    color: '#64748B',
  },
  settingRight: {
    marginLeft: 12,
  },
  appInfo: {
    alignItems: 'center',
    paddingVertical: 32,
    gap: 4,
  },
  appInfoText: {
    fontSize: 14,
    color: '#94a3b8',
  },
});