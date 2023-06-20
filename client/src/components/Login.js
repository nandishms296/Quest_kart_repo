import Close from "@mui/icons-material/Close";
import {
  Box,
  TextField,
  Button,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Typography,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { setOpenLogin, setCredentials } from "../state/authSlice";
import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  useLoginMutation,
  useRegisterUserMutation,
  useForgetPasswordMutation,
} from "../state/apiSlice";
import { saveTokenInLocalStorage, runLogoutTimer } from "state/authService";

const LoginForm = (props) => {
  const { handleLoginInput, loginRef, handlePwdInput, passRef } = props;
  return (
    <>
      <TextField
        autoFocus
        label="User Name"
        variant="outlined"
        type="text"
        name="login_id"
        onChange={handleLoginInput}
        inputRef={loginRef}
        sx={{ gridColumn: "span 4" }}
        autoComplete="off"
        required
      />
      <TextField
        label="Password"
        variant="outlined"
        type="password"
        name="password"
        onChange={handlePwdInput}
        inputRef={passRef}
        sx={{ gridColumn: "span 4" }}
        autoComplete="off"
        required
      />
    </>
  );
};

const RegisterForm = (props) => {
  const {
    handleFullNameInput,
    nameRef,
    handleEmailInput,
    emailRef,
    handleLoginInput,
    loginRef,
    handlePwdInput,
    passRef,
    handleConfimPwdInput,
    confirmPassRef,
  } = props;
  return (
    <>
      <TextField
        autoFocus
        label="Full Name"
        variant="outlined"
        type="text"
        name="full_name"
        onChange={handleFullNameInput}
        inputRef={nameRef}
        sx={{ gridColumn: "span 4" }}
        autoComplete="off"
        required
      />
      <TextField
        label="Email"
        variant="outlined"
        type="text"
        name="user_email"
        onChange={handleEmailInput}
        inputRef={emailRef}
        sx={{ gridColumn: "span 4" }}
        autoComplete="off"
        required
      />
      <TextField
        autoFocus
        label="User Name"
        variant="outlined"
        type="text"
        name="login_id"
        onChange={handleLoginInput}
        inputRef={loginRef}
        sx={{ gridColumn: "span 4" }}
        autoComplete="off"
        required
      />
      <TextField
        label="Password"
        variant="outlined"
        type="password"
        name="password"
        onChange={handlePwdInput}
        inputRef={passRef}
        sx={{ gridColumn: "span 4" }}
        autoComplete="off"
        required
      />
      <TextField
        label="Confirm Password"
        variant="outlined"
        type="password"
        name="confirmPassword"
        onChange={handleConfimPwdInput}
        inputRef={confirmPassRef}
        sx={{ gridColumn: "span 4" }}
        autoComplete="off"
        required
      />
    </>
  );
};

const ForgetPasswordForm = (props) => {
  const { handleEmailInput, emailRef } = props;

  return (
    <TextField
      label="Email"
      variant="outlined"
      type="text"
      name="user_email"
      onChange={handleEmailInput}
      inputRef={emailRef}
      sx={{ gridColumn: "span 4" }}
      autoComplete="off"
      required
    />
  );
};

