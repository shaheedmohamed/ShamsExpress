import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  TouchableOpacity,
  Modal,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useAuth } from '../context/AuthContext';
import { orderService } from '../services/orderService';
import api from '../config/api';
import Input from '../components/Input';
import Button from '../components/Button';
import { colors, spacing, fontSize, fontWeight, borderRadius } from '../config/theme';

export default function CreateOrderScreen({ navigation }) {
  const { user, isGuest, signOut, updateProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [shipmentTypes, setShipmentTypes] = useState([]);
  const [deliveryZones, setDeliveryZones] = useState([]);
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [calculatedPrice, setCalculatedPrice] = useState(0);
  
  const [formData, setFormData] = useState({
    shipment_type_id: '',
    delivery_zone_id: '',
    pickup_address: '',
    delivery_address: '',
    recipient_name: '',
    recipient_phone: '',
    sender_phone: user?.phone || '',
    product_value: '',
    delivery_fee: '',
  });

  useEffect(() => {
    loadPricingData();
    loadSavedAddresses();
  }, []);

  useEffect(() => {
    if (formData.shipment_type_id && formData.delivery_zone_id) {
      calculateDeliveryPrice();
    }
  }, [formData.shipment_type_id, formData.delivery_zone_id]);

  const loadPricingData = async () => {
    try {
      const [typesRes, zonesRes] = await Promise.all([
        api.get('/pricing/shipment-types'),
        api.get('/pricing/delivery-zones'),
      ]);
      setShipmentTypes(typesRes.data);
      setDeliveryZones(zonesRes.data);
    } catch (error) {
      console.error('Failed to load pricing data:', error);
    }
  };

  const loadSavedAddresses = () => {
    if (user?.saved_addresses) {
      setSavedAddresses(user.saved_addresses);
    }
  };

  const calculateDeliveryPrice = async () => {
    try {
      const response = await api.post('/pricing/calculate', {
        shipment_type_id: formData.shipment_type_id,
        delivery_zone_id: formData.delivery_zone_id,
      });
      setCalculatedPrice(response.data.total_price);
      setFormData(prev => ({ ...prev, delivery_fee: response.data.total_price.toString() }));
    } catch (error) {
      console.error('Failed to calculate price:', error);
    }
  };

  const saveAddress = async (address) => {
    if (!user) return;
    
    try {
      const response = await api.post('/user/addresses', {
        address: address,
        label: 'Saved Address',
      });
      setSavedAddresses(response.data.addresses);
      await updateProfile({ saved_addresses: response.data.addresses });
    } catch (error) {
      console.error('Failed to save address:', error);
    }
  };

  const saveSenderPhone = async (phone) => {
    if (!user || user.phone) return;
    
    try {
      await updateProfile({ phone });
    } catch (error) {
      console.error('Failed to save phone:', error);
    }
  };

  const updateField = (field, value) => {
    setFormData({ ...formData, [field]: value });
    
    if (field === 'pickup_address' && value && !savedAddresses.find(a => a.address === value)) {
      saveAddress(value);
    }
    
    if (field === 'sender_phone' && value) {
      saveSenderPhone(value);
    }
  };

  const selectSavedAddress = (address) => {
    setFormData({ ...formData, pickup_address: address.address });
    setShowAddressModal(false);
  };

  const handleSubmit = async () => {
    if (
      !formData.shipment_type_id ||
      !formData.delivery_zone_id ||
      !formData.delivery_address ||
      !formData.recipient_name ||
      !formData.recipient_phone
    ) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      const orderData = {
        ...formData,
        pickup_address: formData.pickup_address || 'Default Pickup',
        pickup_latitude: 25.2048,
        pickup_longitude: 55.2708,
        delivery_latitude: 25.2048,
        delivery_longitude: 55.2708,
      };
      
      await orderService.createOrder(orderData);
      Alert.alert('Success', 'Order created successfully', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to create order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          <View style={styles.compactSection}>
            <Text style={styles.label}>Shipment Type</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={formData.shipment_type_id}
                onValueChange={(value) => updateField('shipment_type_id', value)}
                style={styles.picker}
                itemStyle={styles.pickerItem}
              >
                <Picker.Item label="Select Type" value="" color="#999" />
                {shipmentTypes.map((type) => (
                  <Picker.Item key={type.id} label={type.name} value={type.id} color="#0B3B5A" />
                ))}
              </Picker>
            </View>
          </View>

          <View style={styles.compactSection}>
            <Text style={styles.label}>Delivery Zone</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={formData.delivery_zone_id}
                onValueChange={(value) => updateField('delivery_zone_id', value)}
                style={styles.picker}
                itemStyle={styles.pickerItem}
              >
                <Picker.Item label="Select Zone" value="" color="#999" />
                {deliveryZones.map((zone) => (
                  <Picker.Item key={zone.id} label={zone.name} value={zone.id} color="#0B3B5A" />
                ))}
              </Picker>
            </View>
          </View>

          {calculatedPrice > 0 && (
            <View style={styles.priceDisplay}>
              <Text style={styles.priceLabel}>Delivery Fee:</Text>
              <Text style={styles.priceValue}>{calculatedPrice} AED</Text>
            </View>
          )}

          <View style={styles.row}>
            <View style={styles.halfWidth}>
              <Input
                label="Recipient Name"
                value={formData.recipient_name}
                onChangeText={(value) => updateField('recipient_name', value)}
                placeholder="Name"
                inputStyle={styles.compactInput}
              />
            </View>
            <View style={styles.halfWidth}>
              <Input
                label="Recipient Phone"
                value={formData.recipient_phone}
                onChangeText={(value) => updateField('recipient_phone', value)}
                placeholder="Phone"
                keyboardType="phone-pad"
                inputStyle={styles.compactInput}
              />
            </View>
          </View>

          <Input
            label="Delivery Address"
            value={formData.delivery_address}
            onChangeText={(value) => updateField('delivery_address', value)}
            placeholder="Enter delivery address"
            inputStyle={styles.compactInput}
          />

          <View style={styles.addressSection}>
            <Input
              label="Pickup Address (Optional)"
              value={formData.pickup_address}
              onChangeText={(value) => updateField('pickup_address', value)}
              placeholder="Your address"
              inputStyle={styles.compactInput}
            />
            {savedAddresses.length > 0 && (
              <TouchableOpacity
                style={styles.savedAddressBtn}
                onPress={() => setShowAddressModal(true)}
              >
                <Text style={styles.savedAddressBtnText}>Saved Addresses</Text>
              </TouchableOpacity>
            )}
          </View>

          <Input
            label="Sender Phone"
            value={formData.sender_phone}
            onChangeText={(value) => updateField('sender_phone', value)}
            placeholder="Your phone number"
            keyboardType="phone-pad"
            inputStyle={styles.compactInput}
          />

          <Input
            label="Product Value (Optional)"
            value={formData.product_value}
            onChangeText={(value) => updateField('product_value', value)}
            placeholder="Value in AED"
            keyboardType="numeric"
            inputStyle={styles.compactInput}
          />

          <Button
            title="Create Order"
            onPress={handleSubmit}
            loading={loading}
            style={styles.submitButton}
          />
        </View>
      </ScrollView>

      <Modal
        visible={showAddressModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowAddressModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Saved Addresses</Text>
            <ScrollView>
              {savedAddresses.map((addr) => (
                <TouchableOpacity
                  key={addr.id}
                  style={styles.addressItem}
                  onPress={() => selectSavedAddress(addr)}
                >
                  <Text style={styles.addressText}>{addr.address}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <Button
              title="Close"
              onPress={() => setShowAddressModal(false)}
              style={styles.closeButton}
            />
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: spacing.md,
  },
  compactSection: {
    marginBottom: spacing.sm,
  },
  label: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
    color: colors.text,
    marginBottom: 4,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  picker: {
    height: 45,
    color: colors.text,
  },
  pickerItem: {
    fontSize: fontSize.md,
    color: colors.text,
  },
  priceDisplay: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    padding: spacing.md,
    borderRadius: 8,
    marginBottom: spacing.md,
  },
  priceLabel: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    color: '#2E7D32',
  },
  priceValue: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: '#1B5E20',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  halfWidth: {
    flex: 1,
  },
  compactInput: {
    paddingVertical: 10,
    fontSize: fontSize.sm,
  },
  addressSection: {
    position: 'relative',
  },
  savedAddressBtn: {
    position: 'absolute',
    right: 8,
    top: 32,
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  savedAddressBtnText: {
    color: '#fff',
    fontSize: fontSize.xs,
    fontWeight: fontWeight.semibold,
  },
  submitButton: {
    marginTop: spacing.md,
    marginBottom: spacing.xl,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: spacing.lg,
    maxHeight: '70%',
  },
  modalTitle: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    marginBottom: spacing.md,
  },
  addressItem: {
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  addressText: {
    fontSize: fontSize.md,
    color: colors.text,
  },
  closeButton: {
    marginTop: spacing.md,
  },
});
