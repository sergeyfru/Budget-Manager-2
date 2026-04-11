import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useAuthStore } from "../../store/authStore";
import { useNavigate } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  Container,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { toast } from "sonner";
import type { AxiosError } from "axios";
import { loginFormSchema, type LoginFormValue, type ReqLogin } from "@shared/core";

export const LoginPage = () => {
  const navigate = useNavigate();
  const authStore = useAuthStore();
const getFieldErrors = (error: any) => {
  if (!error) return [];

  if (error.types) {
    return Object.values(error.types);
  }

  return [error.message];
};

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValue>({
    resolver: zodResolver(loginFormSchema),
  });


  const onSubmit = async (data: ReqLogin) => {
    console.log("Submitting login form with data:", data);
    
    try {
      await authStore.login(data);
      navigate("/");
    } catch (err: any) {
      const data = (err as AxiosError)?.response?.data || err;

      if (data?.errors) {
        data.errors.forEach((e: any) => {
          console.log(e.field, { message: e.message });

          setError(e.field, { message: `${e.message}` });
        });
        return;
      }
      if (data?.message) {
        toast.error(data.message);
        return;
      }
      toast.error("An unexpected error occurred");
      console.error("Login error:", data);
    }
  };
  return (
    <Container maxWidth="sm">
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <Paper elevation={3} sx={{ padding: 4, width: "100%" }}>
          <Typography variant="h5" mb={2} textAlign="center">
            Login
          </Typography>

          <Box
            component="form"

            onSubmit={(e) => { e.preventDefault(); console.log("Form submitted",register); handleSubmit(onSubmit)(); }}
            display="flex"
            flexDirection="column"
            gap={2}
          >
            <TextField
              label="Email"
              type="email"
              {...register("email")}
              error={!!errors.email}
              helperText={errors.email ? errors.email.message : ""}
              required
              fullWidth
            />

            <TextField
              label="Password"
              type="password"
              {...register("password")}
              error={!!errors.password}
              helperText={errors.password ? errors.password.message : ""}
              required
              fullWidth
            />
   <ul>
  {getFieldErrors(errors.password).map((msg, i) => (
    <li key={i}>{msg}</li>
  ))}
</ul>

            <Button
              type="submit"
              variant="contained"
              disabled={authStore.authStatus === "loading" || isSubmitting}
              size="large"
            >
              {authStore.authStatus === "loading" ? "Logging in..." : "Login"}
            </Button>
            <p className="link">
              Don’t have an account? <a href="/register">Sign up</a>
            </p>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};
