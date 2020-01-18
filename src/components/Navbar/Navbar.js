import React from "react";
import Styles from "./Navbar.module.css";
import { PageHeader, Dropdown, Button, Menu } from "antd";

const Navbar = props => {
  const menu = (
    <Menu>
      <Menu.Item onClick={props.logout}>LogOut</Menu.Item>
      <Menu.Item>{props.user}</Menu.Item>
    </Menu>
  );

  return (
    <div className={Styles.nav}>
      <PageHeader
        style={{
          border: "1px solid rgb(235, 237, 240)",
          flex: 1
        }}
        title="Pyza Labs"
        subTitle="Employee Management System"
      ></PageHeader>
      <Dropdown overlay={menu} placement="topRight">
        <Button
          style={{
            border: "1px solid rgb(235, 237, 240)",
            borderLeft: "0 none",
            height: "100%"
          }}
        >
          Menu
        </Button>
      </Dropdown>
    </div>
  );
};
export default Navbar;
