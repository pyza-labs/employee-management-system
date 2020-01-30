import React from "react";
import { Icon, Button, Switch, Table, Tag, Popconfirm, message } from "antd";
import { firestore } from "firebase";
const HrQuestionsTable = props => {
  const columns = [
    {
      title: "Questions",
      dataIndex: "question",
      key: "question"
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      render: (text, record, index) => {
        console.log(record.type);
        switch (record.type) {
          case "text":
            return <Tag color="#1446A0">{text.toUpperCase()}</Tag>;
          case "mcq":
            return <Tag color="#DB3069">{text.toUpperCase()}</Tag>;
          case "file":
            return <Tag color="#F5D547">{text.toUpperCase()}</Tag>;
          default:
            return <Tag color="#2374AB">{text.toUpperCase()} Default</Tag>;
        }
      }
    },
    {
      title: "Important",
      dataIndex: "important",
      key: "important",
      render: (text, record, index) => {
        return (
          <Switch
            checkedChildren={<Icon type="check" />}
            unCheckedChildren={<Icon type="close" />}
            defaultChecked={record.important}
            onChange={checked => {
              updateImportantHandler(checked, record.key);
            }}
          />
        );
      }
    },
    {
      title: "Action",
      dataIndex: "",
      key: "x",
      render: (text, record, index) => {
        return (
          <Popconfirm
            title="Are you sure delete this task?"
            onConfirm={() => deleteQuestionHandler(record.key)}
            onCancel={() => console.log("Delete Cancelled")}
            okText="Yes"
            cancelText="No"
          >
            <Button>Delete</Button>
          </Popconfirm>
        );
      }
    }
  ];

  const updateImportantHandler = (checked, docId) => {
    firestore()
      .collection("onboardingQuestions")
      .doc(docId)
      .update({
        important: checked
      })
      .then(() => {
        console.log("Document successfully updated!");
      })
      .catch(error => {
        // The document probably doesn't exist.
        console.error("Error updating document: ", error);
      });
  };

  const deleteQuestionHandler = docId => {
    firestore()
      .collection("onboardingQuestions")
      .doc(docId)
      .delete()
      .then(function() {
        console.log("Document successfully deleted!");
        message.success("Question deleted successfully");
      })
      .catch(function(error) {
        console.error("Error removing document: ", error);
      });
  };
  return (
    <Table
      columns={columns}
      dataSource={props.dataSource}
      loading={props.loading}
      pagination={false}
    ></Table>
  );
};
export default HrQuestionsTable;
