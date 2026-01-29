import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

const ORDER_STATUS_KEY = 'order_statuses';
const LAST_CHECK_KEY = 'last_notification_check';

export async function registerForPushNotificationsAsync() {
  console.log('Notification system initialized');
  return true;
}

export async function checkForOrderUpdates(orders) {
  try {
    const storedStatuses = await AsyncStorage.getItem(ORDER_STATUS_KEY);
    const previousStatuses = storedStatuses ? JSON.parse(storedStatuses) : {};
    
    const currentStatuses = {};
    const updates = [];
    
    orders.forEach(order => {
      currentStatuses[order.id] = order.status;
      
      if (previousStatuses[order.id] && previousStatuses[order.id] !== order.status) {
        updates.push({
          orderId: order.id,
          oldStatus: previousStatuses[order.id],
          newStatus: order.status,
        });
      }
    });
    
    await AsyncStorage.setItem(ORDER_STATUS_KEY, JSON.stringify(currentStatuses));
    
    if (updates.length > 0) {
      updates.forEach(update => {
        showOrderUpdateNotification(update);
      });
    }
    
    await AsyncStorage.setItem(LAST_CHECK_KEY, new Date().toISOString());
  } catch (error) {
    console.error('Error checking order updates:', error);
  }
}

function showOrderUpdateNotification(update) {
  const statusMessages = {
    pending: '⏳ Pending',
    accepted: '✅ Accepted by driver',
    picked_up: '📦 Picked up',
    in_transit: '🚚 In transit',
    delivered_to_warehouse: '🏬 Delivered to warehouse',
    warehouse_to_delivery: '📋 Ready for final delivery',
    picked_up_from_warehouse: '📤 Picked up from warehouse',
    delivered: '🎉 Delivered',
    cancelled: '❌ Cancelled',
  };
  
  const statusEmoji = {
    pending: '⏳',
    accepted: '✅',
    picked_up: '📦',
    in_transit: '🚚',
    delivered_to_warehouse: '🏬',
    warehouse_to_delivery: '📋',
    picked_up_from_warehouse: '📤',
    delivered: '🎉',
    cancelled: '❌',
  };
  
  const title = `${statusEmoji[update.newStatus] || '📦'} Order #${update.orderId} Updated!`;
  const message = `Status changed to: ${statusMessages[update.newStatus] || update.newStatus}`;
  
  Alert.alert(
    title,
    message,
    [
      { 
        text: 'OK', 
        style: 'default'
      }
    ],
    { cancelable: false }
  );
  
  console.log(`🔔 Notification: ${title} - ${message}`);
}

export async function clearOrderStatuses() {
  try {
    await AsyncStorage.removeItem(ORDER_STATUS_KEY);
    await AsyncStorage.removeItem(LAST_CHECK_KEY);
  } catch (error) {
    console.error('Error clearing order statuses:', error);
  }
}
