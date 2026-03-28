import { extendTheme } from '@chakra-ui/react';
import type { ThemeConfig } from '@chakra-ui/react';

const config: ThemeConfig = {
  initialColorMode: 'light',
  useSystemColorMode: false,
};

const colors = {
  brand: {
    primary: '#0053db',
    primaryDim: '#0048c1',
    primaryContainer: '#dbe1ff',
    onPrimary: '#f8f7ff',
    onPrimaryContainer: '#0048bf',
    onPrimaryFixed: '#003798',
    onPrimaryFixedVariant: '#0050d4',
    primaryFixed: '#dbe1ff',
    primaryFixedDim: '#c7d3ff',
    inversePrimary: '#618bff',

    secondary: '#742fe5',
    secondaryDim: '#681ad9',
    secondaryContainer: '#eaddff',
    onSecondary: '#fdf7ff',
    onSecondaryContainer: '#6617d7',
    onSecondaryFixed: '#5100b3',
    onSecondaryFixedVariant: '#702ae1',
    secondaryFixed: '#eaddff',
    secondaryFixedDim: '#deccff',

    tertiary: '#006b62',
    tertiaryDim: '#005e56',
    tertiaryContainer: '#91feef',
    onTertiary: '#e2fff9',
    onTertiaryContainer: '#006259',
    onTertiaryFixed: '#004e47',
    onTertiaryFixedVariant: '#006d64',
    tertiaryFixed: '#91feef',
    tertiaryFixedDim: '#83efe1',

    error: '#9f403d',
    errorDim: '#4e0309',
    errorContainer: '#fe8983',
    onError: '#fff7f6',
    onErrorContainer: '#752121',

    surface: '#f7f9fb',
    surfaceBright: '#f7f9fb',
    surfaceDim: '#cfdce3',
    surfaceTint: '#0053db',
    surfaceVariant: '#d9e4ea',
    surfaceContainer: '#e8eff3',
    surfaceContainerLow: '#f0f4f7',
    surfaceContainerLowest: '#ffffff',
    surfaceContainerHigh: '#e1e9ee',
    surfaceContainerHighest: '#d9e4ea',

    onSurface: '#2a3439',
    onSurfaceVariant: '#566166',
    onBackground: '#2a3439',
    background: '#f7f9fb',

    outline: '#717c82',
    outlineVariant: '#a9b4b9',

    inverseSurface: '#0b0f10',
    inverseOnSurface: '#9a9d9f',
  },
};

const fonts = {
  heading: `'Manrope', sans-serif`,
  body: `'Inter', sans-serif`,
};

const styles = {
  global: {
    'html, body': {
      bg: 'brand.background',
      color: 'brand.onSurface',
      fontFamily: 'body',
      minH: '100vh',
    },
    '.material-symbols-outlined': {
      fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24",
    },
  },
};

const components = {
  Button: {
    baseStyle: {
      fontWeight: 'bold',
      borderRadius: 'lg',
    },
    variants: {
      primary: {
        bg: 'brand.primary',
        color: 'brand.onPrimary',
        shadow: 'lg',
        _hover: {
          transform: 'scale(1.05)',
          bg: 'brand.primaryDim',
        },
        _active: {
          transform: 'scale(0.95)',
        },
      },
    },
  },
};

export const theme = extendTheme({
  config,
  colors,
  fonts,
  styles,
  components,
});
