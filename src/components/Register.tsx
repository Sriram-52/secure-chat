import React, { useEffect, useRef, useState } from "react";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { useNavigate } from "react-router-dom";
import { useUserControllerCreate } from "../api/services/base/users";
import { E2eeManger } from "../utils/e2ee";
import lottie, { AnimationItem } from "lottie-web";
import registerJson from "../assets/REG.json";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import MuiLink from "@mui/material/Link";
import { Link } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
  });

  const [loading, setLoading] = useState(false);

  const [errors, setErrors] = useState({
    email: "",
    password: "",
    name: "",
  });

  const useRegister = useUserControllerCreate({
    mutation: {
      onSuccess: () => {
        setLoading(false);

        setFormData({
          email: "",
          password: "",
          confirmPassword: "",
          name: "",
        });

        setErrors({
          email: "",
          password: "",
          name: "",
        });

        navigate("/login");
      },
    },
  });

  const validate = () => {
    const { email, password, confirmPassword, name } = formData;
    const errors = {
      email: "",
      password: "",
      name: "",
    };

    if (email.trim().length === 0) {
      errors.email = "Email is required";
    }

    if (password.trim().length === 0) {
      errors.password = "Password is required";
    }

    if (confirmPassword.trim().length === 0) {
      errors.password = "Confirm password is required";
    }

    if (password !== confirmPassword) {
      errors.password = "Passwords do not match";
    }

    if (password.trim().length < 6) {
      errors.password = "Password must be at least 6 characters";
    }

    if (name.trim().length === 0) {
      errors.name = "Name is required";
    }

    return errors;
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const errors = validate();
    setErrors(errors);

    if (Object.values(errors).some((error) => error.length > 0)) {
      return;
    }

    setLoading(true);
    useRegister.mutate({
      data: {
        email: formData.email,
        password: formData.password,
        name: formData.name,
        publicKey: E2eeManger.instance.getPublicKey(),
      },
    });
  };

  const theme = createTheme();
  const container = useRef(null);

  useEffect(() => {
    let animation: AnimationItem | undefined;
    if (container.current) {
      animation = lottie.loadAnimation({
        container: container.current,
        renderer: "svg",
        loop: true,
        autoplay: true,
        animationData: registerJson,
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
          <div
            className="container"
            style={{ width: "80%", height: "100%" }}
            ref={container}
          ></div>
        </Grid>
        <Grid
          item
          xs={12}
          md={5}
          sx={{
            justifyContent: "center",
            display: "flex",
            backgroundColor: "#e3ebf6",
            flexDirection: "column",
            alignItems: "center",
            minHeight: "100vh",
            padding: "0 20px",
          }}
          component={Paper}
          elevation={0}
          square
        >
          <Typography sx={{ color: "#55628b" }} component="h1" variant="h4">
            Register
          </Typography>
          <Grid item>
            <Box
              component="form"
              noValidate
              onSubmit={handleSubmit}
              sx={{
                mt: 1,
              }}
            >
              <Box>
                <TextField
                  label="Email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  error={!!errors.email}
                  helperText={errors.email}
                  margin="normal"
                  required
                  fullWidth
                />

                <TextField
                  label="Password"
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  error={!!errors.password}
                  helperText={errors.password}
                  margin="normal"
                  fullWidth
                  required
                />
                <TextField
                  label="Confirm Password"
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  error={!!errors.password}
                  helperText={errors.password}
                  margin="normal"
                  fullWidth
                  required
                />
                <TextField
                  label="Name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  error={!!errors.name}
                  helperText={errors.name}
                  margin="normal"
                  fullWidth
                  required
                />
              </Box>

              <Box sx={{ display: "flex", justifyContent: "center" }}>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{
                    mt: 3,
                    mb: 2,
                    width: "60%",
                    backgroundColor: "#445279",
                    border: 0,
                    borderRadius: 3,
                  }}
                >
                  {loading ? "Loading..." : "Register"}
                </Button>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Grid>
    </ThemeProvider>
    // <Container maxWidth="sm">
    //   <form onSubmit={handleSubmit}>
    //     <Typography variant="h4" component="h1" gutterBottom>
    //       Register
    //     </Typography>

    //     <Button
    //       type="submit"
    //       variant="contained"
    //       color="primary"
    //       disabled={loading}
    //     >
    //       {loading ? "Loading..." : "Register"}
    //     </Button>
    //   </form>
    // </Container>
    //   <Box sx={{ justifyContent: "center", display: "flex" }}>

    // </Box>
    //<Box sx={{ justifyContent: "center", display: "flex" }}>

    // </Box>
  );
}
