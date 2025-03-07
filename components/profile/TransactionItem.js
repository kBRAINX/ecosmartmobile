import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Badge from '../ui/Badge';

export default function TransactionItem({ transaction, style }) {
  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get icon and color based on transaction type
  const getTypeIcon = () => {
    if (transaction.type === 'earning') {
      return {
        name: 'add-circle',
        color: '#16a34a',
        backgroundColor: '#dcfce7'
      };
    } else {
      return {
        name: 'remove-circle',
        color: '#f97316',
        backgroundColor: '#ffedd5'
      };
    }
  };

  const { name, color, backgroundColor } = getTypeIcon();

  // Get method name
  const getMethodName = () => {
    if (transaction.method === 'wm1') {
      return 'MTN Mobile Money';
    } else if (transaction.method === 'wm2') {
      return 'Orange Money';
    } else if (transaction.method === 'wm3') {
      return 'Bank Card';
    }
    return '';
  };

  return (
    <View style={[styles.container, style]}>
      <View style={[styles.iconContainer, { backgroundColor }]}>
        <Ionicons name={name} size={24} color={color} />
      </View>

      <View style={styles.details}>
        <Text style={styles.title}>
          {transaction.type === 'earning'
            ? `Earned: ${transaction.details || 'Activity'}`
            : `Withdrawal: ${getMethodName()}`
          }
        </Text>

        <Text style={styles.date}>{formatDate(transaction.timestamp)}</Text>

        {transaction.reference && (
          <Text style={styles.reference}>Ref: {transaction.reference}</Text>
        )}
      </View>

      <View style={styles.values}>
        <Text style={[
          styles.points,
          transaction.type === 'earning' ? styles.earning : styles.withdrawal
        ]}>
          {transaction.type === 'earning' ? '+' : '-'}{transaction.points} points
        </Text>

        {transaction.amount > 0 && (
          <Text style={styles.amount}>
            {transaction.amount.toLocaleString()} XAF
          </Text>
        )}

        <Badge
          label={
            transaction.status === 'completed'
              ? 'Completed'
              : transaction.status === 'pending'
                ? 'Pending'
                : 'Failed'
          }
          variant={transaction.status === 'completed' ? 'outlined' : 'default'}
          color={
            transaction.status === 'completed'
              ? '#64748b'
              : transaction.status === 'pending'
                ? '#f59e0b'
                : '#ef4444'
          }
          size="small"
          style={styles.badge}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
    elevation: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  details: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontWeight: '500',
    marginBottom: 2,
  },
  date: {
    fontSize: 12,
    color: '#666',
  },
  reference: {
    fontSize: 10,
    color: '#94a3b8',
    marginTop: 2,
  },
  values: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  points: {
    fontWeight: '500',
    marginBottom: 2,
  },
  earning: {
    color: '#16a34a',
  },
  withdrawal: {
    color: '#f97316',
  },
  amount: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  badge: {
    marginTop: 2,
  },
});
