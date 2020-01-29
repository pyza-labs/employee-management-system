import React from "react";
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

// const upload = () => {
//   const uploadAttributes = {
//     name: "file",
//     customRequest: async ({ onError, onSuccess, file }) => {
//       const storageRef = firebase.storage().ref();
//       console.log("chocs");
//       const metadata = {
//         contentType: "image/jpeg"
//       };
//       const uploadTask = storageRef.child(
//         `${role}/${email}/images/${file.name}`
//       );
//       try {
//         const image = await uploadTask.put(file, metadata);
//         onSuccess(null, image);
//       } catch (error) {
//         onError(error);
//       }
//     },
//     headers: {
//       authorization: "authorization-text"
//     },
//     onChange(info) {
//       console.log("hi");
//       if (info.file.status !== "uploading") {
//         console.log(info.file, info.fileList);
//       }
//       if (info.file.status === "done") {
//         message.success(`${info.file.name} file uploaded successfully`);
//       } else if (info.file.status === "error") {
//         message.error(`${info.file.name} file upload failed.`);
//       }
//     },
//     beforeUpload(file) {
//       const isJpgOrPng =
//         file.type === "image/jpeg" || file.type === "image/png";
//       if (!isJpgOrPng) {
//         message.error("You can only upload JPG/PNG file!");
//       }
//       const isLt1M = file.size / 1024 / 1024 < 1;
//       if (!isLt1M) {
//         message.error("Image must be smaller than 1MB!");
//       }
//       return isJpgOrPng && isLt1M;
//     }
//   };
// };
