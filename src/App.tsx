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

function App() {
  // Use this value to toggle testing.
  let canDoExamWithoutRegister: boolean = false;
  const [canDoExam, setCanDoExam] = useState(canDoExamWithoutRegister);
  const [registrationData, setRegistrationData] = useState();
  const Registration = lazy(() => import("./Exam/Registration"));
  const Exam = lazy(() => import("./Exam/Exam"));

  const ProtectedRoute = (props: any) => {
    const { canDoExam, redirectPath, children } = props;
    if (canDoExam === false) {
      return <Navigate to={redirectPath} replace />;
    }
    return children;
  };

  ProtectedRoute.propTypes = {
    canDoExam: PropTypes.bool,
    redirectPath: PropTypes.string,
    children: PropTypes.object,
  };

  function navigateToHome() {
    setRegistrationData(undefined);
    setCanDoExam(false);
  }

  const registrationPassThruProps = { setCanDoExam, setRegistrationData };
  return (
    <div>
      <div className="onlineTestAppHeader">Online Test App</div>
      <Router>
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route
              path="/"
              element={<Registration {...registrationPassThruProps} />}
            />
            <Route
              path="/exam"
              element={
                <ProtectedRoute canDoExam={canDoExam} redirectPath="/">
                  <Exam
                    navigateAfterTestEnd={navigateToHome}
                    registrationData={registrationData}
                  />
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
