import * as React from "react";
import { ThemeOptions, createTheme, alpha } from "@mui/material/styles";

const themeOptions: ThemeOptions = {
  palette: {
    mode: "light",
    primary: {
      main: "#596d9e",
    },
  },
};

export const theme = createTheme(themeOptions);
