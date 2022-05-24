import PropTypes from "prop-types";
import { Formik, Field, Form } from "formik";
import FancyButton from "../common/FancyButton";
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
        <Form className="regForm">
          <div className="formLine">
            <div className="formWrap">
              <label className="formLabel">First Name</label>
              <Field className="formField" required name="fName" type="text" />
            </div>
            <div className="formWrap">
              <label className="formLabel">Last Name</label>
              <Field required name="lName" className="formField" type="text" />
            </div>
          </div>

          <div className="formWrap">
            <label className="formLabel">Email</label>
            <Field
              required
              name="email"
              className="emailFormField"
              type="email"
            />
          </div>

          <div className="formWrap">
            <label className="formLabel">Gender</label>
            <Field name="gender" className="selectFormField" as="select">
              <option value="Male">{"Male"}</option>
              <option value="Female">{"Female"}</option>
            </Field>
          </div>
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
