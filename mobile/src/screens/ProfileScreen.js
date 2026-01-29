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

export default function ProfileScreen() {
  const { user, signOut, updateProfile, isGuest } = useAuth();
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
  });

  const handleUpdate = async () => {
    if (isGuest) {
      Alert.alert(
        'Login Required',
        'Please login to edit your profile.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Go to Login', onPress: signOut },
        ]
      );
      return;
    }

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
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Guest Mode</Text>
          <Text style={styles.guestText}>
            Login to manage your profile, create orders, and view your history.
          </Text>
          <Button title="Go to Login" onPress={signOut} />
        </View>
      )}

      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Personal Information</Text>
          {!isGuest && !editing && (
            <TouchableOpacity onPress={() => setEditing(true)}>
              <Text style={styles.editButton}>Edit</Text>
            </TouchableOpacity>
          )}
        </View>

        {!isGuest && editing ? (
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
              <Text style={styles.value}>{isGuest ? '-' : user?.email}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Phone</Text>
              <Text style={styles.value}>{isGuest ? '-' : user?.phone || 'Not set'}</Text>
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

      <Button
        title="Logout"
        onPress={handleLogout}
        variant="outline"
        style={styles.logoutButton}
      />
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
    padding: spacing.xxl,
    alignItems: 'center',
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  avatarText: {
    fontSize: fontSize.xxxl,
    fontWeight: fontWeight.bold,
    color: colors.primary,
  },
  userName: {
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.bold,
    color: '#fff',
    marginBottom: spacing.xs,
  },
  userEmail: {
    fontSize: fontSize.md,
    color: '#fff',
    opacity: 0.9,
  },
  card: {
    backgroundColor: colors.surface,
    margin: spacing.lg,
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    ...shadows.sm,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  cardTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
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
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  label: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
  value: {
    fontSize: fontSize.sm,
    color: colors.text,
    fontWeight: fontWeight.medium,
  },
  roleBadge: {
    color: colors.primary,
    fontWeight: fontWeight.bold,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.md,
  },
  button: {
    flex: 1,
  },
  logoutButton: {
    margin: spacing.lg,
    marginBottom: spacing.xxl,
  },
  guestText: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginTop: spacing.sm,
    marginBottom: spacing.md,
  },
});
