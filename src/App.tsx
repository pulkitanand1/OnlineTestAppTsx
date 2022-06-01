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

  const intialRegState =
    localStorage.getItem("regData") === null
      ? ({} as RegistrationData)
      : (JSON.parse(
          localStorage.getItem("regData") as string
        ) as RegistrationData);
  const [registrationData, setRegistrationData] = useState(
    intialRegState as RegistrationData
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
    clearRegistrationData();
  }

  function clearRegistrationData() {
    setRegistrationData({} as RegistrationData);
  }

  function saveRegistrationData(regData: RegistrationData) {
    localStorage.setItem("regData", JSON.stringify(regData));
  }

  const registrationPassThruProps = { setCanDoExam, saveRegistrationData };

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
