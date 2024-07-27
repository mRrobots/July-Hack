const express = require("express");
const axios = require("axios");

const app = express();
const PORT = 3000;

// Middleware to parse JSON bodies
app.use(express.json());

let token = null; // Variable to store the token

// Endpoint to login and get a token
app.post("/login", async (req, res) => {
  const { username, password } = req.body;
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
    res.json({ message: "Login successful", token });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error during login", details: error.message });
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
