const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
const PORT = 3001;

// Enable CORS for all routes
app.use(cors());

// Middleware to parse JSON bodies
app.use(express.json());

let token = null; // Variable to store the token

// Function to login and get a token
async function login() {
  const { username, password } = {
    username: "67861376f4ea2439e290f072d7825d9803bb1a3b",
    password: "IJ5TWJhVtumqHfx3I1Gkfq7ZlnCmoBO",
  };
  try {
    const response = await axios.post(
      "https://api.ayoba.me/v2/login",
      {
        username,
        password,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );
    token = response.data.access_token; // Extracting only the access_token
    console.log({ message: "Login successful", token });
  } catch (error) {
    console.log({ error: "Error during login", details: error.message });
  }
}
// reset the token every 15 minutes
setInterval(login, 15 * 60 * 1000);

login();

app.post("/translate", async (req, res) => {
  const { date } = req.body;
  try {
    const response = await axios.post(
      "https://Translate.proxy-production.allthingsdev.co/translate?translated_from=eng&translated_to=hin",

      { data },
      {
        headers: {
          "x-apihub-key": "FUBj8lBpB1PjUdvVx0Ni-8tX6ZZV0ATmxUoRjI3J7HCV-4DMQB",
          "x-apihub-host": "Translate.allthingsdev.co",
          "x-apihub-endpoint": "3f4ee5f4-f67c-4c5a-9375-635d8b514026",
        },
      }
    );
    res.json(response.data);
  } catch (error) {
    res.status(500).json({
      error: "Error sending business message",
      details: error.message,
    });
  }
});

app.post("/send-business-message", async (req, res) => {
  if (!token) {
    return res.status(401).json({ error: "Unauthorized: No token provided" });
  }

  const { msisdns, message } = req.body;

  try {
    const response = await axios.post(
      "https://api.ayoba.me/v1/business/message",
      {
        msisdns,
        message,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );
    res.json(response.data);
  } catch (error) {
    res.status(500).json({
      error: "Error sending business message",
      details: error.message,
    });
  }
});

// Endpoint to get business message using the token
app.get("/business-message", async (req, res) => {
  if (!token) {
    return res.status(401).json({ error: "Unauthorized: No token provided" });
  }
  try {
    const response = await axios.get(
      "https://api.ayoba.me/v1/business/message",
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      }
    );
    res.json(response.data);
  } catch (error) {
    res.status(500).json({
      error: "Error fetching business message",
      details: error.message,
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(token);
});
