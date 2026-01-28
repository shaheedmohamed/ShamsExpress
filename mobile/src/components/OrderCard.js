import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, borderRadius, fontSize, spacing, shadows, fontWeight } from '../config/theme';

export default function OrderCard({ order, onPress }) {
  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return colors.statusPending;
      case 'accepted':
        return colors.statusAccepted;
      case 'picked_up':
        return colors.statusPickedUp;
      case 'in_transit':
        return colors.statusInTransit;
      case 'delivered':
        return colors.statusDelivered;
      case 'cancelled':
        return colors.statusCancelled;
      default:
        return colors.textSecondary;
    }
  };

  const formatStatus = (status) => {
    return status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.header}>
        <Text style={styles.orderId}>Order #{order.id}</Text>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(order.status) }]}>
          <Text style={styles.statusText}>{formatStatus(order.status)}</Text>
        </View>
      </View>

      <View style={styles.addressContainer}>
        <View style={styles.addressRow}>
          <View style={[styles.dot, { backgroundColor: colors.success }]} />
          <Text style={styles.addressLabel}>Pickup:</Text>
        </View>
        <Text style={styles.addressText} numberOfLines={1}>
          {order.pickup_address}
        </Text>
      </View>

      <View style={styles.addressContainer}>
        <View style={styles.addressRow}>
          <View style={[styles.dot, { backgroundColor: colors.danger }]} />
          <Text style={styles.addressLabel}>Delivery:</Text>
        </View>
        <Text style={styles.addressText} numberOfLines={1}>
          {order.delivery_address}
        </Text>
      </View>

      <View style={styles.footer}>
        <Text style={styles.recipient}>To: {order.recipient_name}</Text>
        <Text style={styles.fee}>${parseFloat(order.delivery_fee).toFixed(2)}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    ...shadows.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  orderId: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.text,
  },
  statusBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
  },
  statusText: {
    color: '#fff',
    fontSize: fontSize.xs,
    fontWeight: fontWeight.semibold,
  },
  addressContainer: {
    marginBottom: spacing.sm,
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: spacing.xs,
  },
  addressLabel: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
    color: colors.text,
  },
  addressText: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginLeft: spacing.md,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.sm,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  recipient: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
  fee: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.primary,
  },
});
