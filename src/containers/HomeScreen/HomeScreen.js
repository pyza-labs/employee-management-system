import React from "react";
import Styles from "./HomeScreen.module.css";
const HomeScreen = props => {
  return (
    <div>
      <h1 className={Styles.head}>Welcome {props.fireuser.email}</h1>
    </div>
  );
};
export default HomeScreen;
