import type {NextComponentType, NextPageContext} from "next";
import {connect} from "react-redux";
import {useEffect, useState, useCallback} from "react";
import {signIn as signInProps} from "../store/actions";
import {setCookie} from "cookies-next";
import {useRouter} from "next/router";

import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import {createTheme, ThemeProvider} from "@mui/material/styles";
import styles from "../styles/Auth.module.css";

import * as Alert from "../components/Alert";

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

interface Props {
  signIn: Function;
  signInState: {
    fetch: boolean;
    data: {
      accessToken: string;
      username: string;
      avatar: string;
      userId: string;
    };
    error: any;
  };
}

const SignIn: NextComponentType<NextPageContext, {}, Props> = (
  props: Props
) => {
  const {
    signIn,
    signInState: {data, error},
  } = props;
  const router = useRouter();

  const [signInForm, setSignInForm] = useState({email: "", password: ""});

  const handleChangeForm = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const {name, value} = e.target;
      setSignInForm({...signInForm, [name]: value});
    },
    [signInForm]
  );

  const handleSubmit = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      signIn(signInForm);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [signInForm]
  );

  useEffect(() => {
    const {accessToken, username, avatar, userId} = data;
    if (accessToken) {
      setCookie("accessToken", accessToken);
      localStorage.accessToken = accessToken;
      localStorage.userId = userId;
      localStorage.username = username;
      localStorage.avatar = avatar;
      router.push("/");
      Alert.Success({text: "Sign in success!"});
    }
  }, [data]);
  useEffect(() => {
    if (error) {
      Alert.Error({text: error});
    }
  }, [error]);

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
            <Typography component="h1" variant="h5" className="text-white">
              Sign in
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
                    value={signInForm.email}
                    onChange={handleChangeForm}
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
                    value={signInForm.password}
                    onChange={handleChangeForm}
                  />
                </Grid>
              </Grid>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{mt: 3, mb: 2}}
                style={{textTransform: "none"}}
                className={styles.btnPrimary}
              >
                Sign in
              </Button>
              <Grid container justifyContent="flex-end">
                <Grid item>
                  <Link
                    href="/signup"
                    variant="body2"
                    className={styles.anchor}
                  >
                    {"Don't have an account? Sign Up"}
                  </Link>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Container>
      </ThemeProvider>
    </div>
  );
};

const mapStateToProps = (state: {rootReducer: {signIn: Object}}) => ({
  signInState: state.rootReducer.signIn,
});
const mapDispatchToProps = {
  signIn: (payload: {email: string; password: string}) => signInProps(payload),
};

export default connect(mapStateToProps, mapDispatchToProps)(SignIn);
