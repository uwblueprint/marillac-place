import React from "react";
import { useNavigate } from "react-router-dom";
import { HOME_PAGE } from "../../constants/Routes";

const MainPageButton = (): React.ReactElement => {
  const navigate = useNavigate();
  const navigateTo = () => navigate(HOME_PAGE);
  return (
    <div>
      <button
        onClick={navigateTo}
        className="btn btn-primary"
        type="button"
        style={{ textAlign: "center" }}
      >
        Go Back
      </button>
    </div>
  );
};

export default MainPageButton;
