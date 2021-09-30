import { Theme } from "@material-ui/core/styles/createMuiTheme";

declare module "@material-ui/core/styles/createMuiTheme" {
  interface Theme {
    custom: {
      appHeaderHeight: React.CSSProperties["height"];
    };
    colors: {
      transparent: string;
      white: string;
      black: string;
      red: string;
      lightRed: string;
      mediumRed: string;
      darkRed: string;
      lightGray: string;
      mediumGray: string;
      text: string;
      lightText: string;
      primary: string;
      secondary: string;
      third: string;
      selected: string;
      border: string;
      lightBorder: string;
      background: string;
      lightBackground: string;
      almostWhite: string;
      lightBlue: string;
      darkBlue: string;
      placeholder: string;
      placeholderDark: string;
    };
  }
  // allow configuration using `createMuiTheme`
  interface ThemeOptions {
    custom: {
      appHeaderHeight: React.CSSProperties["height"];
    };
    colors: {
      transparent: string;
      white: string;
      black: string;
      primary: string;
      secondary: string;
      third: string;
    };
  }
}
