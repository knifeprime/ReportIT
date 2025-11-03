Report It — Public Safety Reporting Web App

Report It (formerly the NNCSALW Concept Site) is a web platform designed to help citizens easily report suspicious activities — especially those linked to illegal arms and ammunition. The goal is to improve community safety by enabling fast, direct communication with authorities.

🔗 Live Site: https://knifeprime.github.io/ReportIT/


---

🎯 Project Purpose

The mission behind Report It is simple:

Empower citizens to report sensitive situations quickly and confidently

Spread public awareness on why reporting matters

Build trust with a clean, accessible, and professional interface


It transforms a complex security initiative into a digital tool that everyday people can use without confusion.


---

✅ Key Features

Feature	Description

📍 Easy Reporting Flow	Simple form that guides users to describe and submit reports efficiently
🔔 Clear “Report Now” CTA	Priority action placed where users naturally click
📚 Awareness & Education	Informational sections to help users identify reportable threats
📱 Responsive Design	Works across devices (ongoing improvements for mobile layout)
☁️ Cloudinary Integration	Enables uploading images/audio as evidence inside the form
🔒 Secure UX Direction	Visual design promotes trust, seriousness, and safety



---

🛠️ Technologies Used

HTML

CSS (with responsiveness refinements in progress)

JavaScript

Cloudinary (for media uploads)

GitHub Pages (for hosting)



---

☁️ Cloudinary Upload System

Users can upload helpful attachments such as:

📸 Photos of suspicious items

🎙️ Audio evidence

📍 Location screenshots


This helps authorities receive better context during reports.

Cloudinary is configured using:

cloudinary.config({
  cloud_name: "xxxx",
  api_key: "xxxx",
  upload_preset: "xxxx"
});


---

🧠 What I Learned

How to integrate image & audio uploads using Cloudinary

UX principles for government-style platforms

Importance of accessibility and clear information hierarchy

Debugging mobile responsiveness (CSS sometimes hates me 😭)



---

🚧 What’s Coming Next

✅ Improved mobile design

✅ Better form validation + error messages

🔜 Admin dashboard for reviewing reports

🔜 React version of the full app

🔜 Security enhancements for sensitive user data
