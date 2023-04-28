import {
  Box,
  Typography,
  FormGroup,
  FormControlLabel,
  Button,
  Stack,
  Divider,
} from "@mui/material";
import Link from "next/link";
import { loginType } from "../../../src/types/auth/auth";
import CustomCheckbox from "../../../src/components/forms/theme-elements/CustomCheckbox";
import CustomTextField from "../../../src/components/forms/theme-elements/CustomTextField";
import CustomFormLabel from "../../../src/components/forms/theme-elements/CustomFormLabel";
import { useSnackbar } from 'notistack'
import {RECAPTCHA_SITEKEY } from "../../../src/config"
// import AuthSocialButtons from "./AuthSocialButtons";
import { useState, useEffect } from "react";
import { getRecaptchaToken } from "../../../src/utils/recaptcha";
import { useRouter } from "next/router";
import useAuth from "../../../src/hooks2/useAuth";
import useIsMountedRef from "../../../src/hooks2/useIsMountedRef";

const AuthLogin = ({ title, subtitle, subtext }) => {
  const router= useRouter()
  const {isMountedRef }= useIsMountedRef()
  const [userName, setUserName]= useState("")
  const [password, setPassword]= useState("")
  const [is2FA, set2FA] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const {login }= useAuth()
  useEffect(() => {
    const loadScriptByURL = (id, url, callback) => {
      const isScriptExist = document.getElementById(id);

      if (!isScriptExist) {
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = url;
        script.id = id;
        script.onload = function () {
          if (callback) callback();
        };
        document.body.appendChild(script);
      }

      if (isScriptExist && callback) callback();
    };

    /// n phai load cai nay da
    // load the script by passing the URL
    loadScriptByURL('recaptcha-key', `https://www.google.com/recaptcha/api.js?render=${RECAPTCHA_SITEKEY}`, () => {
      console.log('Script loaded!');
    });
  }, []);
  const loginExec= async ()=> {
    try {
      const captcha = await getRecaptchaToken();
      const response = await login(userName, password, "", captcha);
      if (response.ok && response.require2fa) {
        set2FA(true);
      }
      if (response.ok && !response.require2fa) {
        // getExchangeAccount();
        router.push("/")

      }

    } catch (error) {
      console.log(error);
      enqueueSnackbar(error?.message, { variant: 'error' })
      if (isMountedRef?.current) {
        setError('afterSubmit', { ...error, message: error.message });
      }
    }
  }
  return (
    <>
      {title ? (
        <Typography fontWeight="700" variant="h3" mb={1}>
          {title}
        </Typography>
      ) : null}

      {subtext}

      {/* <AuthSocialButtons title="Sign in with" /> */}
      {/* <Box mt={3}>
        <Divider>
          <Typography
            component="span"
            color="textSecondary"
            variant="h6"
            fontWeight="400"
            position="relative"
            px={2}
          >
            or sign in with
          </Typography>
        </Divider>
      </Box> */}

      <Stack>
        <Box>
          <CustomFormLabel htmlFor="username">Username</CustomFormLabel>
          <CustomTextField value={userName} onChange={(e)=> setUserName(e.target.value)} id="username" variant="outlined" fullWidth />
        </Box>
        <Box>
          <CustomFormLabel htmlFor="password">Password</CustomFormLabel>
          <CustomTextField
            value={password} 
            onChange={(e)=> setPassword(e.target.value)}
            id="password"
            type="password"
            variant="outlined"
            fullWidth
          />
        </Box>
        <Stack
          justifyContent="space-between"
          direction="row"
          alignItems="center"
          my={2}
        >
          <FormGroup>
            <FormControlLabel
              control={<CustomCheckbox defaultChecked />}
              label="Remeber this Device"
            />
          </FormGroup>
          <Typography
            component={Link}
            href="/auth/auth1/forgot-password"
            fontWeight="500"
            sx={{
              textDecoration: "none",
              color: "primary.main",
            }}
          >
            Forgot Password ?
          </Typography>
        </Stack>
      </Stack>
      <Box>
        <Button
          onClick={loginExec}
          color="primary"
          variant="contained"
          size="large"
          fullWidth
          type="submit"
        >
          Sign In
        </Button>
      </Box>
      {subtitle}
    </>
  );
};

export default AuthLogin;
