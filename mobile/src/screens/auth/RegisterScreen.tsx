import React from 'react';
import { View } from 'react-native';
import { Button, Text, TextInput } from 'react-native-paper';

export function RegisterScreen() {
  return (
    <View style={{ flex: 1, padding: 20, justifyContent: 'center', gap: 12 }}>
      <Text variant="headlineSmall">Register</Text>
      <TextInput label="Full Name" mode="outlined" />
      <TextInput label="Email" mode="outlined" keyboardType="email-address" />
      <TextInput label="Password" mode="outlined" secureTextEntry />
      <Button mode="contained">Create Account</Button>
    </View>
  );
}
