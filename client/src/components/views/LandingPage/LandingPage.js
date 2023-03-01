import React, { useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function LandingPage() {
  const navigate = useNavigate();
  useEffect(() => {
    axios.get("/api/hello").then((response) => console.log(response.data));
  }, []);

  const onClickHandler = () => {
    axios.get("/api/users/logout").then((response) => {
      if (response.data.success) {
        alert("로그아웃되었습니다.");
        navigate("/login");
      } else {
        alert("로그아웃에 실패하였습니다.");
      }
    });
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height: "100vh",
      }}
    >
      <h1>시작 페이지</h1>
      <div>
        <button onClick={onClickHandler}>로그아웃</button>
      </div>
    </div>
  );
}

export default LandingPage;
