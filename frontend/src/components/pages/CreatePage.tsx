import React from "react";
import CreateForm from "../crud/CreateForm";
import MainPageButton from "../common/MainPageButton";
import TestApi from "../crud/TestApi";

const CreatePage = (): React.ReactElement => {
  return (
    <div style={{ textAlign: "center", width: "25%", margin: "0px auto" }}>
      <h1>Default Page</h1>
      <TestApi />
      <MainPageButton />
      <CreateForm />
    </div>
  );
};

export default CreatePage;
