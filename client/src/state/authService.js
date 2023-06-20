import { logOut, setCredentials } from "./authSlice";

export function saveTokenInLocalStorage(userDetails) {
  userDetails.expireDate = new Date(
    new Date().getTime() + userDetails.expiresIn * 1000
  );
  localStorage.setItem("userDetails", JSON.stringify(userDetails));
}

export function runLogoutTimer(dispatch, timer) {
  setTimeout(() => {
    dispatch(logOut());
  }, timer);
}

export function checkAutoLogin(dispatch) {
  const userDetailsString = localStorage.getItem("userDetails");
  let userDetails = "";
  if (!userDetailsString) {
    dispatch(logOut());
    return;
  }

  userDetails = JSON.parse(userDetailsString);
  let expireDate = new Date(userDetails.expireDate);
  let todaysDate = new Date();

  if (todaysDate > expireDate) {
    dispatch(logOut);
    return;
  }
  const { token, ...userInfo } = userDetails;
  dispatch(setCredentials({ user: userInfo, token }));

  const timer = expireDate.getTime() - todaysDate.getTime();
  runLogoutTimer(dispatch, timer);
}
