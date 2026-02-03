import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  RefreshControl,
} from 'react-native';
import { orderService } from '../services/orderService';
import { driverService } from '../services/driverService';
import { colors, spacing, fontSize, fontWeight, borderRadius } from '../config/theme';

export default function DriverOrderDetailsScreen({ route, navigation }) {
  const { orderId } = route.params;
  const [order, setOrder] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadOrder();
  }, [orderId]);

  const loadOrder = async () => {
    try {
      const data = await orderService.getOrder(orderId);
      setOrder(data);
    } catch (error) {
      console.error('Error loading order:', error);
      Alert.alert('Error', 'Failed to load order details');
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadOrder();
    setRefreshing(false);
  };

  const handleAcceptOrder = async () => {
    Alert.alert(
      'Accept Order',
      'Are you sure you want to accept this order?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Accept',
          onPress: async () => {
            try {
              await driverService.acceptOrder(orderId);
              Alert.alert('Success', 'Order accepted successfully!');
              loadOrder();
            } catch (error) {
              Alert.alert('Error', error.response?.data?.message || 'Failed to accept order');
            }
          },
        },
      ]
    );
  };

  const handleUpdateStatus = (newStatus) => {
    const statusMessages = {
      picked_up: 'Mark as Picked Up?',
      in_transit: 'Mark as In Transit?',
      delivered_to_warehouse: 'Deliver to Warehouse?',
      delivered: 'Mark as Delivered?',
    };

    Alert.alert(
      'Update Status',
      statusMessages[newStatus],
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm',
          onPress: async () => {
            try {
              await driverService.updateOrderStatus(orderId, newStatus);
              Alert.alert('Success', 'Order status updated successfully!');
              loadOrder();
            } catch (error) {
              Alert.alert('Error', error.response?.data?.message || 'Failed to update status');
            }
          },
        },
      ]
    );
  };

  const getStatusColor = (status) => {
    const statusColors = {
      pending: colors.warning,
      accepted: colors.success,
      picked_up: colors.info,
      in_transit: colors.secondary,
      delivered: colors.success,
      cancelled: colors.danger,
    };
    return statusColors[status] || colors.textSecondary;
  };

  if (!order) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.header}>
        <Text style={styles.orderId}>Order #{order.id}</Text>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(order.status) }]}>
          <Text style={styles.statusText}>{order.status}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Customer Information</Text>
        <View style={styles.infoCard}>
          <InfoRow label="Name" value={order.customer?.name} />
          <InfoRow label="Phone" value={order.customer?.phone} />
          <InfoRow label="Email" value={order.customer?.email} />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Pickup Location</Text>
        <View style={styles.infoCard}>
          <Text style={styles.address}>📍 {order.pickup_address}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Delivery Location</Text>
        <View style={styles.infoCard}>
          <Text style={styles.address}>📍 {order.delivery_address}</Text>
          <InfoRow label="Recipient" value={order.recipient_name} />
          <InfoRow label="Phone" value={order.recipient_phone} />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Package Details</Text>
        <View style={styles.infoCard}>
          <InfoRow label="Description" value={order.package_description || 'N/A'} />
          <InfoRow label="Delivery Fee" value={`$${order.delivery_fee}`} />
          {order.notes && <InfoRow label="Notes" value={order.notes} />}
        </View>
      </View>

      {order.status === 'pending' && (
        <TouchableOpacity style={styles.acceptButton} onPress={handleAcceptOrder}>
          <Text style={styles.buttonText}>✓ Accept Order</Text>
        </TouchableOpacity>
      )}

      {order.status === 'accepted' && (
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleUpdateStatus('picked_up')}
        >
          <Text style={styles.buttonText}>📦 Mark as Picked Up</Text>
        </TouchableOpacity>
      )}

      {order.status === 'picked_up' && (
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleUpdateStatus('in_transit')}
        >
          <Text style={styles.buttonText}>🚚 Mark as In Transit</Text>
        </TouchableOpacity>
      )}

      {order.status === 'in_transit' && (
        <TouchableOpacity
          style={styles.warehouseButton}
          onPress={() => handleUpdateStatus('delivered_to_warehouse')}
        >
          <Text style={styles.buttonText}>🏬 Deliver to Warehouse</Text>
        </TouchableOpacity>
      )}

      {order.status === 'picked_up_from_warehouse' && (
        <TouchableOpacity
          style={styles.deliveredButton}
          onPress={() => handleUpdateStatus('delivered')}
        >
          <Text style={styles.buttonText}>✓ Mark as Delivered</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}

const InfoRow = ({ label, value }) => (
  <View style={styles.infoRow}>
    <Text style={styles.infoLabel}>{label}:</Text>
    <Text style={styles.infoValue}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingText: {
    textAlign: 'center',
    marginTop: spacing.xxl,
    fontSize: fontSize.lg,
    color: colors.textSecondary,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.lg,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  orderId: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    color: colors.text,
  },
  statusBadge: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 12,
  },
  statusText: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
    color: '#fff',
    textTransform: 'capitalize',
  },
  section: {
    padding: spacing.lg,
  },
  sectionTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.text,
    marginBottom: spacing.md,
  },
  infoCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: spacing.sm,
  },
  infoLabel: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    width: 100,
  },
  infoValue: {
    flex: 1,
    fontSize: fontSize.md,
    color: colors.text,
    fontWeight: fontWeight.medium,
  },
  address: {
    fontSize: fontSize.md,
    color: colors.text,
    marginBottom: spacing.md,
    lineHeight: 22,
  },
  acceptButton: {
    backgroundColor: colors.success,
    margin: spacing.lg,
    padding: spacing.lg,
    borderRadius: 12,
    alignItems: 'center',
  },
  actionButton: {
    backgroundColor: colors.primary,
    margin: spacing.lg,
    padding: spacing.lg,
    borderRadius: 12,
    alignItems: 'center',
  },
  warehouseButton: {
    backgroundColor: colors.warning,
    margin: spacing.lg,
    padding: spacing.lg,
    borderRadius: 12,
    alignItems: 'center',
  },
  deliveredButton: {
    backgroundColor: colors.success,
    margin: spacing.lg,
    padding: spacing.lg,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
  },
});
