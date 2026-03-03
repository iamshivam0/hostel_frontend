import React from 'react';
import { View } from 'react-native';
import { Button, Text } from 'react-native-paper';

type Props = {
  title: string;
  description: string;
};

export function FeaturePlaceholderScreen({ title, description }: Props) {
  return (
    <View style={{ flex: 1, padding: 20, justifyContent: 'center', gap: 12 }}>
      <Text variant="headlineMedium">{title}</Text>
      <Text variant="bodyLarge">{description}</Text>
      <Button mode="contained">Integrate API + form flow</Button>
    </View>
  );
}
