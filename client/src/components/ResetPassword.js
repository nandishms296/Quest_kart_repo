import { useState } from "react";
import { Link } from "react-router-dom";
import { useResetPasswordMutation } from "state/apiSlice";
import { useFormik } from "formik";
import * as Yup from "yup";

const styles = {
  cssTitle: {
    minWidth: "483px",
    marginTop: "-10.5px",
    backgroundColor: "#07eded",
    marginLeft: "-10px",
    color: "rgb(36 7 58)",
    minHeight: "45px",
    paddingTop: "7px",
    paddingLeft: "5px",
    borderTopLeftRadius: "4px",
    borderTopRightRadius: "4px",
  },
  sectionCss: {
    border: "0px solid black",
    padding: "10px",
    width: "50%",
    maxWidth: "483px",
    minHeight: "300px",
    marginTop: "60px",
    borderRadius: "4px",
    backgroundColor: "#fff",
    color: "rgba(0, 0, 0, 0.87)",
    boxShadow:
      "0px 11px 15px -7px rgba(0,0,0,0.2), 0px 24px 38px 3px rgba(0,0,0,0.14), 0px 9px 46px 8px rgba(0,0,0,0.12)",
    marginLeft: "450px",
  },
  btnChangePwd: {
    fontFamily: "Inter,sans-serif",
    fontSize: "14px",
    fontWeight: "800",
    borderRadius: "6px",
    border: "1px solid green",
    boxshadow: "grey 0px 0px 5px",
    backgroundColor: "rgb(0, 72, 190)",
    color: "#FFFFFF",
    textTransform: "upper",
    lineHeight: 1.5,
    padding: "7px 9px",
    minHeight: "38px",
    marginLeft: "282px",
  },
  lblTextCss: {
    color: "#121212",
    fontSize: "14px",
    fontFamily: "Inter,sans-serif",
    fontWeight: 600,
    marginLeft: "30px",
  },

  txtInput: {
    minHeight: "34px",
    paddingTop: "10px",
    minWidth: "385px",
    marginLeft: "30px",
    borderRadius: "10px",
    border: "1px solid #584d83",
  },
  errorMsg: {
    fontWeight: "600",
    marginLeft: "35px",
    color: "#fd0303",
    fontSize: "12px",
    fontFamily: "Inter,sans-serif",
    fontStyle: "italic",
  },
  btnSignIn: {
    marginTop: "35px",
    backgroundColor: "rgb(18, 217, 116)",
    color: "rgb(26, 115, 232)!important",
    maxWidth: "74px",
    minHeight: "40px",
    fontSize: "13px",
    lineHeight: "2.5rem",
    paddingLeft: "12px",
    borderRadius: "8px",
    marginLeft: "31px",
    fontWeight: "600",

    // color: rgb(26, 115, 232);
    // line-height: 1.5;
    // margin-left: 5px;
  },
  resetdiv: { marginTop: "-40px" },
};

function ResetPassword() {
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [resetPassword, { loading }] = useResetPasswordMutation();

  const formik = useFormik({
    initialValues: {
      newPassword: "",
      confirmPassword: "",
    },
    validationSchema: Yup.object({
      newPassword: Yup.string()
        .min(8, "Must be 8 characters or more")
        .required("Required"),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("newPassword")], "Passwords do not match")
        .required("Required"),
    }),
    onSubmit: async (values) => {
      try {
        const response = await resetPassword({
          resetLink: window.location.pathname.split("/").pop(),
          newPass: values.newPassword,
        });
        setMessage(response.data.message);
        setError("");
        alert("Password updated successfully");
      } catch (err) {
        setMessage(
          err.response?.data?.error || "Incorrect token or it is expired"
        );
        alert("Incorrect token or it is expired");
      }
    },
  });

  return (
    // { display: "flex", justifyContent: "center" }
    <section style={styles.sectionCss}>
      {/* <div
        style={{
          border: "1px solid black",
          padding: "20px",
          width: "50%",
          maxWidth: "500px",
        }}
      > */}
      <h2>Reset Password</h2>
      <form onSubmit={formik.handleSubmit}>
        <label style={styles.lblTextCss}>New Password: </label>
        <input
          type="password"
          name="newPassword"
          value={formik.values.newPassword}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          style={styles.txtInput}
        />
        {formik.touched.newPassword && formik.errors.newPassword ? (
          <div style={styles.errorMsg}>{formik.errors.newPassword}</div>
        ) : null}

        <label style={styles.lblTextCss}>Confirm Password: </label>
        <input
          type="password"
          name="confirmPassword"
          value={formik.values.confirmPassword}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          style={styles.txtInput}
        />
        {formik.touched.confirmPassword && formik.errors.confirmPassword ? (
          <div style={styles.errorMsg}>{formik.errors.confirmPassword}</div>
        ) : null}

        <div>
          <div style={styles.btnSignIn}>
            <Link to="/">Sign In</Link>
          </div>

          <div style={styles.resetdiv}>
            <button
              type="submit"
              disabled={loading}
              style={styles.btnChangePwd}
            >
              Reset Password
            </button>
          </div>
        </div>
      </form>

      {message && <p>{message}</p>}
      {error && <p>{error}</p>}
      {/* </div> */}
    </section>
  );
}

export default ResetPassword;
