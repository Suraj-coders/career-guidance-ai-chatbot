🧠 Career Guidance Chatbot

An AI-powered career counseling assistant for Class 10 students — built using the MERN stack and integrated with the OpenRouter free LLM API (Mistral-7B).

🚀 Features

🗣️ AI Chatbot for Students – Provides personalized career advice for students based on interests and strengths.

🧑‍🎓 Signup & Personalization – Captures student data like name, interests, and location for tailored responses.

💬 Interactive Chat UI – Floating chatbot icon with toggleable chat window using React + Tailwind CSS.

🧰 Backend Integration – Node.js + Express API connected to OpenRouter LLM for generating responses.

🧠 Free LLM Access – Uses the Mistral-7B-Instruct model from OpenRouter for free and fast chat completions.

🗄️ MongoDB Database – Stores student info and conversation history for personalization.

🎨 Responsive Design – Works on both mobile and desktop screens seamlessly.

🏗️ Tech Stack
Layer	Technology
Frontend	React.js, Tailwind CSS
Backend	Node.js, Express.js
Database	MongoDB
AI API	OpenRouter (Mistral 7B Instruct)
HTTP Client	Axios
⚙️ Installation
1️⃣ Clone the repository
git clone https://github.com/Suraj-coders/career-guidance-chatbot.git
cd career-guidance-chatbot

2️⃣ Install dependencies
# In root folder
npm install

# If you have separate client folder:
cd client
npm install

3️⃣ Set up environment variables

Create a .env file in the backend root directory:

PORT=5000
MONGO_URI=your_mongodb_connection_string
OPENROUTER_API_KEY=your_openrouter_api_key


You can get a free API key here:
👉 https://openrouter.ai/keys

4️⃣ Run the development servers
# Backend
node index.js

# Frontend
cd client
npm run dev