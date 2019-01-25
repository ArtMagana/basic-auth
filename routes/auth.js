const express = require("express");
const router = express.Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

router.post("/signup", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  const salt     = bcrypt.genSaltSync(bcryptSalt);
  const hashPass = bcrypt.hashSync(password, salt);

if (username === "" || password === "") {
  res.render("auth/signup", {
    errorMessage: "Indicate a username and a password to sign up"
  });
  return;
}

User.findOne({ "username": username })
.then(user => {
  if (user !== null) {
      res.render("auth/signup", {
        errorMessage: "The username already exists!"
      });
      return;
    }

    const salt     = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);

    const newUser = User({
      username,
      password: hashPass
    });

    newUser.save()
    .then(user => {
      res.redirect("/");
    })
})
.catch(error => {
    next(error);
})

  const newUser  = User({
    username,
    password: hashPass
  });

  newUser.save()
  .then(user => {
    res.redirect("/");
  })
  .catch(error => {
    console.log(error);
  })
});

router.get("/signup", (req, res, next) => {
  res.render("auth/signup");
});

router.get('/login', (req, res, next)=>{
  res.render('auth/login')
})

router.post('/login', (req, res, next)=>{
  const username = req.body.username
  const password = req.body.password

  if(username === '' || password === '') {
    res.render('auth/login', {
      errorMessage: 'tienes que introducir un nombre de usuario y contraseña'
    })
    return
  }

  User.findOne({'username': username})
  .then(user=>{
    if (!user){
      res.render('auth/login', {
        errorMessage: `El usuario ${username} no existe!!`
      })
      return
    }
    if (bcrypt.compareSync(password, user.password)){
      req.session.currentUser = user;
      res.redirect('/')
    } else {
      res.render('auth/login', {
        errorMessage: `La contraseña es mas que incorrecta`
      })
    }
  })
  .catch(err=>next(err))
})

router.get('/logout', (req, res, next)=>{
  req.session.destroy((err)=>{
    res.redirect('/login')
  })
})

module.exports = router;
