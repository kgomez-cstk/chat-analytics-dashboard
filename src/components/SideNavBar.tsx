import React, { memo } from 'react';
import {
  Box,
  Flex,
  Text,
  VStack,
  Image,
  Icon,
} from '@chakra-ui/react';
import { useAppDispatch, useAppSelector } from '../hooks/useRedux';
import { setActivePage } from '../features/user/userSlice';
import { MdAccessTime, MdChatBubble } from 'react-icons/md';

interface NavItem {
  label: string;
  icon: React.ElementType;
  materialIcon: string;
  id: string;
}

const navItems: NavItem[] = [
  { label: 'Tiempos de Atención', id: 'tiempos', icon: MdAccessTime, materialIcon: 'acute' },
  { label: 'Conversaciones', id: 'conversaciones', icon: MdChatBubble, materialIcon: 'chat_bubble' },
];

const SideNavBar: React.FC = () => {
  const dispatch = useAppDispatch();
  const activePage = useAppSelector((state) => state.user.activePage);
  const userData = useAppSelector((state) => state.user.userData);

  const userName = userData ? `${userData.nombre}` : '';
  const userRole = userData?.rol || '';

  return (
    <Box
      as="aside"
      display={{ base: 'none', md: 'flex' }}
      // ... same styling ...
      flexDirection="column"
      h="100vh"
      w="64"
      bg="gray.100"
      position="sticky"
      top={0}
      flexShrink={0}
    >
      {/* Logo / Branding */}
      <Box px={6} py={8}>
        <Image
          alt="User Profile Avatar"
          w={75}
          h={75}
          src="https://cdn.talkme.pro/personalizacion/TalkMe/consola/menu_lateral.svg"
        />
        <Text
          fontFamily="heading"
          fontWeight="bold"
          fontSize="xl"
          color="gray.900"
        >
          Nombre Empresa
        </Text>
        <Text
          fontFamily="body"
          fontSize="xs"
          color="brand.onSurfaceVariant"
          opacity={0.7}
        >
          Dashboard de métricas conversacionales
        </Text>
      </Box>

      {/* Navigation */}
      <VStack as="nav" flex={1} px={4} spacing={1} overflowY="auto" align="stretch">
        {navItems.map((item) => {
          const isActive = activePage === item.id;
          return (
            <Flex
              key={item.id}
              align="center"
              gap={3}
              px={3}
              py={2}
              rounded="lg"
              cursor="pointer"
              transition="all 0.2s"
              borderRight={isActive ? '4px solid' : 'none'}
              borderColor={isActive ? 'blue.600' : 'transparent'}
              bg={isActive ? 'blackAlpha.100' : 'transparent'}
              color={isActive ? 'blue.700' : 'gray.500'}
              fontWeight={isActive ? 'semibold' : 'normal'}
              onClick={() => dispatch(setActivePage(item.id as any))}
              _hover={{
                bg: isActive ? undefined : 'blackAlpha.100',
              }}
              _active={{
                transform: 'scale(0.95)',
              }}
            >
              <Box as="span" className="material-symbols-outlined" fontSize="xl">
                {item.materialIcon}
              </Box>
              <Text fontFamily="body" fontSize="sm" fontWeight="medium">
                {item.label}
              </Text>
            </Flex>
          );
        })}
      </VStack>

      {/* User Profile */}
      <Box p={4} mt="auto">
        <Flex
          align="center"
          gap={3}
          p={2}
          bg="brand.surfaceContainerLowest"
          rounded="xl"
          shadow="sm"
        >
          <Image
            alt="User Profile Avatar"
            w={10}
            h={10}
            rounded="full"
            border="1px solid"
            borderColor="brand.outlineVariant"
            src="https://cdn.talkme.pro/personalizacion/TalkMe/consola/menu_lateral.svg"
            fallback={
              <Flex
                w={10}
                h={10}
                rounded="full"
                bg="brand.primaryContainer"
                color="brand.onPrimaryContainer"
                align="center"
                justify="center"
                fontWeight="bold"
                fontSize="xs"
              >
                {userName.split(' ').map((n) => n[0]).join('').slice(0, 2)}
              </Flex>
            }
          />
          <Box overflow="hidden">
            <Text fontSize="xs" fontWeight="bold" isTruncated>
              {userName}
            </Text>
            <Text fontSize="10px" color="brand.onSurfaceVariant">
              {userRole}
            </Text>
          </Box>
        </Flex>
      </Box>
    </Box>
  );
};

export default memo(SideNavBar);