const Login = () => {
  const loginRef = useRef();
  const passRef = useRef();
  const nameRef = useRef();
  const confirmPassRef = useRef();
  const emailRef = useRef();
  const errRef = useRef();

  const [title, setTitle] = useState("");
  const [formType, setFormType] = useState(0);
  const [loginId, setLoginId] = useState("");
  const [pwd, setPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [errMsg, setErrMsg] = useState("");

  const navigate = useNavigate();

  const [login, { isLoading }] = useLoginMutation();
  const [registerUser] = useRegisterUserMutation();
  const [forgotPassword] = useForgetPasswordMutation();
  const dispatch = useDispatch();
  const openLogin = useSelector((state) => state.auth.openLogin);

  /* Css Start fot the control */

  const styles = {
    infoMsg: { color: "navy" },
    errorMsgCss: {
      marginLeft: "40px",
      fontSize: "14px",
      fontWeight: "bold",
      paddingBottom: "18px!important",
    },
    formCss: { width: "400px!important", marginLeft: "70px!important" },
    loginBtnBg: {
      fontSize: "14px",
      fontWeight: "800",
      borderRadius: "6px",
      //boxshadow: "grey 0px 0px 5px!important",
      backgroundColor: "rgb(0, 72, 190)",
      color: "#FFFFFF",
      textTransform: "upper",
      lineHeight: 1.5,
      width: "80px!important",
      position: "absolute",
      zIndex: "1",
      // marginLeft: "322px",
      // marginTop: "-35px",
      marginLeft: "184px",
      marginTop: "0px",
    },
    forgetCss: {
      color: "#1a73e8!important",
      fontWeight: "bold",
      fontSize: "14px",
      marginLeft: "40px",
      marginBottom: "15px",
      marginTop: "20px",
    },
    loginDiv: { marginLeft: "200px", width: "85px", marginBottom: "-30px" },
    btnTextCss: {
      fontSize: "13px",
      fontWeight: "600",
      color: "rgb(26,115,232)",
      textTransform: "upper",
      lineHeight: 1.5,
      marginLeft: "5px",
      //  width:"200px",
    },
    btnSubmitBg: {
      fontSize: "14px",
      fontWeight: "800",
      borderRadius: "6px",
      //boxshadow: "grey 0px 0px 5px!important",
      backgroundColor: "rgb(0, 72, 190)",
      color: "#FFFFFF",
      textTransform: "upper",
      lineHeight: 1.5,
      width: "80px!important",
      position: "absolute",
      zIndex: "1",
      marginLeft: "-72px",
      marginTop: "59PX",
      // marginleft: "78px",
      // margintop: "59px"
    },
    btnRegistration: {
      fontSize: "14px",
      fontWeight: "800",
      borderRadius: "6px",
      //boxshadow: "grey 0px 0px 5px!important",
      backgroundColor: "rgb(0, 72, 190)",
      color: "#FFFFFF",
      textTransform: "upper",
      lineHeight: 1.5,
      width: "80px!important",
      position: "absolute",
      zIndex: "1",
      // marginLeft: "100px",
      marginLeft: "-84px",
      marginTop: "55px",
    },
  };

  /* End of Css  */

  useEffect(() => {
    switch (formType) {
      case 0:
        setTitle("Login");
        break;
      case 1:
        setTitle("Register");
        break;
      case 2:
        setTitle("Forget Password");
        break;
      default:
        break;
    }
  }, [formType]);

  useEffect(() => {
    setErrMsg("");
  }, [loginId, pwd]);

  const handleLoginInput = (e) => setLoginId(e.target.value);
  const handlePwdInput = (e) => setPwd(e.target.value);
  const handleConfimPwdInput = (e) => setConfirmPwd(e.target.value);
  const handleFullNameInput = (e) => setFullName(e.target.value);
  const handleEmailInput = (e) => setEmail(e.target.value);

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    switch (formType) {
      case 0:
        console.log("Login Values: ", loginRef.current.value);
        console.log("Password Values: ", passRef.current.value);
        try {
          const userData = await login({
            login_id: loginId,
            password: pwd,
          }).unwrap();
          let { token, ...userInfo } = userData;
          let { ...userTokenDetails } = userData;
          dispatch(setCredentials({ user: userInfo, token }));
          saveTokenInLocalStorage(userTokenDetails);
          runLogoutTimer(dispatch, userData.expiresIn * 1000);
          setLoginId("");
          setPwd("");
          handleClose();
          navigate("/dashboard");
        } catch (err) {
          if (err.status === 400) {
            setErrMsg("Incorrect Username or Password");
          } else if (err.status === 401) {
            setErrMsg("Unauthorized");
          } else if (!err?.status) {
            // isLoading: true until timeout occurs
            setErrMsg("No Server Response");
          } else {
            setErrMsg("Login Failed");
          }
          errRef.current.focus();
        }
        break;
      case 1:
        if (pwd !== confirmPwd) {
          setErrMsg("Password fo not Match.");
        } else {
          try {
            const userSaved = await registerUser({
              full_name: fullName,
              login_id: loginId,
              password: pwd,
              user_email: email,
              user_phone: "",
            });
            console.log(`User: ${userSaved.login_id} saved.`);
          } catch (err) {
            setErrMsg("User Registration Failed");
          }
          errRef.current.focus();
        }
        break;
      case 2:
        try {
          const { data } = await forgotPassword({
            user_email: email,
            CLIENT_URL: window.location.origin,
          });
          setErrMsg(data.message);
          setEmail("");
        } catch (err) {
          setErrMsg(err.data?.error || "User with this email does not exist");
          alert(
            "User with this email does not exist. An email has been sent to the admin for further action"
          );
        }
        break;
      default:
        break;
    }
  };

  const handleClose = () => {
    dispatch(setOpenLogin({ openLogin: false }));
  };

  function simulateSwitch(param) {
    switch (param) {
      case 0:
        return (
          <form onSubmit={handleFormSubmit}>
            {/* styles={styles.formCss} */}
            <LoginForm
              handleLoginInput={handleLoginInput}
              loginRef={loginRef}
              handlePwdInput={handlePwdInput}
              passRef={passRef}
            />

            {/* <Box sx={{ gridColumn: "span 4" }}> */}
            <Box>
              <Button
                title="Don't you have an account? Create one now!"
                sx={{ width: "120px" }}
                onClick={() => setFormType(1)}
                style={styles.btnTextCss}
              >
                Register User
              </Button>
              <Button
                type="submit"
                style={styles.loginBtnBg}
                disabled={isLoading}
              >
                Login
              </Button>
              {/* </div> */}
            </Box>
            <Box>
              <Button
                title="Forgot Password. Check here to"
                sx={{ width: "160px" }}
                onClick={() => setFormType(2)}
                style={styles.btnTextCss}
              >
                {/* Reset Password */}
                Forget Password ?
              </Button>
            </Box>
          </form>
        );
      case 1:
        return (
          <form onSubmit={handleFormSubmit}>
            <RegisterForm
              handleFullNameInput={handleFullNameInput}
              nameRef={nameRef}
              handleEmailInput={handleEmailInput}
              emailRef={emailRef}
              handleLoginInput={handleLoginInput}
              loginRef={loginRef}
              handlePwdInput={handlePwdInput}
              passRef={passRef}
              handleConfimPwdInput={handleConfimPwdInput}
              confirmPassRef={confirmPassRef}
            />
            <Button
              type="submit"
              disabled={isLoading}
              style={styles.btnRegistration}
            >
              Register
            </Button>
            <Box>
              <Button
                onClick={() => setFormType(0)}
                sx={{ width: "80px", textAlign: "left" }}
                style={styles.btnTextCss}
                title="Do you have an Account?"
              >
                Sign in
              </Button>
            </Box>
            <Box>
              <Button
                Title="Forgot Password. Check here to reset"
                onClick={() => setFormType(2)}
                sx={{ width: "150px" }}
                style={styles.btnTextCss}
              >
                Reset Password
              </Button>
            </Box>
          </form>
        );
      case 2:
        return (
          <form onSubmit={handleFormSubmit}>
            <ForgetPasswordForm
              sx={{ width: "350px" }}
              handleEmailInput={handleEmailInput}
              emailRef={emailRef}
            />
            <Button
              type="submit"
              style={styles.btnSubmitBg}
              disabled={isLoading}
            >
              Submit
            </Button>
            <Box sx={{ gridColumn: "span 4" }}>
              <Typography></Typography>
              <Button
                onClick={() => setFormType(0)}
                Title="Do you have an Account?"
                style={styles.btnTextCss}
              >
                Sign in
              </Button>
            </Box>
          </form>
        );
      default:
        return <></>;
    }
  }

  return (
    <Dialog open={openLogin} onClose={handleClose}>
      <DialogTitle>
        {title}
        <IconButton
          sx={{ position: "absolute", top: 8, right: 8, color: "secondary" }}
          onClick={handleClose}
        >
          <Close />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <DialogContentText>
          {isLoading ? (
            <h1>Login in ...</h1>
          ) : (
            <p>Please fill your Information in the fields below. </p>
          )}
        </DialogContentText>
        <div style={styles.errorMsgCss}>
          <p
            ref={errRef}
            className={errMsg ? "errmsg" : "offscreen"}
            aria-live="assertive"
          >
            {errMsg}
          </p>
        </div>
        <Box
          display="grid"
          gap="20px"
          sx={{ marginLeft: "25px" }}
          // gridTemplateColumns="repeat(4, minmax(0, 1fr))"
        >
          {/* <p
            ref={errRef}
            className={errMsg ? "errmsg" : "offscreen"}
            aria-live="assertive"
          >
            {errMsg}
          </p> */}

          {simulateSwitch(formType)}
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default Login;
