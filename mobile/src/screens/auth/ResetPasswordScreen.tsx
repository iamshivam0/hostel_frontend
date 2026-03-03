import React from 'react';
import { View } from 'react-native';
import { Button, Text, TextInput } from 'react-native-paper';

export function ResetPasswordScreen() {
  return (
    <View style={{ flex: 1, padding: 20, justifyContent: 'center', gap: 12 }}>
      <Text variant="headlineSmall">Reset Password</Text>
      <TextInput label="OTP / Token" mode="outlined" />
      <TextInput label="New Password" mode="outlined" secureTextEntry />
      <Button mode="contained">Reset</Button>
    </View>
  );
}
