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

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn, continueAsGuest } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);
    const result = await signIn(email, password);
    setLoading(false);

    if (!result.success) {
      Alert.alert('Login Failed', result.message);
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
            value={email}
            onChangeText={setEmail}
            placeholder="username"
            autoCapitalize="none"
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

          <Button
            title="SIGN IN"
            onPress={handleLogin}
            loading={loading}
            style={styles.loginButton}
            textStyle={styles.primaryButtonText}
          />

          <Button
            title="Create Account"
            onPress={() => navigation.navigate('Register')}
            variant="secondary"
            style={styles.createAccountButton}
          />

          <Button
            title="Login as Guest"
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
    paddingTop: 60,
    paddingBottom: spacing.xl,
  },
  header: {
    alignItems: 'center',
    marginBottom: 50,
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
  loginButton: {
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
  createAccountButton: {
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
