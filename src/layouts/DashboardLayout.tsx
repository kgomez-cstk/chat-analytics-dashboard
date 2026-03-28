import React, { memo } from 'react';
import { Box, Flex } from '@chakra-ui/react';
import SideNavBar from '../components/SideNavBar';
import BottomNavBar from '../components/BottomNavBar';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  return (
    <Flex minH="100vh" bg="brand.background">
      <SideNavBar />
      <Box
        as="main"
        flex={1}
        display="flex"
        flexDirection="column"
        minW={0}
        pb={{ base: '80px', md: 0 }}
      >
        {children}
      </Box>
      <BottomNavBar />
    </Flex>
  );
};

export default memo(DashboardLayout);
