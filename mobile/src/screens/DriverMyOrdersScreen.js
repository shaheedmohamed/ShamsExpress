import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { driverService } from '../services/driverService';
import { colors, spacing, fontSize, fontWeight } from '../config/theme';

export default function DriverMyOrdersScreen({ navigation }) {
  const [orders, setOrders] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const data = await driverService.getMyOrders();
      setOrders(data);
    } catch (error) {
      console.error('Error loading orders:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadOrders();
    setRefreshing(false);
  };

  const getFilteredOrders = () => {
    if (filter === 'all') return orders;
    if (filter === 'active') {
      return orders.filter(o => ['pending', 'accepted', 'picked_up', 'in_transit'].includes(o.status));
    }
    if (filter === 'completed') {
      return orders.filter(o => o.status === 'delivered');
    }
    return orders;
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

  const FilterButton = ({ label, value }) => (
    <TouchableOpacity
      style={[styles.filterButton, filter === value && styles.filterButtonActive]}
      onPress={() => setFilter(value)}
    >
      <Text style={[styles.filterText, filter === value && styles.filterTextActive]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  const renderOrderCard = ({ item: order }) => (
    <TouchableOpacity
      style={styles.orderCard}
      onPress={() => navigation.navigate('DriverOrderDetails', { orderId: order.id })}
    >
      <View style={styles.orderHeader}>
        <Text style={styles.orderId}>Order #{order.id}</Text>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(order.status) }]}>
          <Text style={styles.statusText}>{order.status}</Text>
        </View>
      </View>

      <View style={styles.orderDetails}>
        <Text style={styles.customerName}>{order.customer?.name}</Text>
        <Text style={styles.address} numberOfLines={1}>
          📍 {order.delivery_address}
        </Text>
        <Text style={styles.fee}>${order.delivery_fee}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.filterContainer}>
        <FilterButton label="All" value="all" />
        <FilterButton label="Active" value="active" />
        <FilterButton label="Completed" value="completed" />
      </View>

      <FlatList
        data={getFilteredOrders()}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderOrderCard}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>📭</Text>
            <Text style={styles.emptyText}>No orders found</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  filterContainer: {
    flexDirection: 'row',
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  filterButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 20,
    marginRight: spacing.sm,
    backgroundColor: colors.background,
  },
  filterButtonActive: {
    backgroundColor: colors.primary,
  },
  filterText: {
    fontSize: fontSize.sm,
    color: colors.text,
    fontWeight: fontWeight.medium,
  },
  filterTextActive: {
    color: '#fff',
  },
  listContent: {
    padding: spacing.lg,
  },
  orderCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  orderHeader: {
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
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: 12,
  },
  statusText: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.semibold,
    color: '#fff',
    textTransform: 'capitalize',
  },
  orderDetails: {
    gap: spacing.xs,
  },
  customerName: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    color: colors.text,
  },
  address: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
  fee: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.secondary,
    marginTop: spacing.xs,
  },
  emptyState: {
    alignItems: 'center',
    padding: spacing.xxl,
    marginTop: spacing.xxl,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: spacing.md,
  },
  emptyText: {
    fontSize: fontSize.lg,
    color: colors.textSecondary,
  },
});
