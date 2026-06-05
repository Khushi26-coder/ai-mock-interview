const express = require("express");
const cors = require("cors");

const app = express();

// 🔥 Confirm correct file
console.log("🔥 THIS IS MY SERVER FILE 🔥");

// Middleware
app.use(cors());
app.use(express.json());

// Home route
app.get("/", (req, res) => {
  res.send("Server running on 5050 🚀");
});

// ✅ Questions API (UPDATED + DEBUG)
app.get("/questions", (req, res) => {
  console.log("NEW QUESTIONS API HIT 🚀");

  res.json([
    "Tell me about yourself",
    "What is your CGPA?",
    "Why did you choose your branch?",
    "What is HTML and why is it used?",
    "Explain JavaScript in simple terms",
    "What is the difference between frontend and backend?",
    "Describe a project you have worked on",
    "What are your strengths and weaknesses?",
    "How do you handle pressure or deadlines?"
  ]);
});

// ✅ Feedback API
app.post("/feedback", (req, res) => {
  const { answer } = req.body;

  let feedback = "Good answer 👍";

  if (!answer || answer.length < 10) {
    feedback = "⚠️ Try to write more detailed answer.";
  } else if (answer.length > 50) {
    feedback = "🔥 Excellent explanation!";
  } else if (answer.toLowerCase().includes("example")) {
    feedback = "👏 Great! You used an example.";
  }

  res.json({ feedback });
});

// 🚀 Start server on NEW PORT
app.listen(5050, () => {
  console.log("Server running on http://localhost:5050 🚀");
});