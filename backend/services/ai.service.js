import axios from "axios";

export const generateResult = async (prompt) => {
  try {
    const res = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "google/gemini-pro-1.5",
        messages: [
          { role: "user", content: prompt }
        ]
      },
      {
        headers: {
          "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    return res.data.choices[0].message.content;

  } catch (err) {
    console.log(err.response?.data || err.message);
    return "Error generating response";
  }
};


// import { GoogleGenAI } from "@google/genai";

// const ai = new GoogleGenAI({
//   apiKey: process.env.GOOGLE_AI_KEY
// });

// export const generateResult = async (prompt) => {
//   try {
//     const response = await ai.models.generateContent({
//       model: "gemini-2.0-flash", // updated stable model
//       contents: prompt
//     });

//     return response.text;
//   } catch (err) {
//     console.error("AI Error:", err);
//     return "Something went wrong";
//   }
// };

// import { GoogleGenerativeAI } from "@google/generative-ai";

// const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_KEY);
// const model = genAI.getGenerativeModel({ model: "gemini-pro" }); // ✅ FIXED

// export const generateResult = async (prompt) => {
//     const result = await model.generateContent(prompt);
//     return result.response.text();
// };