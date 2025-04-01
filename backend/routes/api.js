const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

router.post('/extract-text', async (req, res) => {
  try {
    const { image } = req.body;

    // Convert base64 to proper format for Gemini
    const imageBuffer = Buffer.from(image, 'base64');

    // Initialize Gemini Vision model
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-pro-exp-03-25" });

    // Create image part for the model
    const imagePart = {
      inlineData: {
        data: imageBuffer.toString('base64'),
        mimeType: 'image/jpeg'
      }
    };

    // Generate content from image
    const result = await model.generateContent([
      "Extract and list all text from this prescription image, focusing on medication names, dosages, and instructions.",
      imagePart
    ]);
    const response = await result.response;
    const text = response.text();

    res.json({ text });
  } catch (error) {
    console.error('Error processing image:', error);
    res.status(500).json({ error: 'Failed to process image' });
  }
});

module.exports = router; 