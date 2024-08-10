import React, { useRef } from "react";

const RegisterFacultyForm = () => {
  const firstnameRef = useRef();
  const lastnameRef = useRef();
  const emailRef = useRef();
  const phonenumberRef = useRef();
  const studentidnumberRef = useRef();
  const passwordRef = useRef();
  const confirmpasswordRef = useRef();

  return (
    <div className="register-form-cotnainer">
      <h2>Faculty Registration Form</h2>
      <form>
        <input
          name="firstname"
          placeholder="First Name"
          type="text"
          ref={firstnameRef}
        />
        <input
          name="lastname"
          placeholder="Last Name"
          type="text"
          ref={lastnameRef}
        />
        <input name="email" placeholder="Email" type="email" ref={emailRef} />
        <input
          name="phonenumber"
          placeholder="Phone Number"
          type="tel"
          ref={phonenumberRef}
        />
        <input
          name="studentidnumber"
          placeholder="Faculty ID Number"
          type="text"
          ref={studentidnumberRef}
        />
        <input
          name="password"
          placeholder="Password"
          type="password"
          ref={passwordRef}
        />
        <input
          name="confirm-password"
          placeholder="Confirm Password"
          type="password"
          ref={confirmpasswordRef}
        />
        <button>Register Faculty</button>
      </form>
    </div>
  );
};

export default RegisterFacultyForm;
