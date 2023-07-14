const express = require("express");
const session = require("express-session");
const mysql = require("mysql");
const doenv = require("dotenv");
const path = require("path");
const hbs = require("hbs");
const cookieParser = require("cookie-parser");
const secretKey = '6LeNBN8mAAAAAP_99lgTfNwp-HVFj7BJZkGYT5R_';
const axios = require('axios');
const methodOverride = require("method-override");


const app = express();

doenv.config({
  path: "./.env",
});
//process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

//process.env.NODE_OPTIONS = '--openssl-legacy-provider'; 


const db = mysql.createConnection({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASS,
  database: process.env.DATABASE,
});


// Configuração do express-session
app.use(
  session({
    secret: "seu-segredo-aqui",
    resave: false,
    saveUninitialized: true
  })
);


db.connect((err) => {
  if (err) {
    console.log(err);
  } else {
    console.log("MySQL Connection Success");
  }
});
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));

app.use(methodOverride("_method"));

//console.log(__dirname);
const location = path.join(__dirname, "./public");
app.use(express.static(location));
app.set("view engine", "hbs");

const partialsPath = path.join(__dirname, "./views/partials");
hbs.registerPartials(partialsPath);

app.use("/", require("./routes/pages"));
app.use("/auth", require("./routes/auth"));


// Rota para processar o formulário de login
app.post("/auth/login", async (req, res) => {
  const { email, password, recaptcha } = req.body;

  // Verifique a validade do token do reCAPTCHA
  try {
    const response = await axios.post("https://www.google.com/recaptcha/api/siteverify", null, {
      params: {
        secret: secretKey,
        response: recaptcha,
      },
    });

    const { success, score } = response.data;

    if (success && score >= 0.5) {
      // O token do reCAPTCHA é válido e a pontuação é alta o suficiente
      // Processe o login do usuário
      // ...
      console.log("reCAPTCHA token:", recaptcha);
      res.status(200).send("Login successful");
    } else {
      // O token do reCAPTCHA é inválido ou a pontuação é muito baixa
      // Retorne um erro ou realize alguma ação apropriada
      // ...
      res.status(403).send("reCAPTCHA validation failed");
    }
  } catch (error) {
    // Ocorreu um erro ao verificar o token do reCAPTCHA
    // Retorne um erro ou realize alguma ação apropriada
    // ...
    res.status(500).send("An error occurred");
  }
});

app.listen(3000, () => {
  console.log("Server Started @ Port 3000");
});