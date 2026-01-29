import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { orderService } from '../services/orderService';
import OrderCard from '../components/OrderCard';
import { checkForOrderUpdates } from '../services/notificationService';
import { colors, spacing, fontSize, fontWeight } from '../config/theme';

export default function OrdersScreen({ navigation }) {
  const { isGuest, signOut } = useAuth();
  const [orders, setOrders] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    if (isGuest) {
      setOrders([]);
      return;
    }

    try {
      const data = await orderService.getOrders();
      await checkForOrderUpdates(data);
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
      return orders.filter(o => ['accepted', 'picked_up', 'in_transit'].includes(o.status));
    }
    if (filter === 'completed') {
      return orders.filter(o => o.status === 'delivered');
    }
    return orders.filter(o => o.status === filter);
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

  return (
    <View style={styles.container}>
      {isGuest ? (
        <View style={styles.guestContainer}>
          <Text style={styles.guestTitle}>Login Required</Text>
          <Text style={styles.guestText}>
            Please login to view your orders history.
          </Text>
          <TouchableOpacity
            style={styles.guestButton}
            onPress={() => {
              Alert.alert('Login Required', 'Go to login screen?', [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Go to Login', onPress: signOut },
              ]);
            }}
          >
            <Text style={styles.guestButtonText}>Go to Login</Text>
          </TouchableOpacity>
        </View>
      ) : (
      <View style={styles.filterContainer}>
        <FilterButton label="All" value="all" />
        <FilterButton label="Pending" value="pending" />
        <FilterButton label="Active" value="active" />
        <FilterButton label="Completed" value="completed" />
      </View>
      )}

      <FlatList
        data={isGuest ? [] : getFilteredOrders()}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <OrderCard
            order={item}
            onPress={() => navigation.navigate('OrderDetails', { orderId: item.id })}
          />
        )}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>📭</Text>
            <Text style={styles.emptyText}>
              {isGuest ? 'Login to view orders' : 'No orders found'}
            </Text>
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
  guestContainer: {
    padding: spacing.xl,
    margin: spacing.lg,
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  guestTitle: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  guestText: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    marginBottom: spacing.lg,
  },
  guestButton: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    borderRadius: 12,
    alignItems: 'center',
  },
  guestButtonText: {
    color: '#fff',
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
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
