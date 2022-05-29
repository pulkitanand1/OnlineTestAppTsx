import "./App.scss";
import "./Common.scss";
import { Suspense, lazy, useState } from "react";
import PropTypes from "prop-types";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import RegistrationData from "./dataTypes/RegistrationData";

/**This is the app component - the very fist component displayed upon render. */
function App() {
  // Use this value to toggle testing.
  let canDoExamWithoutRegister: boolean = false;
  const [canDoExam, setCanDoExam] = useState(canDoExamWithoutRegister);
  const [registrationData, setRegistrationData] = useState(
    {} as RegistrationData
  );
  const Registration = lazy(() => import("./components/exam/Registration"));
  const Exam = lazy(() => import("./components/exam/Exam"));

  /** This component controls access to Exam component on the basis of state value canDoExam */
  const ProtectedRoute = (props: any) => {
    const { canBeRedirected, redirectPath, children } = props;
    if (canBeRedirected) {
      return <Navigate to={redirectPath} replace />;
    }
    return children;
  };

  ProtectedRoute.propTypes = {
    canBeRedirected: PropTypes.bool,
    redirectPath: PropTypes.string,
    children: PropTypes.object,
  };

  /** Returns control back to home with the help of state. */
  function navigateToHome() {
    setCanDoExam(false);
  }

  function handleLogOut() {
    setCanDoExam(false);
    setRegistrationData({} as RegistrationData);
  }

  const registrationPassThruProps = { setCanDoExam, setRegistrationData };

  const examProps = {
    navigateAfterTestEnd: navigateToHome,
    registrationData,
    handleLogOut,
  };
  return (
    <div>
      <div className="onlineTestAppHeader" data-testid="testAppHeader">
        Online Test App
      </div>
      <Router>
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route
              path="/"
              element={
                <Registration
                  {...registrationPassThruProps}
                  data-testid="registration"
                />
              }
            />
            <Route
              path="/exam"
              element={
                <ProtectedRoute
                  canBeRedirected={
                    !canDoExam && registrationData.fName === undefined
                  }
                  redirectPath="/"
                >
                  <Exam {...examProps} />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Suspense>
      </Router>
    </div>
  );
}

export default App;
