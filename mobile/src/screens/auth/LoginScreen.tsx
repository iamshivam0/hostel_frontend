import React from 'react';
import { View } from 'react-native';
import { Button, HelperText, Text, TextInput } from 'react-native-paper';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { loginWithCredentials } from '@/services/auth';
import { useAppDispatch } from '@/hooks/redux';
import { saveSession } from '@/store/slices/authSlice';

type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
  ResetPassword: undefined;
};

type Props = NativeStackScreenProps<AuthStackParamList, 'Login'>;

export function LoginScreen({ navigation }: Props) {
  const dispatch = useAppDispatch();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState('');

  const onLogin = async () => {
    setErrorMessage('');

    if (!email || !password) {
      setErrorMessage('Email and password are required.');
      return;
    }

    try {
      setLoading(true);
      const data = await loginWithCredentials(email.trim().toLowerCase(), password);
      await dispatch(saveSession({ token: data.token, user: data.user })).unwrap();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Unable to login at the moment.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, padding: 20, justifyContent: 'center', gap: 14 }}>
      <Text variant="headlineSmall">HMS Mobile Login</Text>
      <TextInput label="Email" mode="outlined" keyboardType="email-address" autoCapitalize="none" value={email} onChangeText={setEmail} />
      <TextInput label="Password" mode="outlined" secureTextEntry value={password} onChangeText={setPassword} />
      {!!errorMessage && <HelperText type="error">{errorMessage}</HelperText>}
      <Button mode="contained" loading={loading} disabled={loading} onPress={onLogin}>
        Sign In
      </Button>
      <Button mode="text" onPress={() => navigation.navigate('ForgotPassword')}>
        Forgot Password?
      </Button>
      <Button mode="text" onPress={() => navigation.navigate('Register')}>
        Create Account
      </Button>
    </View>
  );
}
