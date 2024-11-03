// src/App.js
import { useState, useRef } from 'react';
import axios from 'axios';
import Webcam from 'react-webcam';
import './App.css'; // Optional: for styling

const App = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [ocrResult, setOcrResult] = useState('');
  const [error, setError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [extractedInfo, setExtractedInfo] = useState(null);
  const webcamRef = useRef(null);

  const OCR_SPACE_API_KEY = 'OCR_SPACE_API_KEY'; // Replace with your OCR Space API key

  // Handle file selection with validation
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];

    if (file && validTypes.includes(file.type)) {
      setSelectedFile(file);
      setOcrResult('');
      setError('');
      setExtractedInfo(null);
    } else {
      setError('Unsupported file type. Please upload a JPEG or PNG image.');
      setSelectedFile(null);
    }
  };

  // Capture image from webcam
  const capture = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    if (imageSrc) {
      // Convert base64 to File
      const byteString = atob(imageSrc.split(',')[1]);
      const mimeString = imageSrc.split(',')[0].split(':')[1].split(';')[0];
      const ab = new ArrayBuffer(byteString.length);
      const ia = new Uint8Array(ab);
      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }
      const blob = new Blob([ab], { type: mimeString });
      const file = new File([blob], 'captured_image.png', { type: mimeString });
      setSelectedFile(file);
      setOcrResult('');
      setError('');
      setExtractedInfo(null);
    }
  };

  // Handle form submission for OCR
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!selectedFile) {
      setError('Please select or capture an image first!');
      return;
    }

    setIsProcessing(true);
    setOcrResult('');
    setError('');
    setExtractedInfo(null);

    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('language', 'ron'); // Correct language code for Romanian
    formData.append('apikey', OCR_SPACE_API_KEY);
    formData.append('isOverlayRequired', 'false');

    try {
      const response = await axios.post('https://api.ocr.space/parse/image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.IsErroredOnProcessing) {
        const apiError = response.data.ErrorMessage
          ? response.data.ErrorMessage.join(' ')
          : 'An unknown error occurred during OCR processing.';
        setError(apiError);
      } else {
        const parsedText = response.data.ParsedResults[0].ParsedText;
        setOcrResult(parsedText);
        extractInfo(parsedText); // Extract specific fields
      }
    } catch (err) {
      console.error(err);
      setError('An error occurred while processing the image.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Function to extract specific information from OCR result
  const extractInfo = (text) => {
    // Example extraction using regular expressions
    // Adjust regex patterns based on actual OCR output format

    // Extract Name
    const nameMatch = text.match(/Nume\s*:\s*(.+)/i);
    const name = nameMatch ? nameMatch[1].trim() : 'Not Found';

    // Extract ID Number (CNP)
    const cnpMatch = text.match(/CNP\s*:\s*(\d{13})/i);
    const idNumber = cnpMatch ? cnpMatch[1].trim() : 'Not Found';

    // Extract Date of Birth
    const dobMatch = text.match(/Data\s*nașterii\s*:\s*(\d{2}[./-]\d{2}[./-]\d{4})/i);
    const dateOfBirth = dobMatch ? dobMatch[1].trim() : 'Not Found';

    setExtractedInfo({
      name,
      idNumber,
      dateOfBirth,
    });
  };

  return (
    <div className="App" style={styles.container}>
      <h1>Romanian ID Card Scanner</h1>

      <div style={styles.section}>
        <h2>Upload Image</h2>
        <input type="file" accept="image/*" onChange={handleFileChange} />
      </div>

      <div style={styles.section}>
        <h2>Or Capture via Webcam</h2>
        <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/png"
          width={350}
          videoConstraints={{
            width: 350,
            height: 200,
            facingMode: 'environment',
          }}
        />
        <br />
        <button onClick={capture} style={styles.button}>
          Capture Photo
        </button>
      </div>

      <div style={styles.section}>
        <h2>Selected Image:</h2>
        {selectedFile ? (
          <img
            src={selectedFile instanceof File ? URL.createObjectURL(selectedFile) : selectedFile}
            alt="Selected"
            style={styles.imagePreview}
          />
        ) : (
          <p>No image selected or captured.</p>
        )}
      </div>

      <div style={styles.section}>
        <button onClick={handleSubmit} style={styles.submitButton} disabled={isProcessing}>
          {isProcessing ? 'Processing...' : 'Scan ID'}
        </button>
      </div>

      {error && (
        <div style={styles.section}>
          <h3 style={{ color: 'red' }}>Error:</h3>
          <p>{error}</p>
        </div>
      )}

      {ocrResult && (
        <div style={styles.section}>
          <h3>OCR Extracted Text:</h3>
          <pre style={styles.pre}>{ocrResult}</pre>
        </div>
      )}

      {extractedInfo && (
        <div style={styles.section}>
          <h3>Extracted Information:</h3>
          <p>
            <strong>Name:</strong> {extractedInfo.name}
          </p>
          <p>
            <strong>ID Number:</strong> {extractedInfo.idNumber}
          </p>
          <p>
            <strong>Date of Birth:</strong> {extractedInfo.dateOfBirth}
          </p>
        </div>
      )}
    </div>
  );
};

// Simple inline styles for basic layout
const styles = {
  container: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
  },
  section: {
    margin: '20px 0',
  },
  button: {
    padding: '10px 20px',
    fontSize: '16px',
    cursor: 'pointer',
  },
  submitButton: {
    padding: '10px 30px',
    fontSize: '18px',
    cursor: 'pointer',
  },
  imagePreview: {
    width: '350px',
    height: 'auto',
    border: '1px solid #ccc',
    marginTop: '10px',
  },
  pre: {
    textAlign: 'left',
    maxHeight: '300px',
    overflowY: 'scroll',
    backgroundColor: '#f4f4f4',
    padding: '10px',
    borderRadius: '5px',
  },
};

export default App;