import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { driverService } from '../services/driverService';
import { checkForOrderUpdates } from '../services/notificationService';
import StatCard from '../components/StatCard';
import OrderCard from '../components/OrderCard';
import { colors, spacing, fontSize, fontWeight } from '../config/theme';

export default function DriverDashboardScreen({ navigation }) {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadDashboard();
    
    const interval = setInterval(() => {
      loadDashboard(true);
    }, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const loadDashboard = async (silent = false) => {
    try {
      const data = await driverService.getDashboard();
      setDashboardData(data);
      
      if (data.active_orders) {
        await checkForOrderUpdates(data.active_orders);
      }
    } catch (error) {
      if (!silent) {
        console.error('Error loading dashboard:', error);
      }
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadDashboard();
    setRefreshing(false);
  };

  if (!dashboardData) {
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
        <Text style={styles.greeting}>Hello, {user?.name}! 👋</Text>
        <Text style={styles.role}>Driver Dashboard</Text>
      </View>

      <View style={styles.statsContainer}>
        <StatCard
          title="Active Deliveries"
          value={dashboardData.stats.active_deliveries}
          icon="🚚"
          color={colors.primary}
        />
        <StatCard
          title="Pending Orders"
          value={dashboardData.stats.pending_orders}
          icon="⏳"
          color={colors.warning}
        />
        <StatCard
          title="Completed"
          value={dashboardData.stats.completed_deliveries}
          icon="✓"
          color={colors.success}
        />
        <StatCard
          title="Total Deliveries"
          value={dashboardData.stats.total_deliveries}
          icon="📦"
          color={colors.info}
        />
      </View>

      <View style={styles.quickActions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate('DriverAvailableOrders')}
        >
          <Text style={styles.actionIcon}>📋</Text>
          <Text style={styles.actionText}>Available Orders</Text>
          {dashboardData.stats.pending_orders > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{dashboardData.stats.pending_orders}</Text>
            </View>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate('DriverMyOrders')}
        >
          <Text style={styles.actionIcon}>📦</Text>
          <Text style={styles.actionText}>My Orders</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Active Orders</Text>
        {dashboardData.active_orders.length > 0 ? (
          dashboardData.active_orders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              onPress={() => navigation.navigate('DriverOrderDetails', { orderId: order.id })}
            />
          ))
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>📭</Text>
            <Text style={styles.emptyText}>No active orders</Text>
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
  loadingText: {
    textAlign: 'center',
    marginTop: spacing.xxl,
    fontSize: fontSize.lg,
    color: colors.textSecondary,
  },
  header: {
    padding: spacing.lg,
    backgroundColor: colors.primary,
  },
  greeting: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    color: '#fff',
    marginBottom: spacing.xs,
  },
  role: {
    fontSize: fontSize.md,
    color: '#fff',
    opacity: 0.9,
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: spacing.md,
    gap: spacing.md,
  },
  quickActions: {
    flexDirection: 'row',
    padding: spacing.lg,
    gap: spacing.md,
  },
  actionButton: {
    flex: 1,
    backgroundColor: colors.surface,
    padding: spacing.lg,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    position: 'relative',
  },
  actionIcon: {
    fontSize: 32,
    marginBottom: spacing.sm,
  },
  actionText: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    color: colors.text,
  },
  badge: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    backgroundColor: colors.danger,
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xs,
  },
  badgeText: {
    color: '#fff',
    fontSize: fontSize.xs,
    fontWeight: fontWeight.bold,
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
  emptyState: {
    alignItems: 'center',
    padding: spacing.xxl,
    backgroundColor: colors.surface,
    borderRadius: 12,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: spacing.md,
  },
  emptyText: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
  },
});
