const express = require("express");
const router = express.Router();
const userContoller = require("../controllers/users");
const path = require("path");

router.get(["/", "/login"], (req, res) => {
  res.render("login");
});

router.get("/register", (req, res) => {
  res.render("register");
});

router.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/login");
  });
});



router.get("/home", userContoller.isLoggedIn, (req, res) => {
  if (req.user) {
    res.render("home", { user: req.user });
  } else {
    res.redirect("/login");
  }
});

router.get("/asp", userContoller.isLoggedIn, (req, res) => {
  if (req.user) {
    res.render("asp", { user: req.user });
  } else {
    res.redirect("/login");
  }
});

router.get("/cu", userContoller.isLoggedIn, (req, res) => {
  if (req.user) {
    res.render("cu", { user: req.user });
  } else {
    res.redirect("/login");
  }
});

router.get("/pp", userContoller.isLoggedIn, (req, res) => {
  if (req.user) {
    res.render("pp", { user: req.user });
  } else {
    res.redirect("/login");
  }
});

router.get("/asp_cj", userContoller.isLoggedIn, (req, res) => {
  if (req.user) {
    res.render("asp_cj", { user: req.user });
  } else {
    res.redirect("/login");
  }
});

router.get("/asp_fc", userContoller.isLoggedIn, (req, res) => {
  if (req.user) {
    res.render("asp_fc", { user: req.user });
  } else {
    res.redirect("/login");
  }
});

router.get("/asp_ido", userContoller.isLoggedIn, (req, res) => {
  if (req.user) {
    res.render("asp_ido", { user: req.user });
  } else {
    res.redirect("/login");
  }
});

router.get("/asp_sa", userContoller.isLoggedIn, (req, res) => {
  if (req.user) {
    res.render("asp_sa", { user: req.user });
  } else {
    res.redirect("/login");
  }
});

router.get("/asp_sd", userContoller.isLoggedIn, (req, res) => {
  if (req.user) {
    res.render("asp_sd", { user: req.user });
  } else {
    res.redirect("/login");
  }
});

router.get("/asp_vvd", userContoller.isLoggedIn, (req, res) => {
  if (req.user) {
    res.render("asp_vvd", { user: req.user });
  } else {
    res.redirect("/login");
  }
});

router.get("/pp_ado", userContoller.isLoggedIn, (req, res) => {
  if (req.user) {
    res.render("pp_ado", { user: req.user });
  } else {
    res.redirect("/login");
  }
});

router.get("/pp_cp", userContoller.isLoggedIn, (req, res) => {
  if (req.user) {
    res.render("pp_cp", { user: req.user });
  } else {
    res.redirect("/login");
  }
});

router.get("/pp_dcs", userContoller.isLoggedIn, (req, res) => {
  if (req.user) {
    res.render("pp_dcs", { user: req.user });
  } else {
    res.redirect("/login");
  }
});

router.get("/pp_did", userContoller.isLoggedIn, (req, res) => {
  if (req.user) {
    res.render("pp_did", { user: req.user });
  } else {
    res.redirect("/login");
  }
});

router.get("/pp_ecj", userContoller.isLoggedIn, (req, res) => {
  if (req.user) {
    res.render("pp_ecj", { user: req.user });
  } else {
    res.redirect("/login");
  }
});

router.get("/pp_mat_pat", userContoller.isLoggedIn, (req, res) => {
  if (req.user) {
    res.render("pp_mat_pat", { user: req.user });
  } else {
    res.redirect("/login");
  }
});

router.get("/pp_mrt", userContoller.isLoggedIn, (req, res) => {
  if (req.user) {
    res.render("pp_mrt", { user: req.user });
  } else {
    res.redirect("/login");
  }
});

router.get("/pp_rv", userContoller.isLoggedIn, (req, res) => {
  if (req.user) {
    res.render("pp_rv", { user: req.user });
  } else {
    res.redirect("/login");
  }
});


router.get("/js/:filename", (req, res) => {
  const filePath = path.join(__dirname, '..', 'js', req.params.filename);
  res.set('Content-Type', 'application/javascript');
  res.sendFile(filePath);
});



module.exports = router;
