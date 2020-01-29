import React, { useState, useEffect } from "react";
import Styles from "./HrHome.module.css";
import { Layout, Menu, Icon } from "antd";
import ProgressBar from "./ProgressBar/ProgressBar";
import { firestore } from "firebase";
import HrQuestionsTable from "../../../components/HrQuestionsTable/HrQuestionTable";
import HrAddQuestion from "./HrAddQuestion/HrAddQuestion";

const { SubMenu } = Menu;
const { Content, Sider } = Layout;

const HrHome = props => {
  const [questions = [], setQuestions] = useState();
  const [onQuestions = true, setOnQuestions] = useState();
  const [progress = false, setProgress] = useState();

  const [selectedOption = "Questions", setSelectedOption] = useState();
  const [isLoading = true, setIsLoading] = useState();

  useEffect(() => {
    if (!props.orgCode) {
      return;
    }
    let unsubscribe = firestore()
      .collection("onboardingQuestions")
      .where("orgCode", "==", props.orgCode)
      .onSnapshot(
        querySnapshot => {
          const questions = querySnapshot.docs.map(doc => ({
            key: doc.id,
            ...doc.data()
          }));
          setQuestions(questions);
          console.log(questions);
          setIsLoading(false);
        },
        error => {
          alert("Error fetching the document");
          console.log(error);
        }
      );

    return unsubscribe;
  }, [props.orgCode]);

  const showQuestionsHandler = () => {
    setOnQuestions(true);
    setProgress(false);
    setSelectedOption("Questions");
  };

  const showProgressHandler = () => {
    setProgress(true);
    setOnQuestions(false);
    setSelectedOption("Progress");
  };

  return (
    <div className={Styles.hrHome}>
      <Layout>
        <Layout>
          <Sider
            width={200}
            style={{ background: "#fff" }}
            breakpoint="lg"
            collapsedWidth="0"
            onBreakpoint={broken => {
              console.log(broken);
            }}
            onCollapse={(collapsed, type) => {
              console.log(collapsed, type);
            }}
          >
            <Menu
              mode="inline"
              defaultSelectedKeys={["1"]}
              defaultOpenKeys={["sub1"]}
              style={{ height: "100%", borderRight: 0 }}
            >
              <SubMenu
                key="sub1"
                title={
                  <span>
                    <Icon type="user" />
                    Onboarding
                  </span>
                }
              >
                <Menu.Item key="1" onClick={showQuestionsHandler}>
                  Questions
                </Menu.Item>
                <Menu.Item key="2" onClick={showProgressHandler}>
                  Track Progress
                </Menu.Item>
              </SubMenu>
            </Menu>
          </Sider>
          <Layout style={{ padding: "0 24px 24px" }}>
            <h1 className={Styles.selectedOption}>{selectedOption}</h1>
            {onQuestions && (
              <Content className={Styles.content}>
                <HrAddQuestion
                  orgCode={props.orgCode}
                  questions={questions}
                  setQuestions={array => {
                    setQuestions(array);
                  }}
                />
                {questions.length !== 0 && (
                  <HrQuestionsTable
                    dataSource={questions}
                    loading={isLoading}
                  />
                )}
              </Content>
            )}
            {progress && (
              <ProgressBar
                totalQuestions={questions.length}
                orgCode={props.orgCode}
              />
            )}
          </Layout>
        </Layout>
      </Layout>
    </div>
  );
};
export default HrHome;
