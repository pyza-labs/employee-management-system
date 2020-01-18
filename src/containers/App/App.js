import React, { useState, useEffect, Fragment } from "react";
import "./App.css";
import LoginPage from "../LoginPage/LoginPage";
import Navbar from "../../components/Navbar/Navbar";
import firebase from "../../services/firebase/firebase";
import HomeScreen from "../HomeScreen/HomeScreen";
import { Router, navigate } from "@reach/router";
import SignUp from "../SignUp/SignUp";
import ErrorPage from "../../components/ErrorPage/ErrorPage";

function App() {
  // const [isLogin = false, setIsLogin] = useState();
  const [fireUser = "", setFireUser] = useState();

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged(firebaseUser => {
      if (firebaseUser) {
        console.log(firebaseUser);
        // setIsLogin(true);
        setFireUser(firebaseUser);
      } else {
        console.log("Not Logged In");
        // setIsLogin(false);
        setFireUser("");
      }
    });
    return unsubscribe;
  }, []);

  const logoutHandler = () => {
    firebase.auth().signOut();
    alert("Logged Out Successfully");
    navigate("http://localhost:3000/");
  };

  return (
    <Fragment>
      <div className="App">
        <Navbar logout={logoutHandler} />
        <Router>
          <LoginPage fireuser={fireUser} path="/" />
          <SignUp path="signUp"></SignUp>
          <ErrorPage path="error404"></ErrorPage>
          <HomeScreen
            fireuser={fireUser}
            path={`homeScreen/${fireUser}`}
          ></HomeScreen>
        </Router>
      </div>
    </Fragment>
  );
}

export default App;
