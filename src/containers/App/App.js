import React, { useState, useEffect, Fragment } from "react";
import "./App.css";
import LoginPage from "../LoginPage/LoginPage";
import Navbar from "../../components/Navbar/Navbar";
import { Router, navigate } from "@reach/router";
import SignUp from "../SignUp/SignUp";
import ErrorPage from "../../components/ErrorPage/ErrorPage";
import EmployeeHome from "../Employee/EmployeeHome/EmployeeHome";
import HrHome from "../HR/HrHome/HrHome";
import { auth } from "firebase";
import { firestore } from "firebase";

const App = () => {
  const [fireUser = "", setFireUser] = useState();
  const [role = "", setRole] = useState();
  const [orgCode = "", setOrgCode] = useState();
  const [name = "", setName] = useState();

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(firebaseUser => {
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

  useEffect(() => {
    if (!fireUser.uid) {
      return;
    }
    const unsubscribe = firestore()
      .collection("users")
      .doc(fireUser.uid)
      .onSnapshot(doc => {
        if (doc.exists) {
          setName(doc.data().name);
          setRole(doc.data().role);
          setOrgCode(doc.data().orgCode);
        } else {
          console.log("SignUp in Progress");
        }
      });

    return unsubscribe;
  }, [fireUser]);

  const logoutHandler = () => {
    if (!fireUser) {
      return;
    }
    auth().signOut();
    alert("Logged Out Successfully");
    setRole("");
    setOrgCode("");
    setName("");
    navigate("http://localhost:3000/");
  };

  const homeSwitch = () => {
    switch (role) {
      case "hr":
        return <HrHome fireuser={fireUser} orgCode={orgCode} path="home" />;
      case "employee":
        return (
          <EmployeeHome fireuser={fireUser} orgCode={orgCode} path="home" />
        );
      default:
        return null;
    }
  };

  return (
    <Fragment>
      <div className="App">
        <Navbar logout={logoutHandler} name={name} />
        <Router>
          <LoginPage
            fireuser={fireUser}
            orgCode={orgCode}
            role={role}
            path="/"
          />
          <SignUp fireuser={fireUser} path="signup"></SignUp>
          {homeSwitch()}
          <ErrorPage path="error404"></ErrorPage>
        </Router>
      </div>
    </Fragment>
  );
};

export default App;
