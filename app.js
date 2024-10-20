// const nodemailer = require("nodemailer");
// const multer = require("multer");
// const express = require("express");
// const bodyParder = require("body-parser");
// const fs = require("fs");
// const app = express();
// var to;
// var subject;
// var body;
// var path;

// var Storage = multer.diskStorage({
//   destination: function (req, file, callback) {
//     callback(null, "./images");
//   },
//   filename: function (req, file, callback) {
//     callback(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
//   },
// });

// var upload = multer({
//   storage: Storage,
// }).single("image");

// app.use(express.static("public"));

// app.use(bodyParder.urlencoded({ extended: true }));
// app.use(bodyParder.json());

// app.get("/", (req, res) => {
//   res.sendFile("index.html");
// });

// app.post("/sendemail", (req, res) => {
//   //excute the middleware upload the image

//   upload(req, res, function (err) {
//     if (err) {
//       console.log(err);
//       return res.end("Something Went Wrong...");
//     } else {
//       to = req.body.to
//       subject = req.body.subject
//       body = req.body.body

//       path = req.file.path

//       console.log(to)
//       console.log(subject)
//       console.log(body)
//       console.log(path)

//       var transporter = nodemailer.createTransport({
//         service: 'gmail',
//         auth:{
//             user: 'sanatanidharma586@gmail.com',
//             pass: 'Jainik@2343'
//         }
//       })

//       var mailOptions = {
//         from: 'sanatanidharma586@gmail.com',
//         to: to,
//         subject: subject,
//         text: body,
//         attachments: [
//             {
//                 path: path
//             }
//         ]

//       }
//       transporter.sendMail(mailOptions, function(err, info){
//         if (err) {
//             console.log(err);
//         } else {
//             console.log("Email Send" + info.response);

//             fs.unlink(path,function(err){
//                 if (err) {
//                     return res.end(err  )
//                 } else {
//                     console.log("Deleted");
//                     return res.redirect("/result.html")

//                 }
//             })
//         }
//       })

//     }
//   });
// });

// app.listen(5000, () => {
//   console.log("App Start on port 5000");
// });

// ====================================================================== COMPLETED =======================================================
const nodemailer = require("nodemailer");
const multer = require("multer");
const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");

const app = express();

var storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, "./images");
  },
  filename: function (req, file, callback) {
    callback(null, file.originalname);
  },
});

var upload = multer({
  storage: storage,
}).single("image");

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.post("/sendemail", (req, res) => {
  upload(req, res, function (err) {
    if (err) {
      console.log("Error uploading file:", err);
      return res.end("Something went wrong with the file upload.");
    }

    const { to, subject, body } = req.body;
    const attachmentPath = req.file ? req.file.path : null;
    const originalFileName = req.file ? req.file.originalname : null;

    if (!to || !subject || !body || !attachmentPath) {
      return res
        .status(400)
        .send("All fields are required, including an attachment.");
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "sanatanidharma586@gmail.com",
        pass: "pkjs ksuc faex msie",
      },
    });

    const mailOptions = {
      from: "sanatanidharma586@gmail.com",
      to: to,
      subject: subject,
      text: body,
      attachments: [
        {
          filename: originalFileName,
          path: attachmentPath,
        },
      ],
    };

    console.log(to);
    console.log(subject);
    console.log(body);
    console.log(path);

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log("Error sending email:", error);
        return res.status(500).send("Failed to send email.");
      } else {
        console.log("Email sent: " + info.response);

        // Delete the uploaded file after sending
        fs.unlink(attachmentPath, function (err) {
          if (err) {
            console.log("Error deleting file:", err);
            return res.status(500).send("Failed to delete the attachment.");
          }

          console.log("File deleted successfully");

          return res.redirect("/result.html");
        });
      }
    });
  });
});

app.listen(5000, () => {
  console.log("App started on port 5000");
});
// id : sanatanidharma586@gmail.com
// password : pkjs ksuc faex msie
