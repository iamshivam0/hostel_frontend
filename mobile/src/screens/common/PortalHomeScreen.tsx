import React from 'react';
import { View } from 'react-native';
import { FAB, Text } from 'react-native-paper';
import { RoleFeatureList } from '@/components/RoleFeatureList';
import { AnnouncementModal } from '@/components/AnnouncementModal';
import { MenuModal } from '@/components/MenuModal';
import { useAppDispatch } from '@/hooks/redux';
import { logoutAndClear } from '@/store/slices/authSlice';
import { UserRole } from '@/types';
import { roleFeatureMap } from '@/utils/constants';

type Props = {
  role: UserRole;
};

export function PortalHomeScreen({ role }: Props) {
  const dispatch = useAppDispatch();
  const [menuVisible, setMenuVisible] = React.useState(false);
  const [announcementVisible, setAnnouncementVisible] = React.useState(false);

  return (
    <View style={{ flex: 1 }}>
      <Text variant="headlineSmall" style={{ paddingHorizontal: 16, paddingTop: 16 }}>
        {role[0].toUpperCase() + role.slice(1)} Portal
      </Text>
      <RoleFeatureList features={roleFeatureMap[role]} />

      <MenuModal
        visible={menuVisible}
        onDismiss={() => setMenuVisible(false)}
        actions={[
          { title: 'View Announcement', icon: 'bullhorn', onPress: () => setAnnouncementVisible(true) },
          { title: 'Logout', icon: 'logout', onPress: () => dispatch(logoutAndClear()) },
        ]}
      />
      <AnnouncementModal
        visible={announcementVisible}
        onDismiss={() => setAnnouncementVisible(false)}
        title="Campus Update"
        content="Mobile parity work is in progress. All core modules are scaffolded and ready for API integration."
      />

      <FAB icon="menu" style={{ position: 'absolute', right: 18, bottom: 22 }} onPress={() => setMenuVisible(true)} />
    </View>
  );
}
