import React, { useState } from "react";
import Styles from "./LoginPage.module.css";
import { Input, Button } from "antd";
import { auth } from "../../services/firebase/firebase";
import { navigate, Link } from "@reach/router";

const LoginPage = props => {
  const [email = "", setEmail] = useState();
  const [pass = "", setPass] = useState();
  const [code = "", setCode] = useState();

  const emailHandler = event => {
    setEmail(event.target.value);
  };

  const passHandler = event => {
    setPass(event.target.value);
  };

  const codeHandler = event => {
    setCode(event.target.value);
  };

  const loginHandler = event => {
    if (code === "0108") {
      const promise = auth.signInWithEmailAndPassword(email, pass);
      promise.catch(error => alert(error.message));
      navigate(`homeScreen/${props.fireuser}`);
    } else {
      alert("Wrong Organisational Code");
      navigate("error404");
    }
  };

  const forgotPassHandler = () => {
    if (!email) {
      alert("No Email Entered");
      return;
    }
    auth
      .sendPasswordResetEmail(email)
      .then(function() {
        alert("Email Sent");
      })
      .catch(function(error) {
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
        {email && pass && code ? (
          <Button className={Styles.button} onClick={loginHandler}>
            SignIn
          </Button>
        ) : (
          <Button className={Styles.button} onClick={loginHandler} disabled>
            SignIn
          </Button>
        )}
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
