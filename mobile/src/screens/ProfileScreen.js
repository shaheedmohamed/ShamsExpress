import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import Input from '../components/Input';
import Button from '../components/Button';
import { colors, spacing, fontSize, fontWeight, borderRadius, shadows } from '../config/theme';

export default function ProfileScreen({ navigation }) {
  const { user, signOut, updateProfile, isGuest } = useAuth();
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
  });

  const handleUpdate = async () => {
    setLoading(true);
    const result = await updateProfile(formData);
    setLoading(false);

    if (result.success) {
      setEditing(false);
      Alert.alert('Success', 'Profile updated successfully');
    } else {
      Alert.alert('Error', result.message);
    }
  };

  const handleUpgradeAccount = () => {
    Alert.alert(
      'Create Real Account',
      'Would you like to create a real account? Your orders and data will be preserved.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Create Account', onPress: () => navigation.navigate('Register') },
      ]
    );
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', style: 'destructive', onPress: signOut },
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <Text style={styles.avatarText}>
            {user?.name?.charAt(0).toUpperCase()}
          </Text>
        </View>
        <Text style={styles.userName}>{user?.name}</Text>
        <Text style={styles.userEmail}>{isGuest ? 'Guest Mode' : user?.email}</Text>
      </View>

      {isGuest && (
        <View style={styles.guestCard}>
          <Text style={styles.guestCardTitle}>🎭 Guest Account</Text>
          <Text style={styles.guestText}>
            You're using a guest account. Create a real account to secure your data and access it from any device.
          </Text>
          <Button 
            title="Create Real Account" 
            onPress={handleUpgradeAccount}
            style={styles.upgradeButton}
          />
        </View>
      )}

      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Personal Information</Text>
          {!editing && (
            <TouchableOpacity onPress={() => setEditing(true)}>
              <Text style={styles.editButton}>Edit</Text>
            </TouchableOpacity>
          )}
        </View>

        {editing ? (
          <>
            <Input
              label="Name"
              value={formData.name}
              onChangeText={(value) => setFormData({ ...formData, name: value })}
              placeholder="Enter your name"
            />
            <Input
              label="Phone"
              value={formData.phone}
              onChangeText={(value) => setFormData({ ...formData, phone: value })}
              placeholder="Enter your phone"
              keyboardType="phone-pad"
            />
            <View style={styles.buttonRow}>
              <Button
                title="Cancel"
                onPress={() => {
                  setEditing(false);
                  setFormData({ name: user?.name || '', phone: user?.phone || '' });
                }}
                variant="outline"
                style={styles.button}
              />
              <Button
                title="Save"
                onPress={handleUpdate}
                loading={loading}
                style={styles.button}
              />
            </View>
          </>
        ) : (
          <>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Name</Text>
              <Text style={styles.value}>{user?.name}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Email</Text>
              <Text style={styles.value}>{user?.email}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Phone</Text>
              <Text style={styles.value}>{user?.phone || 'Not set'}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Role</Text>
              <Text style={[styles.value, styles.roleBadge]}>
                {(user?.role || 'guest').toUpperCase()}
              </Text>
            </View>
          </>
        )}
      </View>

      {user?.saved_addresses && user.saved_addresses.length > 0 && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>📍 Saved Addresses</Text>
          {user.saved_addresses.map((addr, index) => (
            <View key={index} style={styles.addressItem}>
              <View style={styles.addressHeader}>
                <Text style={styles.addressLabel}>{addr.label || `Address ${index + 1}`}</Text>
              </View>
              <Text style={styles.addressText}>{addr.address}</Text>
              {addr.customer_name && (
                <Text style={styles.customerName}>Customer: {addr.customer_name}</Text>
              )}
            </View>
          ))}
        </View>
      )}

      <View style={styles.card}>
        <Text style={styles.cardTitle}>App Information</Text>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Version</Text>
          <Text style={styles.value}>1.0.0</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Build</Text>
          <Text style={styles.value}>2024.01.28</Text>
        </View>
      </View>

      {!isGuest && (
        <Button
          title="Logout"
          onPress={handleLogout}
          variant="outline"
          style={styles.logoutButton}
        />
      )}
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
    padding: spacing.lg,
    alignItems: 'center',
  },
  avatarContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  avatarText: {
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.bold,
    color: colors.primary,
  },
  userName: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    color: '#fff',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: fontSize.sm,
    color: '#fff',
    opacity: 0.9,
  },
  card: {
    backgroundColor: colors.surface,
    marginHorizontal: spacing.md,
    marginVertical: spacing.sm,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    ...shadows.sm,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  cardTitle: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
    color: colors.text,
  },
  editButton: {
    fontSize: fontSize.sm,
    color: colors.primary,
    fontWeight: fontWeight.semibold,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  label: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
  },
  value: {
    fontSize: fontSize.sm,
    color: colors.text,
    fontWeight: fontWeight.semibold,
  },
  roleBadge: {
    color: colors.primary,
    fontWeight: fontWeight.bold,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  button: {
    flex: 1,
  },
  logoutButton: {
    marginHorizontal: spacing.md,
    marginVertical: spacing.lg,
  },
  guestText: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginTop: spacing.sm,
    marginBottom: spacing.md,
  },
  guestCard: {
    backgroundColor: '#FFF3E0',
    marginHorizontal: spacing.md,
    marginVertical: spacing.sm,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    borderWidth: 1.5,
    borderColor: colors.primary,
  },
  guestCardTitle: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
    color: colors.primary,
    marginBottom: spacing.xs,
  },
  upgradeButton: {
    marginTop: spacing.xs,
  },
  addressItem: {
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  addressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  addressLabel: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.bold,
    color: colors.primary,
  },
  addressText: {
    fontSize: fontSize.xs,
    color: colors.text,
    marginBottom: 2,
  },
  customerName: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    fontStyle: 'italic',
  },
});
