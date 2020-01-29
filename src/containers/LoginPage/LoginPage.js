import React, { useState, useEffect } from "react";
import Styles from "./LoginPage.module.css";
import { Input, Button, Skeleton } from "antd";
import { auth } from "firebase";
import { navigate, Link } from "@reach/router";

const LoginPage = props => {
  const [email = "", setEmail] = useState();
  const [pass = "", setPass] = useState();
  const [code = "", setCode] = useState();
  const [loading = false, setLoading] = useState();

  const emailHandler = event => {
    setEmail(event.target.value.trim());
  };

  const passHandler = event => {
    setPass(event.target.value);
  };

  const codeHandler = event => {
    setCode(event.target.value);
  };

  useEffect(() => {
    if (!props.orgCode) {
      return;
    }
    console.log(props.orgCode);
    if (props.orgCode === code) {
      if (props.role === "hr") {
        navigate("hrHome");
      } else if (props.role === "employee") {
        navigate("employeeHome");
      } else if (props.role === "accounts") {
        alert("Work in Progress");
      }
    } else {
      alert("Wrong Organisational Code");
      auth().signOut();
      navigate("error404");
    }
  }, [props.orgCode, props.role]);

  const loginHandler = async event => {
    setLoading(true);
    await auth()
      .signInWithEmailAndPassword(email, pass)
      .catch(error => alert(error.message));
  };

  const forgotPassHandler = () => {
    if (!email) {
      alert("No Email Entered");
      return;
    }
    auth()
      .sendPasswordResetEmail(email)
      .then(() => {
        alert("Email Sent");
      })
      .catch(error => {
        // An error happened.
      });
  };

  return (
    <div className={Styles.login}>
      <div className={Styles.inputDiv}>
        <Input
          placeholder="Email"
          className={Styles.input}
          onChange={emailHandler}
        ></Input>
        <Input.Password
          placeholder="Password"
          className={Styles.input}
          onChange={passHandler}
        ></Input.Password>
        <Input.Password
          placeholder="Organisation Code"
          className={Styles.input}
          onChange={codeHandler}
        ></Input.Password>
      </div>
      <div className={Styles.buttonDiv}>
        <Button
          loading={loading}
          className={Styles.button}
          onClick={loginHandler}
          disabled={!email || !pass || !code}
        >
          SignIn
        </Button>
        <Button className={Styles.button}>
          <Link to="signUp">SignUp</Link>
        </Button>
        <a className={Styles.forgot} onClick={forgotPassHandler} href>
          Forgot Password
        </a>
      </div>
    </div>
  );
};
export default LoginPage;
