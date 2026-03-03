import React from 'react';
import { Portal, Modal, List, Divider } from 'react-native-paper';

type MenuAction = {
  title: string;
  icon: string;
  onPress: () => void;
};

type Props = {
  visible: boolean;
  onDismiss: () => void;
  actions: MenuAction[];
};

export function MenuModal({ visible, onDismiss, actions }: Props) {
  return (
    <Portal>
      <Modal visible={visible} onDismiss={onDismiss} contentContainerStyle={{ margin: 20, borderRadius: 16, backgroundColor: 'white', paddingVertical: 8 }}>
        {actions.map((action, index) => (
          <React.Fragment key={action.title}>
            <List.Item
              title={action.title}
              left={(props) => <List.Icon {...props} icon={action.icon} />}
              onPress={() => {
                action.onPress();
                onDismiss();
              }}
            />
            {index < actions.length - 1 && <Divider />}
          </React.Fragment>
        ))}
      </Modal>
    </Portal>
  );
}
