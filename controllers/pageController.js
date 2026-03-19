import nodemailer from "nodemailer";
import dotenv from "dotenv";
import Course from "../models/Course.js";
import User from "../models/User.js";

dotenv.config();

export async function getIndexPage(req, res) {
  const courses = await Course.find().sort("-createdAt").limit(2);
  const totalCourses = await Course.find().countDocuments();
  const totalStudents = await User.countDocuments({ role: "student" });
  const totalTeachers = await User.countDocuments({ role: "teacher" });

  res.status(200).render("index", {
    page_name: "index",
    courses,
    totalCourses,
    totalStudents,
    totalTeachers,
  });
}

export function getAboutPage(req, res) {
  res.status(200).render("about", {
    page_name: "about",
  });
}

export function getRegisterPage(req, res) {
  res.status(200).render("register", {
    page_name: "register",
  });
}

export function getLoginPage(req, res) {
  res.status(200).render("login", {
    page_name: "login",
  });
}

export function getContactPage(req, res) {
  res.status(200).render("contact", {
    page_name: "contact",
  });
}

export async function sendEmail(req, res) {
  try {
    const sentMessage = `
  <h1>Mail Details</h1>
  <ul>
    <li>First Name: ${req.body.first_name}</li>
    <li>Last Name: ${req.body.last_name}</li>
    <li>Email: ${req.body.email}</li>
  </ul>
  <h1>Message</h1>
  <p>${req.body.message}</p>
  `;

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true, // Use true for port 465, false for port 587
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Send an email using async/await
    const info = await transporter.sendMail({
      from: '"SmartEdu Contact Form" <huseyneliyevugur06@gmail.com>',
      to: "huseyneliyevugur06@gmail.com",
      subject: `SmartEdu Contact Form New Message from ${req.body.first_name} ${req.body.last_name} ✔`,
      replyTo: req.body.email,
      html: sentMessage, // HTML version of the message
    });

    console.log("Message sent:", info.messageId);

    req.flash("success", "We received your message succesfully!");
    res.status(200).redirect("contact");
  } catch (err) {
    req.flash("error", `Something went wrong! ${err}`);
    res.status(400).redirect("contact");
  }
}
