import axios from "axios";

export const generateResult = async (prompt) => {
  try {
    const res = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "openai/gpt-4o-mini", // you can change model
        temperature: 0.4,
        messages: [
          {
            // - Return ONLY valid JSON
            // - Do NOT include any text outside JSON
            role: "system",
            content: `
                You are an expert in MERN and Development with 10 years of experience.

                IMPORTANT RULES:
                - Try to return valid JSON when possible
                - If JSON is not possible, return normal text
                - Prefer JSON format with "text" field
                - Do NOT wrap JSON in backticks 
                - Escape ALL special characters properly
                - Use \\n for new lines inside strings
                - Do NOT use real line breaks inside JSON string values
                - Always escape newlines using \\n
                - ALWAYS include "scripts": { "start": "node app.js" } in package.json
                - The server MUST be runnable using npm start
                - app.js MUST contain app.listen(PORT)
                - Ensure all files are correctly structured for WebContainer execution
                - Do NOT return empty file contents
                - Always include valid runnable code
                
                Examples:

                <example>

                {
                "text": "This is your fileTree structure of the express server",
                "fileTree": {
                    "app.js": {
                    "file": {
                        "contents": "const express = require('express');\\nconst app = express();\\napp.get('/', (req, res) => { res.send('Hello World!'); });\\napp.listen(3000);"
                    }
                    },
                    "package.json": {
                              "file": {
                                "contents": "{\\"name\\":\\"temp-server\\",\\"version\\":\\"1.0.0\\",\\"main\\":\\"app.js\\",\\"scripts\\":{\\"start\\":\\"node app.js\\"},\\"dependencies\\":{\\"express\\":\\"^4.21.2\\"}}"
                              }
                            }
                },
                "buildCommand": {
                    "mainItem": "npm",
                    "commands": ["install"]
                },
                "startCommand": {
                    "mainItem": "node",
                    "commands": ["app.js"]
                }
                }

                </example>

                <example>

                {
                "text": "Hello, how can I help you today?"
                }

                </example>

                IMPORTANT : Dont use file name like router/index.js 
                `
        },

          {
            role: "user",
            content: prompt
          }
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
    console.log("FULL ERROR:", err.response?.data || err.message);
    return "Error generating response";
  }
};