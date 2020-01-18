import React, { useState } from "react";
import Styles from "./SignUp.module.css";
import {
  Form,
  Input,
  Select,
  Checkbox,
  Button,
  Upload,
  Icon,
  message
} from "antd";
import {
  CountryDropdown,
  RegionDropdown
} from "react-indian-state-region-selector";
import firebase, { auth, cloud } from "../../services/firebase/firebase";
import { navigate } from "@reach/router";
import HomeScreen from "../HomeScreen/HomeScreen";

const { Option } = Select;

const SignUp = props => {
  const [confirmDirty = false, setConfirmDirty] = useState();
  const [state, setState] = useState();
  const [region, setRegion] = useState();
  const [role = "", setRole] = useState();
  const [email = "", setEmail] = useState();

  const uploadAttributes = {
    name: "file",
    customRequest: async ({ onError, onSuccess, file }) => {
      const storageRef = firebase.storage().ref();
      console.log("chocs");
      const metadata = {
        contentType: "image/jpeg"
      };
      const uploadTask = storageRef.child(
        `${role}/${email}/images/${file.name}`
      );
      try {
        const image = await uploadTask.put(file, metadata);
        onSuccess(null, image);
      } catch (error) {
        onError(error);
      }
    },
    headers: {
      authorization: "authorization-text"
    },
    onChange(info) {
      console.log("hi");
      if (info.file.status !== "uploading") {
        console.log(info.file, info.fileList);
      }
      if (info.file.status === "done") {
        message.success(`${info.file.name} file uploaded successfully`);
      } else if (info.file.status === "error") {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
    beforeUpload(file) {
      const isJpgOrPng =
        file.type === "image/jpeg" || file.type === "image/png";
      if (!isJpgOrPng) {
        message.error("You can only upload JPG/PNG file!");
      }
      const isLt1M = file.size / 1024 / 1024 < 1;
      if (!isLt1M) {
        message.error("Image must be smaller than 1MB!");
      }
      return isJpgOrPng && isLt1M;
    }
  };

  const selectState = val => {
    setState(val);
  };

  const selectRegion = val => {
    setRegion(val);
  };

  const handleSubmit = e => {
    e.preventDefault();
    props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        console.log("Received values of form: ", values);
        setRole(values.role);
        cloud
          .collection(values.role)
          .doc(values.email)
          .set({
            name: values.name,
            email: values.email,
            role: values.role,
            bio: values.bio,
            pan: values.pan,
            address: values.address,
            state: state,
            region: region
          })
          .then(function() {
            const promise = auth.createUserWithEmailAndPassword(
              values.email,
              values.confirm
            );
            promise.catch(error => console.log(error.message));
            alert("it's done");
            console.log("Written");
            navigate(`http://localhost:3000/homeScreen`);
          })
          .catch(function(error) {
            console.error("Error writing document: ", error);
          });
      } else {
        return alert("Please fill the fields marked with asterik");
      }
    });
  };

  const handleConfirmBlur = e => {
    const { value } = e.target;
    setConfirmDirty(confirmDirty || !!value);
  };

  const compareToFirstPassword = (rule, value, callback) => {
    const { form } = props;
    if (value && value !== form.getFieldValue("password")) {
      callback("Two passwords that you enter is inconsistent!");
    } else {
      callback();
    }
  };

  const validateToNextPassword = (rule, value, callback) => {
    const { form } = props;
    if (value && confirmDirty) {
      form.validateFields(["confirm"], { force: true });
    }
    callback();
  };

  const normFile = e => {
    console.log("Upload event:", e);
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };

  const { getFieldDecorator } = props.form;

  const formItemLayout = {
    labelCol: {
      xs: { span: 6 },
      sm: { span: 10 }
    },
    wrapperCol: {
      xs: { span: 2 },
      sm: { span: 6 }
    }
  };

  const tailFormItemLayout = {
    wrapperCol: {
      xs: {
        span: 24,
        offset: 0
      },
      sm: {
        span: 16,
        offset: 8
      }
    }
  };

  return (
    <div className={Styles.signup}>
      <Form {...formItemLayout} onSubmit={handleSubmit} className={Styles.form}>
        <Form.Item label="Name">
          {getFieldDecorator("name", {
            rules: [
              {
                required: true,
                message: "Please input your Name!"
              }
            ]
          })(<Input />)}
        </Form.Item>
        <Form.Item label="E-mail">
          {getFieldDecorator("email", {
            rules: [
              {
                type: "email",
                message: "The input is not valid E-mail!"
              },
              {
                required: true,
                message: "Please input your E-mail!"
              }
            ]
          })(
            <Input
              onChange={event => {
                return setEmail(event.target.value);
              }}
            />
          )}
        </Form.Item>
        <Form.Item label="Password" hasFeedback>
          {getFieldDecorator("password", {
            rules: [
              {
                required: true,
                message: "Please input your password!"
              },
              {
                validator: validateToNextPassword
              }
            ]
          })(<Input.Password />)}
        </Form.Item>
        <Form.Item label="Confirm Password" hasFeedback>
          {getFieldDecorator("confirm", {
            rules: [
              {
                required: true,
                message: "Please confirm your password!"
              },
              {
                validator: compareToFirstPassword
              }
            ]
          })(<Input.Password onBlur={handleConfirmBlur} />)}
        </Form.Item>
        <Form.Item label="Role">
          {getFieldDecorator("role", {
            rules: [
              {
                required: true,
                message: "Select Role"
              }
            ]
          })(
            <Select
              placeholder="Please Select your Role"
              onChange={event => {
                return setRole(event);
              }}
            >
              <Option value="hr">HR</Option>
              <Option value="accounts">Accounts</Option>
              <Option value="employee">Employee</Option>
            </Select>
          )}
        </Form.Item>
        <Form.Item label="Upload Pic" extra="Max Size 1MB">
          {getFieldDecorator("upload", {
            valuePropName: "fileList",
            getValueFromEvent: normFile
          })(
            <Upload {...uploadAttributes}>
              <Button>
                <Icon type="upload" /> Click to Upload
              </Button>
            </Upload>
          )}
        </Form.Item>
        <Form.Item label="Bio">
          {getFieldDecorator("bio", {
            rules: [
              {
                required: false,
                message: "!!!"
              }
            ]
          })(<Input.TextArea />)}
        </Form.Item>
        <Form.Item label="Address">
          {getFieldDecorator("address", {
            rules: [
              {
                required: true,
                message: "Please input your Permanent Address"
              }
            ]
          })(<Input.TextArea />)}
        </Form.Item>
        <Form.Item label="Residence">
          {getFieldDecorator("residence", {
            rules: [
              {
                required: true,
                message: "Please input your Permanent Address"
              }
            ]
          })(
            <div>
              <CountryDropdown
                value={state}
                onChange={val => selectState(val)}
              />
              <RegionDropdown
                country={state}
                value={region}
                onChange={val => selectRegion(val)}
              />
            </div>
          )}
        </Form.Item>
        <Form.Item label="Pan Number">
          {getFieldDecorator("pan", {
            rules: [
              { required: true, message: "Please input your Pan number!" }
            ]
          })(<Input style={{ width: "100%" }} />)}
        </Form.Item>
        <Form.Item {...tailFormItemLayout}>
          {getFieldDecorator("agreement", {
            valuePropName: "checked"
          })(
            <Checkbox>
              I have read the <a href="">agreement</a>
            </Checkbox>
          )}
        </Form.Item>
        <Form.Item {...tailFormItemLayout}>
          <Button type="primary" htmlType="submit">
            Register
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Form.create()(SignUp);
