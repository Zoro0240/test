import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  ScrollView, 
  Pressable, 
  Alert,
  Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/components/ThemeProvider';
import { useExpenseStore } from '@/store/useExpenseStore';
import { CategoryPicker } from '@/components/CategoryPicker';
import { TagInput } from '@/components/TagInput';
import { DatePicker } from '@/components/DatePicker';
import { router } from 'expo-router';
import { Save, ArrowLeft, Sparkles, Zap } from 'lucide-react-native';
import Animated, { FadeInDown, FadeInUp, SlideInRight, SlideInLeft } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

export default function AddExpenseScreen() {
  const theme = useTheme();
  const { addExpense, categories, getSuggestedCategories, getPopularTags, settings } = useExpenseStore();
  
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [note, setNote] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [date, setDate] = useState(new Date());
  const [isLoading, setIsLoading] = useState(false);
  const [suggestedCategories, setSuggestedCategories] = useState<string[]>([]);

  useEffect(() => {
    if (amount || note) {
      const suggestions = getSuggestedCategories(parseFloat(amount) || 0, note);
      setSuggestedCategories(suggestions);
    }
  }, [amount, note, getSuggestedCategories]);

  const handleSave = async () => {
    if (!amount || !category) {
      Alert.alert('Missing Information', 'Please enter an amount and select a category');
      return;
    }

    setIsLoading(true);
    
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }

    try {
      await addExpense({
        amount: parseFloat(amount),
        category,
        note: note.trim(),
        tags,
        date,
      });

      // Reset form
      setAmount('');
      setCategory('');
      setNote('');
      setTags([]);
      setDate(new Date());
      
      router.push('/(tabs)');
    } catch (error) {
      Alert.alert('Error', 'Failed to save expense');
    } finally {
      setIsLoading(false);
    }
  };

  const quickAmounts = [50, 100, 200, 500, 1000];

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: theme.spacing.lg,
      paddingTop: theme.spacing.xl,
      paddingBottom: theme.spacing.xl,
      backgroundColor: theme.colors.surface,
      borderBottomLeftRadius: theme.borderRadius.xxxl,
      borderBottomRightRadius: theme.borderRadius.xxxl,
      ...theme.shadows.lg,
    },
    headerTitle: {
      fontSize: theme.typography.fontSize.xxxl,
      fontFamily: theme.typography.fontFamily.bold,
      color: theme.colors.text,
    },
    backButton: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: theme.colors.surfaceVariant,
      justifyContent: 'center',
      alignItems: 'center',
    },
    saveButton: {
      backgroundColor: theme.colors.primary,
      paddingHorizontal: theme.spacing.xl,
      paddingVertical: theme.spacing.md,
      borderRadius: theme.borderRadius.xl,
      flexDirection: 'row',
      alignItems: 'center',
      ...theme.shadows.md,
    },
    saveButtonText: {
      color: theme.colors.surface,
      fontFamily: theme.typography.fontFamily.semiBold,
      fontSize: theme.typography.fontSize.md,
      marginLeft: theme.spacing.sm,
    },
    scrollContainer: {
      flex: 1,
      paddingHorizontal: theme.spacing.lg,
      paddingTop: theme.spacing.xl,
    },
    section: {
      marginBottom: theme.spacing.xxxl,
    },
    sectionTitle: {
      fontSize: theme.typography.fontSize.lg,
      fontFamily: theme.typography.fontFamily.semiBold,
      color: theme.colors.text,
      marginBottom: theme.spacing.lg,
    },
    amountContainer: {
      alignItems: 'center',
      paddingVertical: theme.spacing.xxxl,
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.xxxl,
      marginBottom: theme.spacing.xl,
      ...theme.shadows.md,
      borderWidth: 1,
      borderColor: theme.colors.borderLight,
    },
    currencySymbol: {
      fontSize: theme.typography.fontSize.xl,
      fontFamily: theme.typography.fontFamily.medium,
      color: theme.colors.textSecondary,
      marginBottom: theme.spacing.lg,
    },
    amountInput: {
      fontSize: 52,
      fontFamily: theme.typography.fontFamily.bold,
      color: theme.colors.primary,
      textAlign: 'center',
      minWidth: 200,
      marginBottom: theme.spacing.xl,
    },
    quickAmounts: {
      flexDirection: 'row',
      justifyContent: 'center',
      flexWrap: 'wrap',
      gap: theme.spacing.md,
    },
    quickAmountButton: {
      backgroundColor: theme.colors.surfaceVariant,
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.md,
      borderRadius: theme.borderRadius.xl,
      borderWidth: 1,
      borderColor: theme.colors.borderLight,
    },
    quickAmountText: {
      color: theme.colors.text,
      fontFamily: theme.typography.fontFamily.medium,
      fontSize: theme.typography.fontSize.sm,
    },
    input: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.xl,
      padding: theme.spacing.xl,
      fontSize: theme.typography.fontSize.md,
      fontFamily: theme.typography.fontFamily.regular,
      color: theme.colors.text,
      borderWidth: 1,
      borderColor: theme.colors.borderLight,
      ...theme.shadows.sm,
      minHeight: 60,
    },
    suggestedCategories: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginTop: theme.spacing.lg,
      gap: theme.spacing.md,
    },
    suggestionChip: {
      backgroundColor: theme.colors.primary + '15',
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.md,
      borderRadius: theme.borderRadius.xl,
      flexDirection: 'row',
      alignItems: 'center',
    },
    suggestionText: {
      color: theme.colors.primary,
      fontSize: theme.typography.fontSize.sm,
      fontFamily: theme.typography.fontFamily.medium,
      marginLeft: theme.spacing.sm,
    },
    categorySection: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.xl,
      padding: theme.spacing.xl,
      borderWidth: 1,
      borderColor: theme.colors.borderLight,
      ...theme.shadows.sm,
    },
    aiSuggestionHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: theme.spacing.md,
    },
    aiSuggestionTitle: {
      fontSize: theme.typography.fontSize.md,
      fontFamily: theme.typography.fontFamily.medium,
      color: theme.colors.primary,
      marginLeft: theme.spacing.sm,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View entering={SlideInRight.delay(100)} style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={22} color={theme.colors.text} />
        </Pressable>
        <Text style={styles.headerTitle}>Add Expense</Text>
        <Pressable 
          style={[styles.saveButton, { opacity: isLoading ? 0.5 : 1 }]} 
          onPress={handleSave}
          disabled={isLoading}
        >
          <Save size={18} color={theme.colors.surface} />
          <Text style={styles.saveButtonText}>Save</Text>
        </Pressable>
      </Animated.View>

      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <Animated.View entering={FadeInUp.delay(200)} style={styles.amountContainer}>
          <Text style={styles.currencySymbol}>{settings.currency}</Text>
          <TextInput
            style={styles.amountInput}
            value={amount}
            onChangeText={setAmount}
            placeholder="0"
            placeholderTextColor={theme.colors.textTertiary}
            keyboardType="numeric"
            autoFocus
          />
          <View style={styles.quickAmounts}>
            {quickAmounts.map((quickAmount) => (
              <Pressable
                key={quickAmount}
                style={styles.quickAmountButton}
                onPress={() => setAmount(quickAmount.toString())}
              >
                <Text style={styles.quickAmountText}>
                  {settings.currency}{quickAmount}
                </Text>
              </Pressable>
            ))}
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(300)} style={styles.section}>
          <Text style={styles.sectionTitle}>Category</Text>
          <View style={styles.categorySection}>
            <CategoryPicker
              selectedCategory={category}
              onSelectCategory={setCategory}
              categories={categories}
            />
            {suggestedCategories.length > 0 && (
              <>
                <View style={styles.aiSuggestionHeader}>
                  <Zap size={16} color={theme.colors.primary} />
                  <Text style={styles.aiSuggestionTitle}>AI Suggestions</Text>
                </View>
                <View style={styles.suggestedCategories}>
                  {suggestedCategories.map((suggestion) => (
                    <Pressable
                      key={suggestion}
                      style={styles.suggestionChip}
                      onPress={() => {
                        const cat = categories.find(c => c.name === suggestion);
                        if (cat) setCategory(cat.id);
                      }}
                    >
                      <Sparkles size={14} color={theme.colors.primary} />
                      <Text style={styles.suggestionText}>{suggestion}</Text>
                    </Pressable>
                  ))}
                </View>
              </>
            )}
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(400)} style={styles.section}>
          <Text style={styles.sectionTitle}>Note (Optional)</Text>
          <TextInput
            style={styles.input}
            value={note}
            onChangeText={setNote}
            placeholder="What did you spend on?"
            placeholderTextColor={theme.colors.textSecondary}
            multiline
            numberOfLines={3}
          />
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(500)} style={styles.section}>
          <Text style={styles.sectionTitle}>Tags</Text>
          <TagInput
            tags={tags}
            onTagsChange={setTags}
            popularTags={getPopularTags()}
          />
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(600)} style={styles.section}>
          <Text style={styles.sectionTitle}>Date</Text>
          <DatePicker date={date} onDateChange={setDate} />
        </Animated.View>

        <View style={{ height: 120 }} />
      </ScrollView>
    </SafeAreaView>
  );
}