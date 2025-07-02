import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable } from 'react-native';
import { useTheme } from '@/components/ThemeProvider';
import { Tag } from '@/types/expense';
import { X, Plus, Hash } from 'lucide-react-native';

interface TagInputProps {
  tags: string[];
  onTagsChange: (tags: string[]) => void;
  popularTags: Tag[];
}

export function TagInput({ tags, onTagsChange, popularTags }: TagInputProps) {
  const theme = useTheme();
  const [inputValue, setInputValue] = useState('');

  const addTag = (tagName: string) => {
    const trimmedTag = tagName.trim().toLowerCase();
    if (trimmedTag && !tags.includes(trimmedTag)) {
      onTagsChange([...tags, trimmedTag]);
    }
    setInputValue('');
  };

  const removeTag = (tagToRemove: string) => {
    onTagsChange(tags.filter(tag => tag !== tagToRemove));
  };

  const handleSubmit = () => {
    if (inputValue.trim()) {
      addTag(inputValue);
    }
  };

  const styles = StyleSheet.create({
    container: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.xl,
      padding: theme.spacing.lg,
      borderWidth: 1,
      borderColor: theme.colors.borderLight,
      ...theme.shadows.sm,
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.surfaceVariant,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.sm,
      marginBottom: theme.spacing.md,
    },
    inputIcon: {
      marginLeft: theme.spacing.sm,
      marginRight: theme.spacing.xs,
    },
    input: {
      flex: 1,
      fontSize: theme.typography.fontSize.md,
      fontFamily: theme.typography.fontFamily.regular,
      color: theme.colors.text,
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: theme.spacing.xs,
    },
    addButton: {
      backgroundColor: theme.colors.primary,
      width: 32,
      height: 32,
      borderRadius: 16,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: theme.spacing.sm,
    },
    tagsContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: theme.spacing.sm,
      marginBottom: theme.spacing.md,
    },
    tag: {
      backgroundColor: theme.colors.primary + '20',
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      borderRadius: theme.borderRadius.xl,
      flexDirection: 'row',
      alignItems: 'center',
    },
    tagText: {
      color: theme.colors.primary,
      fontSize: theme.typography.fontSize.sm,
      fontFamily: theme.typography.fontFamily.medium,
      marginRight: theme.spacing.sm,
    },
    removeButton: {
      padding: 2,
    },
    popularTagsTitle: {
      fontSize: theme.typography.fontSize.sm,
      fontFamily: theme.typography.fontFamily.medium,
      color: theme.colors.textSecondary,
      marginBottom: theme.spacing.sm,
    },
    popularTagsContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: theme.spacing.sm,
    },
    popularTag: {
      backgroundColor: theme.colors.surfaceVariant,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      borderRadius: theme.borderRadius.xl,
      borderWidth: 1,
      borderColor: theme.colors.borderLight,
    },
    popularTagText: {
      color: theme.colors.text,
      fontSize: theme.typography.fontSize.sm,
      fontFamily: theme.typography.fontFamily.regular,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <Hash size={16} color={theme.colors.textSecondary} style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          value={inputValue}
          onChangeText={setInputValue}
          placeholder="Enter a tag..."
          placeholderTextColor={theme.colors.textSecondary}
          onSubmitEditing={handleSubmit}
          returnKeyType="done"
        />
        <Pressable style={styles.addButton} onPress={handleSubmit}>
          <Plus size={16} color={theme.colors.surface} />
        </Pressable>
      </View>

      {tags.length > 0 && (
        <View style={styles.tagsContainer}>
          {tags.map((tag) => (
            <View key={tag} style={styles.tag}>
              <Text style={styles.tagText}>#{tag}</Text>
              <Pressable
                style={styles.removeButton}
                onPress={() => removeTag(tag)}
              >
                <X size={14} color={theme.colors.primary} />
              </Pressable>
            </View>
          ))}
        </View>
      )}

      {popularTags.length > 0 && (
        <View>
          <Text style={styles.popularTagsTitle}>Popular Tags</Text>
          <View style={styles.popularTagsContainer}>
            {popularTags.slice(0, 6).map((tag) => (
              <Pressable
                key={tag.id}
                style={styles.popularTag}
                onPress={() => addTag(tag.name)}
              >
                <Text style={styles.popularTagText}>
                  #{tag.name} ({tag.count})
                </Text>
              </Pressable>
            ))}
          </View>
        </View>
      )}
    </View>
  );
}