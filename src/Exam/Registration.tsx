import PropTypes from "prop-types";
import { Formik, Field, Form } from "formik";
import FancyButton from "../FancyButton";
import "../App.scss";
import "./Registration.scss";
import { useNavigate } from "react-router-dom";

/**
 * This is the Registration Page component.
 * @param props
 * @returns 
 */
function Registration(props: any) {
  const { setCanDoExam, setRegistrationData } = props;
  let navigate = useNavigate();

  let formikForm = (
    <div className="registrationForm">
      <h1 className="formHeader">Registration</h1>
      <Formik
        initialValues={{ fName: "", lName: "", email: "", gender: "Male" }}
        onSubmit={(values) => {
          setRegistrationData(values);
          setCanDoExam(true);
          navigate("/exam", { replace: true });
        }}
      >
        <Form>
          <Field
            required
            name="fName"
            className="formField"
            type="text"
            placeholder="First Name"
          />
          <Field
            required
            name="lName"
            className="formField"
            type="text"
            placeholder="Last Name"
          />
          <Field
            required
            name="email"
            className="emailFormField"
            type="email"
            placeholder="Email"
          />
          <Field name="gender" className="formField" as="select">
            <option value="Male">{"Male"}</option>
            <option value="Female">{"Female"}</option>
          </Field>
          <br />
          <FancyButton buttonText={"Register"} isSubmit={true} />
        </Form>
      </Formik>
    </div>
  );

  return formikForm;
}

Registration.propTypes = {
  setCanDoExam: PropTypes.func,
  setRegistrationData: PropTypes.func,
};

export default Registration;
