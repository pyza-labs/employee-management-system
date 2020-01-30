import React from "react";
import Styles from "./Navbar.module.css";
import { PageHeader, Dropdown, Button, Menu, Avatar } from "antd";

const Navbar = props => {
  const menu = (
    <Menu>
      <Menu.Item onClick={props.logout}>LogOut</Menu.Item>
    </Menu>
  );

  return (
    <div className={Styles.nav}>
      <PageHeader
        className={Styles.pageHeader}
        title="Pyza Labs"
        subTitle="Employee Management System"
      ></PageHeader>
      <div className={Styles.subWrapper}>
        {props.name && (
          <div className={Styles.avatarWrapper}>
            <Avatar src="" />
            <span className={Styles.name}>{props.name}</span>
          </div>
        )}
        <Dropdown overlay={menu} placement="topRight">
          <Button className={Styles.button}>Menu</Button>
        </Dropdown>
      </div>
    </div>
  );
};
export default Navbar;
