const express = require('express');
const mongoose = require('mongoose');
const { Student } = require('./models/Student');
const { Chat } = require('./models/chat');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/career-chatbot', {})
.then(() => console.log('✅ MongoDB Connected'))
.catch(err => console.error(' MongoDB Error:', err));




app.post('/api/students/register', async (req, res) => {
  try {

    const student = new Student(req.body);
    await student.save();
    res.status(201).json({ success: true, student });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});


app.get('/api/students/:id', async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    res.json({ success: true, student });
  } catch (error) {
    res.status(404).json({ success: false, error: 'Student not found' });
  }
});

app.post("/api/chat", async (req, res) => {
  try {
    const { message, studentData } = req.body;

    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "mistralai/mistral-7b-instruct",
        messages: [
          {
            role: "system",
            content: `You are a helpful and friendly career counselor for Class 10 students in India. Give clear and encouraging advice.`,
          },
          {
            role: "user",
            content: `Student: ${studentData.name}, Interests: ${studentData.interests}, Location: ${studentData.location}.
Question: ${message}`,
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    let reply =
      response.data.choices?.[0]?.message?.content ||
      "Sorry, I couldn't generate a response.";

       reply = reply
      .replace(/<s>\s*\[OUT\]\s*/g, "")
      .replace(/s<out>/g, "")
      .replace(/[/OUT]/g, "")
      .trim();

    res.json({ response: reply });
  } catch (error) {
    console.error("Chat Error:", error.response?.data || error.message);
    res.status(500).json({
      response: "I'm having trouble connecting. Please try again later.",
    });
  }
});





app.post('/api/chat/save', async (req, res) => {
  try {
    const { studentId, messages } = req.body;
    const chat = new Chat({ studentId, messages });
    await chat.save();
    res.json({ success: true });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
