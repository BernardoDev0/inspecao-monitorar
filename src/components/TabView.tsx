import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, spacing, typography } from '../constants/theme';

interface Tab {
  key: string;
  title: string;
}

interface TabViewProps {
  tabs: Tab[];
  children: React.ReactNode[];
  initialTab?: string;
}

export const TabView: React.FC<TabViewProps> = ({ tabs, children, initialTab }) => {
  const [activeTab, setActiveTab] = useState(initialTab || tabs[0].key);

  const renderTabContent = () => {
    const activeTabIndex = tabs.findIndex(tab => tab.key === activeTab);
    return children[activeTabIndex] || null;
  };

  return (
    <View style={styles.container}>
      <View style={styles.tabBar}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.key}
            style={[
              styles.tabButton,
              activeTab === tab.key && styles.activeTabButton,
            ]}
            onPress={() => setActiveTab(tab.key)}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === tab.key && styles.activeTabText,
              ]}
            >
              {tab.title}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={styles.content}>
        {renderTabContent()}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: colors.bgSecondary,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  tabButton: {
    flex: 1,
    paddingVertical: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeTabButton: {
    backgroundColor: colors.bgPrimary,
  },
  tabText: {
    ...typography.body,
    color: colors.textMuted,
    fontWeight: '500',
  },
  activeTabText: {
    color: colors.accent,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
});