const mysql = require("mysql");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const { checkPasswordCriteria } = require("../utils/passwordUtils");
const nodemailer = require('nodemailer');

const db = mysql.createConnection({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASS,
  database: process.env.DATABASE,
});

const localTransporter = nodemailer.createTransport({
  host: 'smtp.office365.com',
  port: 587,
  secure: true,
  auth: {
    user: 'no-reply@apav.pt',
    pass: '#Windows2012',
  },
  tls: {
    ciphers: 'TLSv1.2',
  },
});

localTransporter.set('oauth2_provision_cb', (user, renew, callback) => {
  const accessToken = getAccessTokenSomehow(user);
  if (!accessToken) {
    return callback(new Error('Unknown user'));
  } else {
    return callback(null, accessToken);
  }
});


const productionTransporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

const transporter = process.env.NODE_ENV === 'production' ? productionTransporter : localTransporter;

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).render("login", {
        msg: "Please Enter Your Email and Password",
        msg_type: "error",
      });
    }

    db.query(
      "select * from users where email=?",
      [email],
      async (error, result) => {
        console.log(result);
        if (result.length <= 0) {
          return res.status(401).render("login", {
            msg: "Please Enter Your Email and Password",
            msg_type: "error",
          });
        } else {
          if (!(await bcrypt.compare(password, result[0].PASS))) {
            return res.status(401).render("login", {
              msg: "Please Enter Your Email and Password",
              msg_type: "error",
            });
          } else {
            const id = result[0].ID;
            const token = jwt.sign({ id: id }, process.env.JWT_SECRET, {
              expiresIn: process.env.JWT_EXPIRES_IN,
            });
            console.log("The Token is " + token);
            const cookieOptions = {
              expires: new Date(
                Date.now() +
                  process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000
              ),
              httpOnly: true,
            };
            res.cookie("joes", token, cookieOptions);
            res.status(200).redirect("/home");
          }
        }
      }
    );
  } catch (error) {
    console.log(error);
  }
};
exports.register = (req, res) => {
  console.log(req.body);
  const { name, email, password, confirm_password } = req.body;
  db.query(
    "select email from users where email=?",
    [email],
    async (error, result) => {
      if (error) {
        console.log(error);
      }

      if (result.length > 0) {
        return res.render("register", {
          msg: "Email id already Taken",
          msg_type: "error",
        });
      } else if (password !== confirm_password) {
        return res.render("register", {
          msg: "Password do not match",
          msg_type: "error",
        });
      }

      let hashedPassword = await bcrypt.hash(password, 8);

      db.query(
        "insert into users set ?",
        { name: name, email: email, pass: hashedPassword },
        (error, result) => {
          if (error) {
            console.log(error);
          } else {
            // Envie o e-mail de notificação
            const mailOptions = {
              from: email,
              to: 'millenasantos@apav.pt',
              subject: 'Novo registro de usuário',
              text: `Um novo usuário se registrou. Nome: ${name}, Email: ${email}`,
            };

            transporter.sendMail(mailOptions, (error, info) => {
              if (error) {
                console.log(error);
                // Tratar o erro de envio de e-mail
              } else {
                console.log('E-mail de notificação enviado: ' + info.response);
                // Envie o e-mail de confirmação para o usuário
                const confirmationMailOptions = {
                  from: 'no-reply@apav.pt',
                  to: email,
                  subject: 'Confirmação de registro',
                  text: 'Obrigado por se registrar. Seu registro foi confirmado com sucesso!',
                };

                transporter.sendMail(confirmationMailOptions, (error, info) => {
                  if (error) {
                    console.log(error);
                    // Tratar o erro de envio de e-mail de confirmação
                  } else {
                    console.log('E-mail de confirmação enviado: ' + info.response);
                  }
                });

                // Lógica adicional após o envio do e-mail de notificação e confirmação
                return res.render("register", {
                  msg: "User Registration Success",
                  msg_type: "good",
                });
              }
            });
          }
        }
      );
    }
  );
};

    

exports.isLoggedIn = async (req, res, next) => {
  if (req.cookies.joes) {
    try {
      const decode = await promisify(jwt.verify)(
        req.cookies.joes,
        process.env.JWT_SECRET
      );
      
      db.query(
        "select * from users where id=?",
        [decode.id],
        (err, results) => {
          if (!results) {
            return res.redirect("/login"); // Redireciona para a página de login se o usuário não estiver autenticado corretamente
          }
          
          req.user = results[0];
          return next();
        }
      );
    } catch (error) {
      console.log(error);
      return res.redirect("/login"); // Redireciona para a página de login se ocorrer algum erro ao verificar a autenticação
    }
  } else {
    return res.redirect("/login"); // Redireciona para a página de login se o cookie de autenticação não estiver presente
  }
};


exports.logout = async (req, res) => {
  res.cookie("joes", "logout", {
    expires: new Date(Date.now() + 2 * 1000),
    httpOnly: true,
  });
  res.status(200).redirect("/");
};