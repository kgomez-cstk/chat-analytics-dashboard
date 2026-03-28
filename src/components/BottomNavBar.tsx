import React, { memo } from 'react';
import { Box, Flex, Text } from '@chakra-ui/react';

interface NavButton {
  label: string;
  materialIcon: string;
  active: boolean;
}

const navButtons: NavButton[] = [
  { label: 'Dash', materialIcon: 'dashboard', active: false },
  { label: 'Reports', materialIcon: 'analytics', active: true },
  { label: 'Team', materialIcon: 'groups', active: false },
  { label: 'Settings', materialIcon: 'settings', active: false },
];

const BottomNavBar: React.FC = () => {
  return (
    <Box
      as="nav"
      display={{ base: 'flex', md: 'none' }}
      position="fixed"
      bottom={0}
      left={0}
      right={0}
      bg="rgba(255,255,255,0.7)"
      backdropFilter="blur(12px)"
      justifyContent="space-around"
      alignItems="center"
      py={3}
      px={6}
      boxShadow="0 -4px 20px rgba(0,0,0,0.05)"
      zIndex={50}
    >
      {navButtons.map((btn) => (
        <Flex
          key={btn.label}
          as="button"
          direction="column"
          align="center"
          gap={1}
          color={btn.active ? 'blue.600' : 'brand.onSurfaceVariant'}
          fontWeight={btn.active ? 'bold' : 'normal'}
          cursor="pointer"
          _hover={{ color: 'brand.primary' }}
        >
          <Box as="span" className="material-symbols-outlined">
            {btn.materialIcon}
          </Box>
          <Text fontSize="10px" fontWeight="medium">
            {btn.label}
          </Text>
        </Flex>
      ))}
    </Box>
  );
};

export default memo(BottomNavBar);
