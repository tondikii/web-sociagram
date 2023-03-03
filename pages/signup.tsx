import type {NextComponentType, NextPageContext} from "next";
import {useEffect, useState, useCallback, useMemo} from "react";
import {connect} from "react-redux";
import {signUp as signUpProps, signIn as signInProps} from "../store/actions";
import {resetSignUp as resetSignUpProps} from "../store/reducers/root";
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
import {ExclamationCircleIcon} from "@heroicons/react/outline";
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
  signUp: Function;
  signUpState: {
    fetch: boolean;
    data: {userId: string};
    error: any;
  };
  resetSignUp: Function;
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

const SignUp: NextComponentType<NextPageContext, {}, Props> = (
  props: Props
) => {
  const {
    signUp,
    signUpState: {data, error},
    resetSignUp,
    signIn,
    signInState,
  } = props;

  const router = useRouter();

  const [signUpForm, setSignUpForm] = useState({
    username: "",
    email: "",
    password: "",
  });

  const disabledSubmit = useMemo(() => {
    let disabled = false;
    const {username, email, password} = signUpForm;
    if (username.length < 3 || !email || password.length < 8) {
      disabled = true;
    }
    return disabled;
  }, [signUpForm]);

  const handleSubmit = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      signUp(signUpForm);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [signUpForm]
  );

  const handleChangeForm = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      let {name, value} = e.target;
      if (name === "username") {
        value = value.toLowerCase();
        if (value) value = value.trim();
        localStorage.username = value;
      }
      setSignUpForm({...signUpForm, [name]: value});
    },
    [signUpForm]
  );

  const renderWarning = useCallback(
    (name: string) => {
      const {password, username, email} = signUpForm;
      const renderText = () => {
        switch (name) {
          case "username":
            if (username.length < 3) {
              return "Username should be more than equal 3 characters";
            }
            break;
          case "email":
            if (!email) {
              return "Email cannot be empty";
            }
            break;
          case "password":
            if (password.length < 8) {
              return "Password should be more than equal 8 characters";
            }
            break;
          default:
            break;
        }
      };
      const text = renderText();
      if (!text) return null;
      return (
        <div className="flex flex-row items-center mt-1">
          <ExclamationCircleIcon className="h-4 w-4 text-yellow-300 mr-1" />
          <small className="text-yellow-300">{text}</small>
        </div>
      );
      // eslint-disable-next-line react-hooks/exhaustive-deps
    },
    [signUpForm]
  );

  useEffect(() => {
    const {userId} = data;
    const {email, password} = signUpForm;
    if (userId) {
      signIn({email, password});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);
  useEffect(() => {
    if (error?.length) {
      Alert.Error({text: error});
      resetSignUp();
    }
  }, [error, resetSignUp]);

  useEffect(() => {
    const {accessToken, userId, username, avatar} = signInState.data;
    if (accessToken) {
      setCookie("accessToken", accessToken);
      localStorage.accessToken = accessToken;
      localStorage.userId = userId;
      localStorage.username = username;
      localStorage.avatar = avatar;
      router.push("/");
    }
  }, [signInState.data, router]);
  useEffect(() => {
    if (signInState.error) {
      Alert.Error({text: signInState.error});
    }
  }, [signInState.error]);

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
            <Typography component="h1" variant="h5" className={styles.title}>
              Sign Up
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
                    autoComplete="given-name"
                    name="username"
                    required
                    fullWidth
                    id="username"
                    label="Username"
                    autoFocus
                    value={signUpForm.username}
                    onChange={handleChangeForm}
                    inputProps={{maxLength: 16}}
                  />
                  {renderWarning("username")}
                </Grid>
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
                    value={signUpForm.email}
                    onChange={handleChangeForm}
                  />
                  {renderWarning("email")}
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
                    value={signUpForm.password}
                    onChange={handleChangeForm}
                  />
                  {renderWarning("password")}
                </Grid>
              </Grid>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{mt: 3, mb: 2}}
                style={{textTransform: "none"}}
                className={styles.btnPrimary}
                disabled={disabledSubmit}
              >
                Sign Up
              </Button>
              <Grid container justifyContent="flex-end">
                <Grid item>
                  <Link
                    href="/signin"
                    className={styles.anchor}
                    variant="body2"
                  >
                    Already have an account? Sign in
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

const mapStateToProps = (state: {
  rootReducer: {signUp: Object; signIn: Object};
}) => ({
  signUpState: state.rootReducer.signUp,
  signInState: state.rootReducer.signIn,
});
const mapDispatchToProps = {
  signUp: (payload: {email: string; password: string; username: string}) =>
    signUpProps(payload),
  signIn: (payload: {email: string; password: string}) => signInProps(payload),
  resetSignUp: (payload: {email: string; password: string}) =>
    resetSignUpProps(payload),
};

export default connect(mapStateToProps, mapDispatchToProps)(SignUp);
