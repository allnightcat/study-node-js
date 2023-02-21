const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const jwt = require("jsonwebtoken");

const userSchema = mongoose.Schema({
  name: {
    type: String,
    maxlength: 50,
  },
  email: {
    type: String,
    trim: true,
    unique: 1,
  },
  password: {
    type: String,
  },
  lastname: {
    type: String,
    maxlength: 50,
  },
  role: {
    type: Number,
    default: 0,
  },
  image: String,
  token: {
    type: String,
  },
  tokenExp: {
    type: Number,
  },
});

userSchema.pre("save", function (next) {
  var user = this;
  if (user.isModified("password")) {
    // 비밀번호 암호화 시키기
    bcrypt.genSalt(saltRounds, function (err, salt) {
      if (err) return next(err);
      bcrypt.hash(user.password, salt, function (err, hash) {
        if (err) return next(err);
        user.password = hash;
        next();
      });
    });
  } else {
    next();
  }
});

userSchema.methods.comparePassword = function (plainPassword, cb) {
  bcrypt.compare(plainPassword, this.password, (err, isMatch) => {
    console.log(this.password);
    console.log(plainPassword);
    if (err) return cb(err);
    else {
      cb(null, isMatch); // isMatch는 true 값이 들어옴
    }
  });
};

userSchema.methods.generateToken = function (cb) {
  // jsonwebtoken을 사용하여 token 생성
  const user = this;
  const token = jwt.sign(user._id.toHexString(), "secretToken");

  user.token = token;
  user.save((err, user) => {
    if (err) return cb(err);
    else cb(null, user);
  });
};

const User = mongoose.model("User", userSchema);

module.exports = { User };
