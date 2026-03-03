import React from 'react';
import { View } from 'react-native';
import { Button, Text, TextInput } from 'react-native-paper';

export function ForgotPasswordScreen() {
  return (
    <View style={{ flex: 1, padding: 20, justifyContent: 'center', gap: 12 }}>
      <Text variant="headlineSmall">Forgot Password</Text>
      <TextInput label="Email" mode="outlined" keyboardType="email-address" />
      <Button mode="contained">Send Reset Link</Button>
    </View>
  );
}
