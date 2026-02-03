import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import api from '../config/api';
import { colors, spacing, fontSize, fontWeight, borderRadius, shadows } from '../config/theme';

export default function WithdrawalRequestScreen({ navigation }) {
  const [formData, setFormData] = useState({
    amount: '',
    bank_name: '',
    account_holder_name: '',
    account_number: '',
    iban: '',
    notes: '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!formData.amount || !formData.bank_name || !formData.account_holder_name || !formData.account_number) {
      Alert.alert('خطأ', 'الرجاء ملء جميع الحقول المطلوبة');
      return;
    }

    if (parseFloat(formData.amount) <= 0) {
      Alert.alert('خطأ', 'المبلغ يجب أن يكون أكبر من صفر');
      return;
    }

    setLoading(true);
    try {
      await api.post('/wallet/withdraw', formData);
      Alert.alert(
        'نجح',
        'تم إرسال طلب السحب بنجاح. سيتم مراجعته من قبل الإدارة.',
        [{ text: 'حسناً', onPress: () => navigation.goBack() }]
      );
    } catch (error) {
      Alert.alert('خطأ', error.response?.data?.message || 'فشل إرسال الطلب');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>💸 طلب سحب الأموال</Text>
        <Text style={styles.headerSubtitle}>
          املأ البيانات البنكية لتحويل الأموال
        </Text>
      </View>

      <View style={styles.form}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>المبلغ المطلوب *</Text>
          <TextInput
            style={styles.input}
            placeholder="0.00"
            value={formData.amount}
            onChangeText={(text) => setFormData({ ...formData, amount: text })}
            keyboardType="decimal-pad"
          />
          <Text style={styles.hint}>AED</Text>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>اسم البنك *</Text>
          <TextInput
            style={styles.input}
            placeholder="مثال: البنك الأهلي"
            value={formData.bank_name}
            onChangeText={(text) => setFormData({ ...formData, bank_name: text })}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>اسم صاحب الحساب *</Text>
          <TextInput
            style={styles.input}
            placeholder="الاسم كما يظهر في البنك"
            value={formData.account_holder_name}
            onChangeText={(text) => setFormData({ ...formData, account_holder_name: text })}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>رقم الحساب *</Text>
          <TextInput
            style={styles.input}
            placeholder="رقم الحساب البنكي"
            value={formData.account_number}
            onChangeText={(text) => setFormData({ ...formData, account_number: text })}
            keyboardType="number-pad"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>IBAN (اختياري)</Text>
          <TextInput
            style={styles.input}
            placeholder="AE123456789012345678901"
            value={formData.iban}
            onChangeText={(text) => setFormData({ ...formData, iban: text })}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>ملاحظات (اختياري)</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="أي ملاحظات إضافية"
            value={formData.notes}
            onChangeText={(text) => setFormData({ ...formData, notes: text })}
            multiline
            numberOfLines={4}
          />
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>📌 ملاحظات هامة:</Text>
          <Text style={styles.infoText}>• سيتم مراجعة الطلب من قبل الإدارة</Text>
          <Text style={styles.infoText}>• قد يستغرق التحويل من 1-3 أيام عمل</Text>
          <Text style={styles.infoText}>• تأكد من صحة البيانات البنكية</Text>
        </View>

        <TouchableOpacity
          style={[styles.submitButton, loading && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.submitButtonText}>إرسال الطلب</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    backgroundColor: colors.primary,
    padding: spacing.xl,
    paddingTop: spacing.xxl,
  },
  headerTitle: {
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.bold,
    color: '#fff',
    marginBottom: spacing.xs,
  },
  headerSubtitle: {
    fontSize: fontSize.md,
    color: '#fff',
    opacity: 0.9,
  },
  form: {
    padding: spacing.lg,
  },
  inputGroup: {
    marginBottom: spacing.lg,
  },
  label: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  input: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontSize: fontSize.md,
    color: colors.text,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  hint: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  infoBox: {
    backgroundColor: '#FFF3E0',
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: '#FFB74D',
  },
  infoTitle: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
    color: '#F57C00',
    marginBottom: spacing.sm,
  },
  infoText: {
    fontSize: fontSize.sm,
    color: '#E65100',
    marginBottom: spacing.xs,
  },
  submitButton: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    ...shadows.md,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
  },
});
