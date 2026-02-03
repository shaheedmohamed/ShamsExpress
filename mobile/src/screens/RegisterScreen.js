import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import Input from '../components/Input';
import Button from '../components/Button';
import { colors, spacing, fontSize, fontWeight, borderRadius } from '../config/theme';

export default function RegisterScreen({ navigation }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signUp, continueAsGuest } = useAuth();

  const handleRegister = async () => {
    if (!name || !email || !phone || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    setLoading(true);
    const result = await signUp(name, email, password, confirmPassword, phone);
    setLoading(false);

    if (!result.success) {
      Alert.alert('Registration Failed', result.message);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Image
            source={require('../../assets/logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        <View style={styles.form}>
          <Input
            value={name}
            onChangeText={setName}
            placeholder="full name"
            placeholderTextColor="rgba(255,255,255,0.75)"
            inputStyle={styles.input}
          />

          <Input
            value={email}
            onChangeText={setEmail}
            placeholder="email"
            keyboardType="email-address"
            autoCapitalize="none"
            placeholderTextColor="rgba(255,255,255,0.75)"
            inputStyle={styles.input}
          />

          <Input
            value={phone}
            onChangeText={setPhone}
            placeholder="phone"
            keyboardType="phone-pad"
            placeholderTextColor="rgba(255,255,255,0.75)"
            inputStyle={styles.input}
          />

          <Input
            value={password}
            onChangeText={setPassword}
            placeholder="password"
            secureTextEntry
            placeholderTextColor="rgba(255,255,255,0.75)"
            inputStyle={styles.input}
          />

          <Input
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            placeholder="confirm password"
            secureTextEntry
            placeholderTextColor="rgba(255,255,255,0.75)"
            inputStyle={styles.input}
          />

          <Button
            title="SIGN UP"
            onPress={handleRegister}
            loading={loading}
            style={styles.registerButton}
            textStyle={styles.primaryButtonText}
          />

          <Button
            title="SIGN IN"
            onPress={() => navigation.navigate('Login')}
            variant="secondary"
            style={styles.signInButton}
          />

          <Button
            title="Skip"
            onPress={continueAsGuest}
            style={styles.skipButton}
            textStyle={styles.skipButtonText}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B3B5A',
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: 50,
    paddingBottom: spacing.xl,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    width: 400,
    height: 220,
  },
  form: {
    width: '100%',
  },
  input: {
    backgroundColor: 'transparent',
    borderColor: 'rgba(255,255,255,0.5)',
    borderWidth: 1.5,
    borderRadius: 8,
    paddingVertical: 16,
    paddingHorizontal: 18,
    color: '#fff',
    fontSize: 15,
  },
  registerButton: {
    marginTop: 20,
    backgroundColor: '#1C5C8A',
    borderRadius: 8,
    paddingVertical: 16,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
  signInButton: {
    marginTop: 12,
    backgroundColor: '#1C5C8A',
    borderColor: 'rgba(255,255,255,0.3)',
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 16,
  },
  skipButton: {
    marginTop: 30,
    backgroundColor: '#F2B705',
    borderRadius: 20,
    paddingVertical: 12,
    paddingHorizontal: 40,
    alignSelf: 'center',
  },
  skipButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0B3B5A',
  },
});
