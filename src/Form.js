import React, { useState } from 'react';
import './Form.css'; // Import CSS for styling

const Form = () => {
  const [file, setFile] = useState(null);
  const [downloadUrl, setDownloadUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const backendDomain = 'https://powerful-tundra-06195-848495b13757.herokuapp.com/'; // Example: Replace with your actual backend domain

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setLoading(true); // Start loading

    // Create a FormData object
    const formData = new FormData();
    formData.append('document', file);

    // Send formData to backend
    fetch(`${backendDomain}/add_banner`, {
      method: 'POST',
      body: formData
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.blob(); // Return the response as a blob
      })
      .then(blob => {
        // Create a URL for the blob response
        const url = URL.createObjectURL(blob);
        // Set the download URL received from the backend
        setDownloadUrl(url);
        setLoading(false); // Stop loading
      })
      .catch(error => {
        console.error('Error uploading file:', error);
        setError('Error uploading file. Please try again.'); // Set error message
        setLoading(false); // Stop loading
      });
  };

  const handleDownload = () => {
    // Trigger file download
    window.open(downloadUrl);
  };

  return (
    <div className="form-container"> {/* Apply custom CSS class for styling */}
      <form onSubmit={handleSubmit} className="form">
        <input type="file" onChange={handleFileChange} />
        <button type="submit" className="upload-button">Upload</button>
      </form>
      {loading && <p>Loading...</p>} {/* Show loading message if loading */}
      {error && <p className="error">{error}</p>} {/* Show error message if error */}
      {downloadUrl && <button onClick={handleDownload} className="download-button">Download</button>}
    </div>
  );
};

export default Form;
