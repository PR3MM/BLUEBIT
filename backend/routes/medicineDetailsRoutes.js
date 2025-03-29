const express = require('express');
const router = express.Router();

// Route to get detailed medication information
router.get('/medication/:medicationName', async (req, res) => {
    try {
      console.log("Request received for medication name:", req.params.medicationName);
      const medicationName = req.params.medicationName;
      
      // Get the API key from environment variables
      const apiKey = process.env.GEMINI_API_KEY;
      
      if (!apiKey) {
        return res.status(500).json({ 
          error: 'API key not configured on the server' 
        });
      }
      
      // Enhanced prompt for Gemini with more comprehensive medication information
      const prompt = `
        Provide detailed information about the medication "${medicationName}" using the following structured format.
        Include only information that is factually accurate for this specific medication.
        
        Return a JSON object with the following structure:
        {
          "name": "Full medication name",
          "category": "Medication category/class",
          "description": "Comprehensive description of what this medication is",
          "uses": ["List of medical conditions this medication treats"],
          "benefits": ["Key benefits of using this medication"],
          "howItWorks": "Simple explanation of how the medication works in the body",
          "howToUse": "Detailed instructions on how to use/take this medication properly",
          "sideEffects": {
            "common": ["List of common side effects"],
            "severe": ["List of severe side effects that require medical attention"]
          },
          "dosageInstructions": "General dosage instructions including timing and frequency",
          "warnings": ["List of important warnings and precautions"],
          "safetyAdvice": {
            "alcohol": {
              "status": "SAFE/CAUTION/UNSAFE",
              "details": "Information about interactions with alcohol"
            },
            "pregnancy": {
              "status": "SAFE/CONSULT YOUR DOCTOR/UNSAFE",
              "details": "Information about usage during pregnancy"
            },
            "breastfeeding": {
              "status": "SAFE/CONSULT YOUR DOCTOR/UNSAFE",
              "details": "Information about usage during breastfeeding"
            },
            "driving": {
              "status": "SAFE/CAUTION/UNSAFE",
              "details": "Information about effects on ability to drive"
            },
            "kidney": {
              "status": "SAFE/CAUTION/UNSAFE",
              "details": "Information for patients with kidney disease"
            },
            "liver": {
              "status": "SAFE/CAUTION/UNSAFE",
              "details": "Information for patients with liver disease"
            }
          },
          "missedDose": "What to do if a dose is missed",
          "interactions": ["List of significant drug interactions"],
          "storageInstructions": "How to properly store the medication",
          "pregnancyCategory": "Safety category for pregnancy (A, B, C, D, X, or N/A)",
          "brandNames": ["List of common brand names"],
          "genericAvailability": true/false,
          "manufacturer": "Main manufacturer of the medication",
          "price": "Average price range",
          "costSavingTips": ["Tips for saving money on this medication"],
          "factBox": {
            "composition": ["Active ingredients"],
            "habit forming": "Yes/No",
            "therapeutic class": "Class of medication"
          }
        }
        
        Ensure all information is medically accurate and formatted exactly as specified.
      `;
      
      // Make API call to Gemini
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro-latest:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                { text: prompt }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.2,
            maxOutputTokens: 2048,
          }
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`API Error: ${errorData.error?.message || 'Unknown error'}`);
      }
      
      const data = await response.json();
      
      // Extract the text response from Gemini
      const geminiText = data.candidates[0].content.parts[0].text;
      // console.log("Gemini response received :", geminiText);
      
      // Find the JSON data in the response (it might be wrapped in markdown code blocks)
      const jsonMatch = geminiText.match(/\{[\s\S]*\}/);
      
      if (!jsonMatch) {
        throw new Error("Could not parse medication data from API response");
      }
      
      // Parse the JSON data
      const medicationDetails = JSON.parse(jsonMatch[0]);
      
      // Return the medication details
      res.json(medicationDetails);
      
    } catch (error) {
      console.error('Error fetching medication details:', error);
      res.status(500).json({ 
        error: 'Failed to fetch medication details', 
        message: error.message 
      });
    }
});

module.exports = router;