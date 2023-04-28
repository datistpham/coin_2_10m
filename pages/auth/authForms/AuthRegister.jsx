import { Box, Typography, Button, Divider } from "@mui/material";
import Link from "next/link";
import CustomTextField from "../../../src/components/forms/theme-elements/CustomTextField";
import CustomFormLabel from "../../../src/components/forms/theme-elements/CustomFormLabel";
import { Stack } from "@mui/system";
import { registerType } from "../../../src/types/auth/auth";
import { useEffect, useState } from "react";
// import AuthSocialButtons from "./AuthSocialButtons";
import {RECAPTCHA_SITEKEY } from "../../../src/config"
import { getRecaptchaToken } from "../../../src/utils/recaptcha";
import { useRouter } from "next/router";
import useAuth from "../../../src/hooks2/useAuth";
import useIsMountedRef from "../../../src/hooks2/useIsMountedRef";
import { useSnackbar } from 'notistack'

const AuthRegister = ({ title, subtitle, subtext }) => {
  const router= useRouter()
  const {isMountedRef }= useIsMountedRef()
  const [email, setEmail]= useState("")
  const [userName, setUserName]= useState("")
  const [password, setPassword]= useState("")
  const [is2FA, set2FA] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const { register } = useAuth()

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
  const registerExec= async ()=> {
    try {
      const captcha = await getRecaptchaToken();
      await register(userName, password, email, captcha);
      router.push("/auth/auth1/login")
    } catch (error) {
      console.error(error);
      enqueueSnackbar(error?.message, { variant: 'error' })
      if (useIsMountedRef?.current) {
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
      {/* <AuthSocialButtons title="Sign up with" />
  
      <Box mt={3}>
        <Divider>
          <Typography
            component="span"
            color="textSecondary"
            variant="h6"
            fontWeight="400"
            position="relative"
            px={2}
          >
            or sign up with
          </Typography>
        </Divider>
      </Box> */}

      <Box>
        <Stack mb={3}>
          <CustomFormLabel htmlFor="email">Email</CustomFormLabel>
          <CustomTextField value={email} onChange={(e)=> setEmail(e.target.value)} id="email" variant="outlined" fullWidth />
          <CustomFormLabel htmlFor="name">User name</CustomFormLabel>
          <CustomTextField value={userName} onChange={(e)=> setUserName(e.target.value)} id="name" variant="outlined" fullWidth />
          <CustomFormLabel htmlFor="password">Password</CustomFormLabel>
          <CustomTextField value={password} onChange={(e)=> setPassword(e.target.value)} id="password" variant="outlined" fullWidth />
        </Stack>
        <Button
          color="primary"
          variant="contained"
          size="large"
          fullWidth
          onClick={registerExec}
        >
          Sign Up
        </Button>
      </Box>
      {subtitle}
    </>
  );
};

export default AuthRegister;
