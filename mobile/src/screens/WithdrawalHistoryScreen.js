import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  ActivityIndicator,
  Image,
} from 'react-native';
import api from '../config/api';
import { colors, spacing, fontSize, fontWeight, borderRadius, shadows } from '../config/theme';

export default function WithdrawalHistoryScreen() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    try {
      const response = await api.get('/wallet/withdrawals');
      setRequests(response.data);
    } catch (error) {
      console.error('Error loading withdrawal requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadRequests();
    setRefreshing(false);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return '#FFA000';
      case 'approved':
        return '#10b981';
      case 'rejected':
        return '#ef4444';
      default:
        return colors.textSecondary;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending':
        return 'قيد المراجعة';
      case 'approved':
        return 'تم الموافقة';
      case 'rejected':
        return 'مرفوض';
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={requests}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.requestCard}>
            <View style={styles.requestHeader}>
              <View>
                <Text style={styles.requestAmount}>{item.amount} AED</Text>
                <Text style={styles.requestDate}>
                  {new Date(item.created_at).toLocaleDateString('ar-EG')}
                </Text>
              </View>
              <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
                <Text style={styles.statusText}>{getStatusText(item.status)}</Text>
              </View>
            </View>

            <View style={styles.requestDetails}>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>البنك:</Text>
                <Text style={styles.detailValue}>{item.bank_name}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>رقم الحساب:</Text>
                <Text style={styles.detailValue}>{item.account_number}</Text>
              </View>
            </View>

            {item.admin_notes && (
              <View style={styles.notesBox}>
                <Text style={styles.notesLabel}>ملاحظات الإدارة:</Text>
                <Text style={styles.notesText}>{item.admin_notes}</Text>
              </View>
            )}

            {item.transfer_proof && item.status === 'approved' && (
              <View style={styles.proofBox}>
                <Text style={styles.proofLabel}>✅ إثبات التحويل:</Text>
                <Image
                  source={{ uri: `${api.defaults.baseURL.replace('/api', '')}/storage/${item.transfer_proof}` }}
                  style={styles.proofImage}
                  resizeMode="contain"
                />
              </View>
            )}
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>لا توجد طلبات سحب</Text>
          </View>
        }
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={styles.listContent}
      />
    </View>
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
    backgroundColor: colors.background,
  },
  listContent: {
    padding: spacing.lg,
  },
  requestCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    ...shadows.md,
  },
  requestHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  requestAmount: {
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.bold,
    color: colors.text,
  },
  requestDate: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  statusBadge: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.md,
  },
  statusText: {
    color: '#fff',
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
  },
  requestDetails: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: spacing.md,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  detailLabel: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
  detailValue: {
    fontSize: fontSize.sm,
    color: colors.text,
    fontWeight: fontWeight.semibold,
  },
  notesBox: {
    backgroundColor: '#FFF3E0',
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginTop: spacing.md,
  },
  notesLabel: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.bold,
    color: '#F57C00',
    marginBottom: spacing.xs,
  },
  notesText: {
    fontSize: fontSize.sm,
    color: '#E65100',
  },
  proofBox: {
    marginTop: spacing.md,
    padding: spacing.md,
    backgroundColor: '#E8F5E9',
    borderRadius: borderRadius.md,
  },
  proofLabel: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.bold,
    color: '#2E7D32',
    marginBottom: spacing.sm,
  },
  proofImage: {
    width: '100%',
    height: 200,
    borderRadius: borderRadius.md,
  },
  emptyContainer: {
    padding: spacing.xxl,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
  },
});
