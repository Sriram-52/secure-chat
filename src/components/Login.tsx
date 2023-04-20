import React, { useEffect, useRef } from "react";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import lottie, { AnimationItem } from "lottie-web";
import loginJson from "../assets/login.json";
import { Link } from "react-router-dom";
import MuiLink from "@mui/material/Link";
import { useAuth } from "../context/AuthContext";

const theme = createTheme();

export default function Login() {
  const authContext = useAuth();
  const container = useRef(null);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    const parsedData = {
      email: data.get("email") as string,
      password: data.get("password") as string,
    };

    authContext?.login(parsedData.email, parsedData.password);
  };

  useEffect(() => {
    let animation: AnimationItem | undefined;
    if (container.current) {
      animation = lottie.loadAnimation({
        container: container.current,
        renderer: "svg",
        loop: true,
        autoplay: true,
        animationData: loginJson,
      });
    }
    return () => {
      animation?.destroy();
    };
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <Grid container component="main" sx={{ height: "100vh" }}>
        <CssBaseline />
        <Grid item xs={false} md={7} sx={{ backgroundColor: "#596d9e" }}>
          <div className="container" ref={container}></div>
        </Grid>
        <Grid item xs={12} md={5} component={Paper} elevation={0} square>
          <Box
            sx={{
              justifyContent: "center",
              display: "flex",
              backgroundColor: "#e3ebf6",
              flexDirection: "column",
              alignItems: "center",
              minHeight: "100vh",
            }}
          >
            <Typography sx={{ color: "#55628b" }} component="h1" variant="h4">
              Login
            </Typography>
            {/* <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Sign in
            </Typography> */}
            <Box
              component="form"
              noValidate
              onSubmit={handleSubmit}
              sx={{ mt: 1 }}
            >
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
              />
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <MuiLink
                  component={Link}
                  to="/forgot-password"
                  variant="body2"
                  sx={{
                    color: "#55628b",
                    visibility: "hidden",
                    textDecoration: "none",
                  }}
                >
                  Forgot password?
                </MuiLink>
                <MuiLink
                  component={Link}
                  to="/register"
                  variant="body2"
                  sx={{ color: "#55628b", textDecoration: "none" }}
                >
                  {"Don't have an account? Sign Up"}
                </MuiLink>
              </Box>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{
                  mt: 3,
                  mb: 2,
                  backgroundColor: "#445279",
                  border: 0,
                  borderRadius: 3,
                }}
              >
                Login
              </Button>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}
