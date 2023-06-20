import { CssBaseline, ThemeProvider } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { useDispatch, useSelector } from "react-redux";
import { themeSettings } from "theme";
import { useMemo, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "pages/Layout";
import Dashboard from "pages/Dashboard";
import Tasks from "pages/Tasks";
import Programs from "pages/Programs";
import Projects from "pages/Projects";
import Pipelines from "pages/Pipelines";
import Connections from "pages/Connections";
import Users from "pages/Users";
import ChangePassword from "components/ChangePassword";
import ResetPassword from "components/ResetPassword";
import { checkAutoLogin } from "state/authService";
import UserAccess from "pages/UserAccess";
import Configuration from "pages/Configurations";
import ConfigurationDetails from "pages/ConfigurationDetails";
import ConfigurationOptions from "pages/ConfigurationOptions";
function App() {
  const mode = useSelector((state) => state.auth.mode);
  const dispatch = useDispatch();
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);

  useEffect(() => {
    checkAutoLogin(dispatch);
    // eslint-disable-next-line
  }, []);

  return (
    <div className="app">
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Routes>
            <Route
              path="/resetpassword/:resetLink"
              element={<ResetPassword />}
            />
            <Route element={<Layout />}>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/tasks" element={<Tasks />} />
              <Route path="/tasks/:id" element={<Tasks />} />
              <Route path="/programs" element={<Programs />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/projects/:id" element={<Projects />} />
              <Route path="/pipelines" element={<Pipelines />} />
              <Route path="/pipelines/:id" element={<Pipelines />} />
              <Route path="/connections" element={<Connections />} />
              <Route path="/users" element={<Users />} />
              <Route path="/UserAccess" element={<UserAccess />} />
			  <Route path="/configuration" element={<Configuration/>}/>
              <Route path="/configuration_details" element={<ConfigurationDetails/>}/>
              <Route path="/configuration_options" element={<ConfigurationOptions/>}/>
              <Route
                path="/changepassword/:login_id"
                element={<ChangePassword />}
              />
            </Route>
          </Routes>
        </ThemeProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
