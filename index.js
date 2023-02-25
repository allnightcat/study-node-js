const express = require("express");
const app = express();
const port = 5000;
const { User } = require("./server/models/User");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const config = require("./server/config/key");
const { auth } = require("./server/middlewares/auth");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

const mongoose = require("mongoose");
const { json } = require("body-parser");
mongoose.set("strictQuery", true);
mongoose
  .connect(config.mongoURI, {})
  .then(() => console.log("MongoDB connedted!"))
  .catch((err) => console.log(err));

app.post("/api/users/register", (req, res) => {
  // cilent에서 받아온 회원 정보를 database에 넣는다.
  const user = new User(req.body);

  user.save((err, docs) => {
    if (err) return res.json({ success: false, err });
    return res.status(200).json({ success: true });
  });
});

app.post("/api/users/login", (req, res) => {
  // 요청한 이메일이 데이터베이스에 있는지 확인하기
  User.findOne({ email: req.body.email }, (err, userInfo) => {
    if (!userInfo) {
      return res.json({
        loginSuccess: false,
        message: "제공된 이메일에 일치하는 유저가 없습니다.",
      });
    } else {
      // 요청한 이메일이 데이터베이스에 있다면 비밀번호가 맞는지 확인하기
      userInfo.comparePassword(req.body.password, (err, isMatch) => {
        if (!isMatch) {
          return res.json({
            loginSuccess: false,
            message: "비밀번호가 틀렸습니다.",
          });
        } else {
          // 비밀번호가 맞다면 토큰 생성하기
          userInfo.generateToken((err, user) => {
            if (err) return json.status(400).send(err);
            // 토큰을 쿠키에 저장한다. (쿠키, 로컬 스토리지 etc...)
            else
              res.cookie("x_auth", user.token).status(200).json({
                loginSuccess: true,
                userId: user._id,
              });
          });
        }
      });
    }
  });
});

app.get("/api/users/auth", auth, (req, res) => {
  // 미들웨어 통과했다는 것은 Authentication이 성공적으로 끝났다는 것
  res.status(200).json({
    _id: req.user._id,
    isAdmin: req.user.role === 0 ? false : true,
    isAuth: true,
    email: req.user.email,
    lastname: req.user.lastname,
    role: req.user.role,
    image: req.user.image,
  });
});

app.get("/api/users/logout", auth, (req, res) => {
  User.findOneAndUpdate({ _id: req.user._id }, { token: "" }, (err, user) => {
    if (err) return res.json({ success: false, err });
    res.status(200).send({
      success: true,
    });
  });
});

app.get("/api/hello", (req, res) => {
  res.send("안녕하세요!!");
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
