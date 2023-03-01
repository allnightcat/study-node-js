import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { auth } from "../_actions/user_action";
import { useNavigate } from "react-router-dom";

const Auth = (SpecificComponent, option, adminRouter) => {
  //option 값 정의
  // null : 로그인 상관없이 모두가 이용 가능한 페이지
  // true: 로그인한 유저만 사용 가능한 페이지
  // false: 로그인한 유저는 사용 불가능한 페이지

  function AuthenticationCheck(props) {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
      dispatch(auth()).then((response) => {
        console.log(response);
        if (!response.payload.isAuth) {
          // 로그인 안 한 상태
          if (option) {
            navigate("/login");
          }
        } else {
          // 로그인 한 상태
          if (adminRouter && !response.payload.isAdmin) {
            navigate("/");
          } else if (option === false) {
            navigate("/");
          }
        }
      });
    }, []);

    return <SpecificComponent />;
  }

  return <AuthenticationCheck />;
};

export default Auth;
