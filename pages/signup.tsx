import type {NextComponentType, NextPageContext} from "next";
import {useState, useCallback, useMemo} from "react";
import {useDispatch} from "react-redux";
import {setSession} from "../store/reducers/root";
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
import styles from "../styles/Auth.module.css";
import {ExclamationCircleIcon} from "@heroicons/react/outline";
import ReactLoading from "react-loading";
import * as Alert from "../components/Alert";

import {signInApi, signUpApi} from "../store/api";

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

interface SignUpForm {
  username: string;
  email: string;
  password: string;
}
interface SignInForm {
  email: string;
  password: string;
}

const SignUp: NextComponentType<NextPageContext, {}, Props> = (
  props: Props
) => {
  const {} = props;

  const router = useRouter();
  const dispatch = useDispatch();

  const [signUpForm, setSignUpForm] = useState<SignUpForm>({
    username: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState<boolean>(false);

  const disabledSubmit = useMemo(() => {
    if (loading) return true;
    let disabled = false;
    const {username, email, password} = signUpForm;
    if (username.length < 3 || !email || password.length < 8) {
      disabled = true;
    }
    return disabled;
  }, [signUpForm, loading]);

  const handleSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      try {
        if (loading) return;
        setLoading(true);
        event.preventDefault();
        const {data} = await signUpApi(signUpForm);
        if (data?.data?.id) {
          const {email, password}: SignInForm = signUpForm;
          const {data: dataLogin} = await signInApi({email, password});
          if (dataLogin?.data?.accessToken) {
            const {accessToken, username, avatar, id} = dataLogin?.data || {};
            setCookie("accessToken", accessToken);
            localStorage.accessToken = accessToken;
            dispatch(setSession({accessToken, username, avatar, id}));
            router.push("/");
          }
        }
      } catch (err: {response: {data: {error: string}}} | any) {
        const {error: errorMessage} = err?.response?.data || {};
        Alert.Error({text: errorMessage || "Unknown error while sign up!"});
      } finally {
        setLoading(false);
      }
    },
    [signUpForm, router, dispatch, loading]
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
                className={`${styles.btnPrimary} horizontal`}
                disabled={disabledSubmit}
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
                  "Sign Up"
                )}
              </Button>
              <Grid container justifyContent="flex-end">
                <Grid item>
                  <span
                    role="button"
                    className={styles.anchor}
                    onClick={() => router.push("/signin")}
                  >
                    Already have an account? Sign in
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

export default SignUp;
