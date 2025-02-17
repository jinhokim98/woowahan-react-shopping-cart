import 'styled-components';

declare module 'styled-components' {
  export interface DefaultTheme {
    typography: {
      heading: string;
      pageTitle: string;
      label: string;
      price: string;
      boldLabel: string;
    };
    color: {
      black: string;
      white: string;
      lightGray: string;
      lightGray2: string;
      lightGray3: string;
      lightGray4: string;
      black10: string;
      lightOrange: string;
      orange: string;
    };
  }
}
