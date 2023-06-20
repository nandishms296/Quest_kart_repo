import React from "react";
import { useLocation, Link } from "react-router-dom";
import { useChangePasswordMutation } from "state/apiSlice";
import { Formik, Form, Field, ErrorMessage } from "formik";
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
  btnBack: {
    boxshadow: "grey 0px 0px 5px",
    backgroundColor: " rgb(225 203 203)",
    border: "0px solid white",
    borderRadius: "6px",
    minHeight: "35px",
    lineHeight: "2.4em",
    maxWidth: "70px",
    marginTop: "-35px",
    textAlign: "center",
    fontSize: "14px",
    fontWeight: "800",
    fontFamily: "Inter,sans-serif",
    marginBottom: "15px",
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
    marginLeft: "270px",
  },
  lblTextCss: {
    color: "#121212",
    fontSize: "14px",
    fontFamily: "Inter,sans-serif",
    fontWeight: 600,
    marginLeft: "30px",
  },
  lblConfirmTxtCss: {
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
};
const ChangePassword = () => {
  const location = useLocation();
  const login_id = location.pathname.split("/")[2].slice(0);

  const [errorMessage, setErrorMessage] = React.useState("");

  const [changePassword, { isLoading }] = useChangePasswordMutation();

  const initialValues = {
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  };

  const validationSchema = Yup.object().shape({
    oldPassword: Yup.string().required("Old password is required"),
    newPassword: Yup.string().required("New password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("newPassword"), null], "Passwords must match")
      .required("Confirm password is required"),
  });

  const handleSubmit = (values, { resetForm }) => {
    changePassword({ login_id, ...values })
      .unwrap()
      .then(() => {
        resetForm();
        setErrorMessage("");
        alert("Password updated successfully");
      })
      .catch((error) => {
        console.log(error);
        alert("Error occurred while updating password");
        setErrorMessage(
          error.response?.data?.message ||
            "Error occurred while updating password."
        );
      });
  };

  return (
    <section style={{ display: "flex", justifyContent: "center" }}>
      <div
        style={{
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
        }}
      >
        <h1 style={styles.cssTitle}>Change Password</h1>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ errors, touched }) => (
            <Form>
              <div>
                <label style={styles.lblTextCss}>Old Password</label>
              </div>
              <div>
                <Field
                  type="password"
                  name="oldPassword"
                  style={styles.txtInput}
                />
                <ErrorMessage
                  name="oldPassword"
                  component="div"
                  style={styles.errorMsg}
                  className="error-message"
                />
              </div>

              <div>
                <label style={styles.lblTextCss}>New Password</label>
                <Field
                  type="password"
                  name="newPassword"
                  style={styles.txtInput}
                />
                <ErrorMessage
                  name="newPassword"
                  component="div"
                  style={styles.errorMsg}
                  className="error-message"
                />
              </div>

              <div>
                <label style={styles.lblConfirmTxtCss}>Confirm Password</label>
                <Field
                  type="password"
                  name="confirmPassword"
                  style={styles.txtInput}
                />
                <ErrorMessage
                  name="confirmPassword"
                  component="div"
                  style={styles.errorMsg}
                  className="error-message"
                />
              </div>
              <br />

              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  style={styles.btnChangePwd}
                >
                  {isLoading ? "Loading..." : "Change Password"}
                </button>
              </div>
              {errorMessage && (
                <div style={{ color: "red" }}>{errorMessage}</div>
              )}
            </Form>
          )}
        </Formik>

        <div style={styles.btnBack}>
          <Link to="/">Back</Link>
        </div>
        {/* <span className="line">
          <Link to="/">Back</Link>
        </span> */}
      </div>
    </section>
  );
};

export default ChangePassword;
