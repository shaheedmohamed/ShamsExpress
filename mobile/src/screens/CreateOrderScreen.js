import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { orderService } from '../services/orderService';
import Input from '../components/Input';
import Button from '../components/Button';
import { colors, spacing, fontSize, fontWeight } from '../config/theme';

export default function CreateOrderScreen({ navigation }) {
  const { isGuest, signOut } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    pickup_address: '',
    pickup_latitude: '30.0444',
    pickup_longitude: '31.2357',
    delivery_address: '',
    delivery_latitude: '30.0626',
    delivery_longitude: '31.2497',
    recipient_name: '',
    recipient_phone: '',
    package_description: '',
    delivery_fee: '50',
    notes: '',
  });

  const updateField = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = async () => {
    if (isGuest) {
      Alert.alert(
        'Login Required',
        'Please login to create a delivery order.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Go to Login', onPress: signOut },
        ]
      );
      return;
    }

    if (
      !formData.pickup_address ||
      !formData.delivery_address ||
      !formData.recipient_name ||
      !formData.recipient_phone
    ) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      await orderService.createOrder(formData);
      Alert.alert('Success', 'Order created successfully', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to create order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          <Text style={styles.title}>Create Delivery Order</Text>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>📍 Pickup Information</Text>
            <Input
              label="Pickup Address *"
              value={formData.pickup_address}
              onChangeText={(value) => updateField('pickup_address', value)}
              placeholder="Enter pickup address"
              multiline
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🎯 Delivery Information</Text>
            <Input
              label="Delivery Address *"
              value={formData.delivery_address}
              onChangeText={(value) => updateField('delivery_address', value)}
              placeholder="Enter delivery address"
              multiline
            />
            <Input
              label="Recipient Name *"
              value={formData.recipient_name}
              onChangeText={(value) => updateField('recipient_name', value)}
              placeholder="Enter recipient name"
            />
            <Input
              label="Recipient Phone *"
              value={formData.recipient_phone}
              onChangeText={(value) => updateField('recipient_phone', value)}
              placeholder="Enter recipient phone"
              keyboardType="phone-pad"
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>📦 Package Details</Text>
            <Input
              label="Package Description"
              value={formData.package_description}
              onChangeText={(value) => updateField('package_description', value)}
              placeholder="Describe the package"
              multiline
              numberOfLines={3}
            />
            <Input
              label="Delivery Fee"
              value={formData.delivery_fee}
              onChangeText={(value) => updateField('delivery_fee', value)}
              placeholder="Enter delivery fee"
              keyboardType="numeric"
            />
            <Input
              label="Additional Notes"
              value={formData.notes}
              onChangeText={(value) => updateField('notes', value)}
              placeholder="Any special instructions"
              multiline
              numberOfLines={3}
            />
          </View>

          <Button
            title="Create Order"
            onPress={handleSubmit}
            loading={loading}
            style={styles.submitButton}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: spacing.lg,
  },
  title: {
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.bold,
    color: colors.text,
    marginBottom: spacing.lg,
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
    color: colors.text,
    marginBottom: spacing.md,
  },
  submitButton: {
    marginTop: spacing.md,
    marginBottom: spacing.xl,
  },
});
