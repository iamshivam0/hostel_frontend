import React from 'react';
import { View } from 'react-native';
import { Button, Modal, Portal, Text } from 'react-native-paper';

type Props = {
  visible: boolean;
  onDismiss: () => void;
  title: string;
  content: string;
};

export function AnnouncementModal({ visible, onDismiss, title, content }: Props) {
  return (
    <Portal>
      <Modal visible={visible} onDismiss={onDismiss} contentContainerStyle={{ margin: 20, borderRadius: 16, backgroundColor: 'white', padding: 20 }}>
        <View style={{ gap: 10 }}>
          <Text variant="titleLarge">{title}</Text>
          <Text variant="bodyMedium">{content}</Text>
          <Button mode="contained" onPress={onDismiss}>
            Close
          </Button>
        </View>
      </Modal>
    </Portal>
  );
}
