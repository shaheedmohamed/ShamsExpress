import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { orderService } from '../services/orderService';
import Button from '../components/Button';
import { colors, spacing, fontSize, fontWeight, borderRadius, shadows } from '../config/theme';

export default function OrderDetailsScreen({ route, navigation }) {
  const { orderId } = route.params;
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);

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
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    Alert.alert(
      'Cancel Order',
      'Are you sure you want to cancel this order?',
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Yes',
          style: 'destructive',
          onPress: async () => {
            setCancelling(true);
            try {
              await orderService.cancelOrder(orderId);
              Alert.alert('Success', 'Order cancelled successfully', [
                { text: 'OK', onPress: () => navigation.goBack() },
              ]);
            } catch (error) {
              Alert.alert('Error', 'Failed to cancel order');
            } finally {
              setCancelling(false);
            }
          },
        },
      ]
    );
  };

  const getStatusColor = (status) => {
    const colors_map = {
      pending: colors.statusPending,
      accepted: colors.statusAccepted,
      picked_up: colors.statusPickedUp,
      in_transit: colors.statusInTransit,
      delivered: colors.statusDelivered,
      cancelled: colors.statusCancelled,
    };
    return colors_map[status] || colors.textSecondary;
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!order) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Order not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.orderId}>Order #{order.id}</Text>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(order.status) }]}>
          <Text style={styles.statusText}>
            {order.status.replace(/_/g, ' ').toUpperCase()}
          </Text>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>📍 Pickup Information</Text>
        <Text style={styles.address}>{order.pickup_address}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>🎯 Delivery Information</Text>
        <Text style={styles.address}>{order.delivery_address}</Text>
        <View style={styles.divider} />
        <View style={styles.infoRow}>
          <Text style={styles.label}>Recipient:</Text>
          <Text style={styles.value}>{order.recipient_name}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Phone:</Text>
          <Text style={styles.value}>{order.recipient_phone}</Text>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>📦 Package Details</Text>
        {order.package_description && (
          <View style={styles.infoRow}>
            <Text style={styles.label}>Description:</Text>
            <Text style={styles.value}>{order.package_description}</Text>
          </View>
        )}
        <View style={styles.infoRow}>
          <Text style={styles.label}>Delivery Fee:</Text>
          <Text style={[styles.value, styles.fee]}>${parseFloat(order.delivery_fee).toFixed(2)}</Text>
        </View>
        {order.notes && (
          <View style={styles.infoRow}>
            <Text style={styles.label}>Notes:</Text>
            <Text style={styles.value}>{order.notes}</Text>
          </View>
        )}
      </View>

      {order.driver && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>🚚 Driver Information</Text>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Name:</Text>
            <Text style={styles.value}>{order.driver.name}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Phone:</Text>
            <Text style={styles.value}>{order.driver.phone}</Text>
          </View>
        </View>
      )}

      {order.status_histories && order.status_histories.length > 0 && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>📋 Status History</Text>
          {order.status_histories.map((history, index) => (
            <View key={index} style={styles.historyItem}>
              <View style={styles.historyDot} />
              <View style={styles.historyContent}>
                <Text style={styles.historyStatus}>
                  {history.status.replace(/_/g, ' ').toUpperCase()}
                </Text>
                <Text style={styles.historyNotes}>{history.notes}</Text>
                <Text style={styles.historyTime}>
                  {new Date(history.created_at).toLocaleString()}
                </Text>
              </View>
            </View>
          ))}
        </View>
      )}

      {order.status === 'pending' && (
        <Button
          title="Cancel Order"
          onPress={handleCancel}
          loading={cancelling}
          variant="outline"
          style={styles.cancelButton}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: fontSize.lg,
    color: colors.textSecondary,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.lg,
    backgroundColor: colors.surface,
  },
  orderId: {
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.bold,
    color: colors.text,
  },
  statusBadge: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
  },
  statusText: {
    color: '#fff',
    fontSize: fontSize.xs,
    fontWeight: fontWeight.semibold,
  },
  card: {
    backgroundColor: colors.surface,
    margin: spacing.lg,
    marginTop: spacing.md,
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    ...shadows.sm,
  },
  cardTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
    color: colors.text,
    marginBottom: spacing.md,
  },
  address: {
    fontSize: fontSize.md,
    color: colors.text,
    lineHeight: 22,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.md,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  label: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    flex: 1,
  },
  value: {
    fontSize: fontSize.sm,
    color: colors.text,
    fontWeight: fontWeight.medium,
    flex: 2,
    textAlign: 'right',
  },
  fee: {
    fontSize: fontSize.lg,
    color: colors.primary,
    fontWeight: fontWeight.bold,
  },
  historyItem: {
    flexDirection: 'row',
    marginBottom: spacing.md,
  },
  historyDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.primary,
    marginTop: 4,
    marginRight: spacing.sm,
  },
  historyContent: {
    flex: 1,
  },
  historyStatus: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
    color: colors.text,
  },
  historyNotes: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    marginTop: 2,
  },
  historyTime: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    marginTop: 2,
  },
  cancelButton: {
    margin: spacing.lg,
    marginBottom: spacing.xxl,
  },
});
