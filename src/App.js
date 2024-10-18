import React, { useState } from 'react';

function App() {
  const [image, setImage] = useState(null);
  const [steps, setSteps] = useState([]);
  const [problem, setProblem] = useState('');

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('image', image);

    try {
      const response = await fetch('https://maths-solver.onrender.com/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      setProblem(data.problem);
      setSteps(data.steps);
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  return (
    <div className="App">
      <h1>Math Solver</h1>
      <form onSubmit={handleSubmit}>
        <input type="file" onChange={handleImageChange} />
        <button type="submit">Upload Image</button>
      </form>

      {problem && (
        <div>
          <h2>Problem: {problem}</h2>
          <h3>Steps:</h3>
          <ol>
            {steps.map((step, index) => (
              <li key={index}>{step}</li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
}

export default App;
