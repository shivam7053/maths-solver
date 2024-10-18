const express = require('express');
const multer = require('multer');
const Tesseract = require('tesseract.js');
const math = require('mathjs');
const path = require('path');
const fs = require('fs');
const cors = require('cors'); // Import CORS

const app = express();
const upload = multer({ dest: 'uploads/' });

// Use CORS to allow requests from different origins
app.use(cors());

// Route for uploading an image
app.post('/upload', upload.single('image'), (req, res) => {
    const imagePath = path.join(__dirname, req.file.path);

    // Use Tesseract to extract text from the image
    Tesseract.recognize(imagePath, 'eng')
        .then(({ data: { text } }) => {
            // Clean up the extracted text
            const mathProblem = text.replace(/[^0-9+\-*/()=]/g, '');

            // Solve the math problem step by step
            const solutionSteps = solveMathProblem(mathProblem);

            // Return the result as JSON
            res.json({
                problem: mathProblem,
                steps: solutionSteps
            });

            // Clean up the uploaded image
            fs.unlinkSync(imagePath);
        })
        .catch(err => {
            res.status(500).json({ error: 'Error extracting text from image' });
        });
});

// Solve the math problem step-by-step
function solveMathProblem(problem) {
    try {
        const steps = [];

        const parsedExpression = math.parse(problem);

        // Solve step-by-step (this can be improved based on your requirements)
        const simplified = math.simplify(parsedExpression);
        steps.push(`Simplified: ${simplified.toString()}`);

        const result = math.evaluate(problem);
        steps.push(`Result: ${result}`);

        return steps;
    } catch (error) {
        return ['Unable to solve the problem'];
    }
}

// Start the server
app.listen(5000, () => {
    console.log('Server is running on port 5000');
});
