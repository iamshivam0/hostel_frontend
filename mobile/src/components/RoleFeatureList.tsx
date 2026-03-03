import React from 'react';
import { FlatList } from 'react-native';
import { Card, Text } from 'react-native-paper';
import { FeatureItem } from '@/types';

type Props = {
  features: FeatureItem[];
};

export function RoleFeatureList({ features }: Props) {
  return (
    <FlatList
      data={features}
      keyExtractor={(item) => item.route}
      contentContainerStyle={{ padding: 16, gap: 12 }}
      renderItem={({ item }) => (
        <Card mode="contained">
          <Card.Title title={item.title} />
          <Card.Content>
            <Text variant="bodyMedium">{item.description}</Text>
          </Card.Content>
        </Card>
      )}
    />
  );
}
