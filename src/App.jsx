import { useState } from 'react';
import { createWorker } from 'tesseract.js';
import './App.css';

function App() {
  const [extractedText, setExtractedText] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const preprocessImage = async (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          canvas.width = img.width;
          canvas.height = img.height;
          ctx.drawImage(img, 0, 0);
          ctx.filter = 'contrast(1.2) brightness(1.1)';
          ctx.drawImage(img, 0, 0);
          resolve(canvas.toDataURL('image/jpeg', 1.0));
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    });
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setSelectedImage(URL.createObjectURL(file));
    setIsProcessing(true);
    
    try {
      const processedImage = await preprocessImage(file);
      const worker = await createWorker();
      
      await worker.setParameters({
        tessedit_char_whitelist: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789./- ',
        //preserve_interword_spaces: '1',
        //tessedit_pageseg_mode: '6',
      });

      const { data: { text } } = await worker.recognize(processedImage);
      const parsedData = parseRomanianID(text);
      setExtractedText(parsedData);
      
      await worker.terminate();
    } catch (error) {
      console.error('Error processing image:', error);
      setExtractedText({ error: 'Eroare la procesarea imaginii. Încercați din nou.' });
    }
    setIsProcessing(false);
  };

  const parseRomanianID = (text) => {
    const lines = text.split('\n');
    const parsed = {
      cnp: '',
      seria: '',
      numar: '',
      nume: '',
      prenume: '',
      cetatenie: '',
      locNastere: '',
      domiciliu: '',
      emitent: '',
      dataEmiterii: '',
      valabilitate: ''
    };

    console.log('====================================');
    console.log(text);
    console.log('====================================');
    text = text.toUpperCase();
    lines.forEach(line => {
      // CNP extraction
      const cnpMatch = line.match(/\b\d{13}\b/);
      if (cnpMatch) parsed.cnp = cnpMatch[0];

      // Seria and Number
      const seriaMatch = line.match(/SERIA\s*([A-Z]{2})/i);
      if (seriaMatch) parsed.seria = seriaMatch[1];
      
      const numarMatch = line.match(/NR\.\s*(\d{6})/i);
      if (numarMatch) parsed.numar = numarMatch[1];

      // Name and First name
      if (line.includes('NUME') || line.includes('NOM') || line.includes('LAST NAME')) {
        const nextLine = lines[lines.indexOf(line) + 1];
        if (nextLine) parsed.nume = nextLine.trim();
      }
      
      if (line.includes('PRENUME') || line.includes('PRENOM') || line.includes('FIRST NAME')) {
        const nextLine = lines[lines.indexOf(line) + 1];
        if (nextLine) parsed.prenume = nextLine.trim();
      }

      // Address
      if (line.includes('DOMICILIU') || line.includes('ADRESSE') || line.includes('ADDRESS')) {
        const nextLine = lines[lines.indexOf(line) + 1];
        if (nextLine) parsed.domiciliu = nextLine.trim();
      }

      // Validity date
      const dateMatch = line.match(/\d{2}\.\d{2}\.\d{2}.*\d{2}\.\d{2}\.\d{4}/);
      if (dateMatch) parsed.valabilitate = dateMatch[0];
    });

    // MRZ backup check
    const mrzLine = lines.find(line => line.includes('<<'));
    if (mrzLine && (!parsed.nume || !parsed.prenume)) {
      const mrzParts = mrzLine.split('<<');
      if (mrzParts.length >= 2) {
        parsed.nume = mrzParts[0].replace(/[^A-Z]/g, '');
        parsed.prenume = mrzParts[1].split('<')[0];
      }
    }

    return parsed;
  };

  return (
    <div className="App">
      <h1>Scanner Buletin</h1>
      
      <div className="upload-container">
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          disabled={isProcessing}
          className="file-input"
        />
        
        {selectedImage && (
          <div className="preview-container">
            <img 
              src={selectedImage} 
              alt="Preview" 
              style={{ maxWidth: '100%', maxHeight: '300px' }}
            />
          </div>
        )}
      </div>

      {isProcessing && <p>Se procesează...</p>}

      {extractedText && (
        <div className="results">
          <h2>Informații Extrase:</h2>
          <div className="extracted-data">
            {extractedText.error ? (
              <p className="error">{extractedText.error}</p>
            ) : (
              <>
                <p><strong>CNP:</strong> {extractedText.cnp}</p>
                <p><strong>Seria:</strong> {extractedText.seria}</p>
                <p><strong>Număr:</strong> {extractedText.numar}</p>
                <p><strong>Nume:</strong> {extractedText.nume}</p>
                <p><strong>Prenume:</strong> {extractedText.prenume}</p>
                <p><strong>Domiciliu:</strong> {extractedText.domiciliu}</p>
                <p><strong>Valabilitate:</strong> {extractedText.valabilitate}</p>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;