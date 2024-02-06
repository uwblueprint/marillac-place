import React from "react";
import SimpleEntityCreateForm from "../crud/SimpleEntityCreateForm";
import MainPageButton from "../common/MainPageButton";
import TestButton  from "../crud/test";

const SimpleEntityCreatePage = (): React.ReactElement => {
  return (
    <div style={{ textAlign: "center", width: "25%", margin: "0px auto" }}>
      <h1>Default Page</h1>
      <MainPageButton />
      <TestButton />
      <SimpleEntityCreateForm />
    </div>
  );
};

export default SimpleEntityCreatePage;
