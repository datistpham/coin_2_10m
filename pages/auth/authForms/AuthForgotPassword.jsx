import { Button, Stack } from "@mui/material";
import Link from "next/link";

import CustomTextField from "../../../src/components/forms/theme-elements/CustomTextField";
import CustomFormLabel from "../../../src/components/forms/theme-elements/CustomFormLabel";
import { useState } from "react";
import useAuth from "../../../src/hooks2/useAuth";
import { getRecaptchaToken } from "../../../src/utils/recaptcha";
import { useSnackbar } from 'notistack'
import useIsMountedRef from "../../../src/hooks2/useIsMountedRef";

const AuthForgotPassword = () => {
  const [userName, setUserName] = useState("");
  const {forgot_password, recover_password }= useAuth()
  const { enqueueSnackbar } = useSnackbar();
  const {isMountedRef }= useIsMountedRef()  
  const [toggle, setToggle]= useState(false)
  const [code, setCode]= useState("")
  const [newPassword, setNewPassword]= useState("")
  const forgotPasswordExec= async ()=> {
    try {
      const res= await forgot_password(userName);
      console.log(res)
      if(res.data.ok=== false ) {
        enqueueSnackbar(res.data?.m, { variant: 'error' })

      }
      else if(res.data.ok=== true) {
        enqueueSnackbar(res.data?.m, { variant: 'success' })
        setToggle(()=> true)

      }
    } catch (error) { 
      console.error(error);
      enqueueSnackbar(error?.message, { variant: 'error' })
      if (useIsMountedRef?.current) {
        setError('afterSubmit', { ...error, message: error.message });
      }
    }
  }

  const resetPasswordExec= async ()=> {
    try {
      const res= await recover_password(userName, code, newPassword);
      console.log(res)
      if(res.data.ok=== false ) {
        enqueueSnackbar(res.data?.m, { variant: 'error' })

      }
      else if(res.data.ok=== true) {
        enqueueSnackbar(res.data?.m, { variant: 'success' })
        setToggle(()=> true)

      }
    } catch (error) { 
      console.error(error);
      enqueueSnackbar(error?.message, { variant: 'error' })
      if (useIsMountedRef.current) {
        setError('afterSubmit', { ...error, message: error.message });
      }
    }
  }
  return (
    <>
      <Stack mt={4} spacing={2}>
        {
          toggle=== false && 
          <>
            <CustomFormLabel htmlFor="reset-email">Username</CustomFormLabel>
            <CustomTextField value={userName} onChange={(e)=> setUserName(e.target.value)} id="reset-email" variant="outlined" fullWidth />
          </>
        }
        {
          toggle=== true && 
          <>
            <CustomFormLabel htmlFor="reset-email">Code</CustomFormLabel>
            <CustomTextField value={code} onChange={(e)=> setCode(e.target.value)} id="reset-email" variant="outlined" fullWidth />
            <CustomFormLabel htmlFor="reset-email">New password</CustomFormLabel>
            <CustomTextField value={newPassword} onChange={(e)=> setNewPassword(e.target.value)} id="reset-email" variant="outlined" fullWidth />
          </>
        }
        {
          toggle=== false && 
          <Button
            color="primary"
            variant="contained"
            size="large"
            fullWidth
            onClick={forgotPasswordExec}
          >
            Forgot Password
          </Button>
        }
        {
          toggle=== true && 
          <Button
            color="primary"
            variant="contained"
            size="large"
            fullWidth
            onClick={resetPasswordExec}
          >
            Confirm
          </Button>
        }
        <Button
          color="primary"
          size="large"
          fullWidth
          component={Link}
          href="/auth/auth1/login"
        >
          Back to Login
        </Button>
      </Stack>
    </>
  )
};

export default AuthForgotPassword;
