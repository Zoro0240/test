import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useTheme } from '@/components/ThemeProvider';
import { Hash } from 'lucide-react-native';

interface TagCloudProps {
  tags: Array<{
    name: string;
    count: number;
    amount: number;
  }>;
}

export function TagCloud({ tags }: TagCloudProps) {
  const theme = useTheme();

  const getTagSize = (count: number, maxCount: number) => {
    const ratio = count / maxCount;
    return theme.typography.fontSize.sm + (ratio * 6); // Font size between 14 and 20
  };

  const maxCount = Math.max(...tags.map(tag => tag.count));

  const styles = StyleSheet.create({
    container: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.xl,
      padding: theme.spacing.lg,
      marginBottom: theme.spacing.lg,
      borderWidth: 1,
      borderColor: theme.colors.borderLight,
      ...theme.shadows.sm,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: theme.spacing.lg,
    },
    headerIcon: {
      marginRight: theme.spacing.sm,
    },
    headerTitle: {
      fontSize: theme.typography.fontSize.lg,
      fontFamily: theme.typography.fontFamily.semiBold,
      color: theme.colors.text,
    },
    tagContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      alignItems: 'center',
      gap: theme.spacing.sm,
    },
    tag: {
      backgroundColor: theme.colors.surfaceVariant,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      borderRadius: theme.borderRadius.xl,
      borderWidth: 1,
      borderColor: theme.colors.borderLight,
    },
    tagText: {
      color: theme.colors.primary,
      fontFamily: theme.typography.fontFamily.medium,
    },
    emptyState: {
      alignItems: 'center',
      paddingVertical: theme.spacing.xl,
    },
    emptyText: {
      fontSize: theme.typography.fontSize.md,
      fontFamily: theme.typography.fontFamily.regular,
      color: theme.colors.textSecondary,
      textAlign: 'center',
      marginTop: theme.spacing.sm,
    },
  });

  if (tags.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Hash size={20} color={theme.colors.primary} style={styles.headerIcon} />
          <Text style={styles.headerTitle}>Popular Tags</Text>
        </View>
        <View style={styles.emptyState}>
          <Hash size={32} color={theme.colors.textTertiary} />
          <Text style={styles.emptyText}>No tags used yet</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Hash size={20} color={theme.colors.primary} style={styles.headerIcon} />
        <Text style={styles.headerTitle}>Popular Tags</Text>
      </View>
      
      <View style={styles.tagContainer}>
        {tags.map((tag) => (
          <Pressable key={tag.name} style={styles.tag}>
            <Text 
              style={[
                styles.tagText,
                {
                  fontSize: getTagSize(tag.count, maxCount),
                }
              ]}
            >
              #{tag.name} ({tag.count})
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}