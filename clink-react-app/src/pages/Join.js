import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/Join.scss";
import { Link } from "react-router-dom";

const Join = () => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState({
    user_name: "",
    user_id: "",
    nick_name: "",
    password: "",
    confirmPwd: "",
    email: "",
    emailAuthNum: "",
  });
  const [authcode, setAuthcode] = useState("");
  const [warningPwd, setWarningPwd] = useState("");
  const [warningId, setWarningId] = useState("");
  const [warningEmail, setWarningEmail] = useState("");
  let confirmID;

  function handleInputChange(e) {
    const { name, value } = e.target;
    setUserInfo((prev) => ({ ...prev, [name]: value }));
    console.log(userInfo.email, userInfo.emailAuthNum, authcode);
  }

  useEffect(() => {
    if (userInfo.password !== userInfo.confirmPwd) {
      setWarningPwd("비밀번호가 일치하지 않습니다.");
    } else {
      setWarningPwd("");
    }
  }, [userInfo.password, userInfo.confirmPwd]);

  // useEffect(() => {
  //   let id = { user_id: userInfo.user_id };
  //   axios
  //     .post("http://localhost/clink/user/check-duplicate-id.do", id)
  //     .then((response) => {
  //       console.log(response.data);
  //       if (response.data === "success") {
  //         setWarningId("사용할 수 있는 아이디입니다.");
  //         confirmID = 1;
  //       } else if (response.data === "fail") {
  //         setWarningId("사용 중인 아이디입니다.");
  //         confirmID = 0;
  //       }
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //       setWarningId("다시 시도하세요");
  //     });
  // }, [userInfo.user_id]);

  // 아이디 중복체크
  function checkDuplicateId() {
    let id = { user_id: userInfo.user_id };
    axios
      .post("http://localhost:80/clink/user/check-duplicate-id.do", id)
      .then((response) => {
        console.log(response.data);
        if (response.data === "success") {
          setWarningId("사용할 수 있는 아이디입니다.");
        } else if (response.data === "fail") {
          setWarningId("사용 중인 아이디입니다.");
        }
      })
      .catch((error) => {
        console.log(error);
        setWarningId("다시 시도하세요");
      });
  }

  // 이메일 인증
  function handleEmailAuth() {
    console.log("이메일 주소:" + userInfo.email);
    alert(`${userInfo.email}로 인증번호가 전송되었습니다.`);
    let email = { params: { email: userInfo.email } };
    axios
      .post("http://localhost/clink/user/emailAuth.do", {}, email)
      .then((response) => {
        console.log(response.data);
        if (response.data) {
          setAuthcode(response.data.trim());
          if (authcode.trim() === userInfo.emailAuthNum.trim()) {
            setWarningEmail("인증번호가 일치합니다.");
          } else {
            setWarningEmail("인증번호가 일치하지 않습니다.");
          }
        } else {
          setWarningEmail("이메일 인증이 완료되지않았습니다.");
          setUserInfo((prev) => ({
            ...prev,
            email: "",
          }));
        }
      })
      .catch((error) => {
        console.log(error);
        setWarningId("다시 시도하세요");
      });
  }

  // 회원가입
  function handleSubmit(e) {
    // e.preventDefault();
    if (userInfo.user_id.trim() === "") {
      alert("아이디를 입력해주세요.");
    } else if (userInfo.password.trim() === "") {
      alert("비밀번호를 입력해주세요.");
    } else if (userInfo.user_name.trim() === "") {
      alert("이름을 입력해주세요.");
    } else if (userInfo.confirmPwd.trim() === "") {
      alert("비밀번호 확인을 입력해주세요.");
    } else {
      // let id = { user_id: userInfo.user_id };
      // axios
      //   .post("http://localhost:80/clink/user/check-duplicate-id.do", id)
      //   .then((response) => {
      //     console.log(response.data);
      // if (confirmID == 1) {
      setWarningId("사용할 수 있는 아이디입니다.");
      var param = {
        user_name: userInfo.user_name,
        user_id: userInfo.user_id,
        nick_name: userInfo.nick_name,
        password: userInfo.password,
        confirmPwd: userInfo.confirmPwd,
        email: userInfo.email,
      };

      // const accessToken = localStorage.getItem("accessToken");
      // console.log("accessToken:" + accessToken);
      // if (!accessToken) {
      // alert("로그인이 필요합니다.");
      // 로그인 페이지로 리다이렉트 또는 다른 처리를 수행
      // return;
      // }
      // 헤더에 답아서 API호출
      // const authHeader = { Authorization: `Bearer ${accessToken}` };
      console.log(param);
      axios
        .post(
          "http://localhost:80/clink/user/join.do",
          param
          // ,{ headers: authHeader,}
        )
        .then((response) => {
          // console.log(response.data);
          if (response.data) {
            alert("회원가입 되었습니다. 로그인해주세요.");
            navigate("/");
          } else {
            alert("다시 시도하세요");
          }
        })
        .catch((error) => {
          console.log(error);
          alert("회원가입에 실패했습니다.");
        });
      // } else {
      // setWarningId("사용 중인 아이디입니다.");
      // setUserInfo((prev) => ({
      //   ...prev,
      //   user_id: "",
      // }));
      // }
      // })
      // .catch((error) => {
      //   console.log(error);
      //   alert("다시 시도하세요");
      // });
    }
  }
  return (
    <div className="JoinContainer">
      <div id="backgroundCircle"></div>
      <form action="join.do" method="post">
        <div className="JoinTitle">
          <h1>회원가입</h1>
        </div>
        <div className="JoinInputBox">
          <Form.Control
            name="user_name"
            placeholder="이름*"
            className="joinInput"
            value={userInfo.user_name}
            onChange={handleInputChange}
          />
          <div></div>
          <InputGroup className="joinInput">
            <Form.Control
              name="user_id"
              placeholder="아이디*"
              value={userInfo.user_id}
              onChange={handleInputChange}
            />
          </InputGroup>
          <div>{warningId}</div>
          <Form.Control
            name="nick_name"
            placeholder="닉네임"
            className="joinInput"
            value={userInfo.nick_name}
            onChange={handleInputChange}
          />
          <div></div>
          <Form.Control
            type="password"
            name="password"
            placeholder="비밀번호*"
            className="joinInput"
            value={userInfo.password}
            onChange={handleInputChange}
          />
          <div></div>
          <Form.Control
            type="password"
            name="confirmPwd"
            placeholder="비밀번호 확인*"
            className="joinInput"
            value={userInfo.confirmPwd}
            onChange={handleInputChange}
          />
          <div>{warningPwd}</div>
          <InputGroup className="joinInput">
            <Form.Control
              placeholder="이메일*"
              type="email"
              name="email"
              value={userInfo.email}
              onChange={handleInputChange}
            />
            <Button
              variant="outline-secondary"
              id="JoinIdentifyBtn"
              onClick={() => handleEmailAuth()}
            >
              본인인증하기
            </Button>
          </InputGroup>
          <div></div>
          <Form.Control
            className="joinInput"
            type="text"
            name="emailAuthNum"
            placeholder="인증번호*"
            maxLength="9"
            value={userInfo.emailAuthNum}
            onChange={handleInputChange}
          />
        </div>
        <div>{warningEmail}</div>
      </form>
      <div className="JoinBtnBox">
        <Button
          variant="primary"
          className="LoginSubmitBtn"
          type="submit"
          onClick={() => handleSubmit()}
          onChange={handleInputChange}
        >
          회원가입하기
        </Button>
      </div>
      <Link to="/" style={{ textDecoration: "none" }}>
        <div className="JoinLoginBtn">로그인</div>
      </Link>
    </div>
  );
};

export default Join;
