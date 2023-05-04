import type {NextComponentType, NextPageContext} from "next";
import {useDispatch} from "react-redux";
import {useState} from "react";
import {setCookie} from "cookies-next";
import {useRouter} from "next/router";

import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import {createTheme, ThemeProvider} from "@mui/material/styles";
import ReactLoading from "react-loading";
import * as Alert from "../components/Alert";

import styles from "../styles/Auth.module.css";
import {setSession} from "../store/reducers/root";
import {signInApi} from "../store/api";

const theme = createTheme();

const focusColor = {
  "& .MuiFormLabel-root": {
    color: "#cbd5e1",
  },
  "& .MuiFormLabel-root.Mui-focused": {
    color: "white",
    fontWeight: "700",
  },
  "& .MuiInputBase-root": {
    color: "white",
  },
};

interface Props {}

const SignIn: NextComponentType<NextPageContext, {}, Props> = (
  props: Props
) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    try {
      if (loading) return;
      event.preventDefault();
      setLoading(true);
      const email = (document.getElementById("email") as HTMLInputElement)
        .value;
      const password = (document.getElementById("password") as HTMLInputElement)
        .value;
      const {data} = await signInApi({email, password});
      if (data?.data?.accessToken) {
        const {accessToken, username, avatar, id} = data?.data || {};
        setCookie("accessToken", accessToken);
        localStorage.accessToken = accessToken;
        dispatch(setSession({accessToken, username, avatar, id}));
        router.push("/");
      }
    } catch (err: {response: {data: {error: string}}} | any) {
      const {error: errorMessage} = err?.response?.data || {};
      Alert.Error(errorMessage || "Unknown error while sign in!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="verticalCenter p-4 min-h-screen bg-gradient-to-r from-purple-500 to-pink-500">
      <ThemeProvider theme={theme}>
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <Box
            sx={{
              marginTop: 8,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Avatar sx={{m: 1, bgcolor: "secondary.main"}}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="span" variant="h5" className={styles.title}>
              Sign In
            </Typography>
            <Box
              component="form"
              noValidate
              onSubmit={handleSubmit}
              sx={{mt: 3}}
            >
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    className={styles.textField}
                    sx={focusColor}
                    variant="filled"
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    autoComplete="email"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    className={styles.textField}
                    sx={focusColor}
                    variant="filled"
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type="password"
                    id="password"
                    autoComplete="new-password"
                  />
                </Grid>
              </Grid>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{mt: 3, mb: 2}}
                style={{textTransform: "none"}}
                className={`${styles.btnPrimary} horizontal`}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <ReactLoading
                      type="spin"
                      height={16}
                      width={16}
                      color="white"
                      className="mr-2"
                    />
                    Loading...
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>
              <Grid container justifyContent="flex-end">
                <Grid item>
                  <span
                    role="button"
                    className={styles.anchor}
                    onClick={() => router.push("/signup")}
                  >
                    {"Don't have an account? Sign Up"}
                  </span>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Container>
      </ThemeProvider>
    </div>
  );
};

export default SignIn;
