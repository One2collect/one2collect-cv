const express = require("express");
const multer = require("multer");
const nodemailer = require("nodemailer");
const path = require("path");
const fs = require("fs");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  }
});

const allowedTypes = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
];

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: function (req, file, cb) {
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Alleen PDF, DOC en DOCX bestanden zijn toegestaan."));
    }
  }
});

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.post("/upload-cv", upload.single("cv"), async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;

    if (!req.file) {
      return res.status(400).send("Geen CV-bestand ontvangen.");
    }

    const mailOptions = {
      from: process.env.SMTP_USER,
      to: process.env.RECEIVER_EMAIL,
      subject: `Nieuw CV ontvangen van ${name}`,
      text: `
Naam: ${name}
E-mail: ${email}
Telefoon: ${phone || "Niet ingevuld"}

Bericht:
${message || "Geen bericht"}
      `,
      attachments: [
        {
          filename: req.file.originalname,
          path: req.file.path
        }
      ]
    };

    await transporter.sendMail(mailOptions);

    fs.unlink(req.file.path, (err) => {
      if (err) {
        console.error("Kon upload niet verwijderen:", err);
      }
    });

    res.send("Je CV is succesvol verzonden.");
  } catch (error) {
    console.error(error);
    res.status(500).send("Er ging iets mis bij het verzenden van je CV.");
  }
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(400).send(err.message || "Upload mislukt.");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server draait op poort ${PORT}`);
});
