import React, { useState, useEffect, Fragment } from "react";
import Styles from "./EmployeeAnswerItem.module.css";
import { Input, message, Upload, Button, Icon, Radio, Tag } from "antd";
import { firestore, storage } from "firebase";
import debounce from "lodash.debounce";
// import { debounce } from 'lodash.debounce';
const EmployeeAnswerItem = props => {
  const [text, setText] = useState();
  const [radio = "", setRadio] = useState();

  useEffect(() => {
    if (!props.fireuser.uid || !props.question.question) {
      return;
    }
    let unsubscribe = firestore()
      .collection("users")
      .doc(props.fireuser.uid)
      .collection("onboardingAnswers")
      .doc(props.question.id)
      .onSnapshot(documentSnapshot => {
        const documentData = {
          ...documentSnapshot.data(),
          id: documentSnapshot.id
        };
        const { answer } = documentData;
        switch (props.question.type) {
          case "text":
            setText(answer);
            break;
          case "mcq":
            setRadio(answer);
            break;
          case "file":
            setText(answer);
            break;
          default:
        }
      });
    return unsubscribe;
  }, []);

  const debounceEvent = (...args) => {
    let debouncedEvent = debounce(...args);
    return event => {
      event.persist();
      return debouncedEvent(event);
    };
  };

  const firestoreData = text => {
    firestore()
      .collection("users")
      .doc(props.fireuser.uid)
      .collection("onboardingAnswers")
      .doc(props.question.id)
      .set(
        {
          question: props.question.question,
          answer: text
        },
        { merge: true }
      )
      .then(() => {
        console.log("Document successfully updated!");
        props.saveStatus(true);
      })
      .catch(error => {
        // The document probably doesn't exist.
        console.error("Error updating document: ", error);
      });
  };

  const inputHandler = event => {
    console.log(event.target.value);
    props.saveStatus(false);
    setText(event.target.value);
    firestoreData(event.target.value);
  };

  const radioHandler = event => {
    setRadio(event.target.value);
    props.saveStatus(false);
    firestoreData(event.target.value);
  };

  const uploadAttributes = {
    name: "file",
    customRequest: async ({ onError, onSuccess, file }) => {
      const storageRef = storage().ref();
      const metadata = {
        contentType: "image/jpeg" || "application/pdf"
      };
      const uploadTask = storageRef.child(
        `users/${props.fireuser.uid}/answer/${props.question.id}`
      );
      try {
        const image = await uploadTask.put(file, metadata);
        onSuccess(null, image);
        firestoreData("File Uploaded");
        props.saveStatus(true);
      } catch (error) {
        onError(error);
      }
    },
    headers: {
      authorization: "authorization-text"
    },
    onChange(info) {
      props.saveStatus(false);
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
        file.type === "image/jpeg" ||
        file.type === "image/png" ||
        file.type === "application/pdf";
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

  const render = () => {
    switch (props.question.type) {
      case "text":
        return (
          <div className={Styles.inputDiv}>
            <Input
              key={text}
              onChange={debounceEvent(inputHandler, 700)}
              className={Styles.input}
              defaultValue={text}
            ></Input>
          </div>
        );
      case "mcq":
        return (
          <div className={Styles.mcqOption}>
            <Radio.Group
              name="radiogroup"
              key={radio}
              onChange={radioHandler}
              defaultValue={radio}
            >
              {props.question.options.map((option, index) => {
                return (
                  <Radio value={option} key={index.toString()}>
                    {option}
                  </Radio>
                );
              })}
              ;
            </Radio.Group>
          </div>
        );
      case "file":
        return (
          <Fragment>
            <Upload {...uploadAttributes}>
              <Button>
                <Icon type="upload" /> Click to Upload
              </Button>
            </Upload>
            {text && (
              <Tag style={{ margin: "4px" }} color="green">
                File uploaded successfully
              </Tag>
            )}
          </Fragment>
        );
      default:
        return null;
    }
  };

  return render();
};

export default EmployeeAnswerItem;
