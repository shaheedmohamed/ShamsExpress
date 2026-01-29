import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { orderService } from '../services/orderService';
import StatCard from '../components/StatCard';
import OrderCard from '../components/OrderCard';
import { colors, spacing, fontSize, fontWeight } from '../config/theme';

export default function HomeScreen({ navigation }) {
  const { user, isGuest, signOut } = useAuth();
  const [statistics, setStatistics] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    if (isGuest) {
      setStatistics(null);
      setRecentOrders([]);
      return;
    }

    try {
      const [stats, orders] = await Promise.all([
        orderService.getStatistics(),
        orderService.getOrders(),
      ]);
      setStatistics(stats);
      setRecentOrders(orders.slice(0, 5));
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Hello,</Text>
          <Text style={styles.userName}>{user?.name}</Text>
        </View>
        <TouchableOpacity
          style={styles.profileButton}
          onPress={() => navigation.navigate('Profile')}
        >
          <Text style={styles.profileIcon}>👤</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.createOrderButton}
        onPress={() => {
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
          navigation.navigate('CreateOrder');
        }}
        activeOpacity={0.8}
      >
        <Text style={styles.createOrderIcon}>📦</Text>
        <Text style={styles.createOrderText}>
          {isGuest ? 'Login to Create Order' : 'Create New Delivery Order'}
        </Text>
      </TouchableOpacity>

      {isGuest && (
        <View style={styles.guestNotice}>
          <Text style={styles.guestNoticeTitle}>Guest Mode</Text>
          <Text style={styles.guestNoticeText}>
            You can browse the app, but creating orders and viewing history requires login.
          </Text>
        </View>
      )}

      {statistics && (
        <View style={styles.statsContainer}>
          <StatCard
            icon="📦"
            label="Total Orders"
            value={statistics.total_orders || 0}
            color={colors.info}
          />
          <StatCard
            icon="⏳"
            label="Pending"
            value={statistics.pending_orders || 0}
            color={colors.warning}
          />
          <StatCard
            icon="🚚"
            label="Active"
            value={statistics.active_orders || 0}
            color={colors.primary}
          />
          <StatCard
            icon="✅"
            label="Completed"
            value={statistics.completed_orders || 0}
            color={colors.success}
          />
        </View>
      )}

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Orders</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Orders')}>
            <Text style={styles.seeAll}>See All</Text>
          </TouchableOpacity>
        </View>

        {recentOrders.length > 0 ? (
          recentOrders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              onPress={() => navigation.navigate('OrderDetails', { orderId: order.id })}
            />
          ))
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>📭</Text>
            <Text style={styles.emptyText}>No orders yet</Text>
            <Text style={styles.emptySubtext}>Create your first delivery order</Text>
          </View>
        )}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.lg,
    backgroundColor: colors.surface,
  },
  greeting: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
  },
  userName: {
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.bold,
    color: colors.text,
  },
  profileButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary + '20',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileIcon: {
    fontSize: fontSize.xxl,
  },
  createOrderButton: {
    backgroundColor: colors.primary,
    margin: spacing.lg,
    padding: spacing.lg,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  createOrderIcon: {
    fontSize: fontSize.xxl,
    marginRight: spacing.sm,
  },
  createOrderText: {
    color: '#fff',
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
  },
  guestNotice: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.lg,
    padding: spacing.lg,
    borderRadius: 16,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  guestNoticeTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  guestNoticeText: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: spacing.md,
    marginBottom: spacing.lg,
  },
  section: {
    padding: spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    color: colors.text,
  },
  seeAll: {
    fontSize: fontSize.sm,
    color: colors.primary,
    fontWeight: fontWeight.semibold,
  },
  emptyState: {
    alignItems: 'center',
    padding: spacing.xxl,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: spacing.md,
  },
  emptyText: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  emptySubtext: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
});
