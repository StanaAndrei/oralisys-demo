import { useState } from 'react';

const PersonalInfoForm = ({ handleOnPersonalInfoFormSubmited }) => {
    const [firstName, setFirstName] = useState('asd');
    const [lastName, setLastName] = useState('');
    const [cnp, setCnp] = useState('');
    const [idCardSeries, setIdCardSeries] = useState('');
    const [idCardNumber, setIdCardNumber] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle form submission logic here
        console.log({
            firstName,
            lastName,
            cnp,
            idCardSeries,
            idCardNumber,
        });

        handleOnPersonalInfoFormSubmited({
            firstName,
            lastName,
            cnp,
            idCardSeries,
            idCardNumber,
        });
    };
    const [isProcessing, setIsProcessing] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);

    const handleImageUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        setSelectedImage(URL.createObjectURL(file));
        setIsProcessing(true);

        //hardocded values
        setFirstName('Pasaran');
        setLastName('Razvan-Andrei');
        setCnp('5030824350013');
        setIdCardSeries('MH');
        setIdCardNumber('654869');

        setIsProcessing(false);
    };

    return (
        <div className="max-w-lg mx-auto p-4">
            <h2 className="text-2xl font-bold mb-4">Formular pentru informatii personale</h2>
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
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block mb-1 text-sm font-medium" htmlFor="firstName">
              Nume
                        </label>
                        <input
                            type="text"
                            id="firstName"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            required
                            className="border border-gray-300 rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block mb-1 text-sm font-medium" htmlFor="lastName">
              Prenume
                        </label>
                        <input
                            type="text"
                            id="lastName"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            required
                            className="border border-gray-300 rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>

                <div>
                    <label className="block mb-1 text-sm font-medium" htmlFor="cnp">
            CNP
                    </label>
                    <input
                        type="text"
                        id="cnp"
                        value={cnp}
                        onChange={(e) => setCnp(e.target.value)}
                        required
                        className="border border-gray-300 rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block mb-1 text-sm font-medium" htmlFor="idCardSeries">
              Serie buletin
                        </label>
                        <input
                            type="text"
                            id="idCardSeries"
                            value={idCardSeries}
                            onChange={(e) => setIdCardSeries(e.target.value)}
                            required
                            className="border border-gray-300 rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block mb-1 text-sm font-medium" htmlFor="idCardNumber">
              Numar buletin
                        </label>
                        <input
                            type="text"
                            id="idCardNumber"
                            value={idCardNumber}
                            onChange={(e) => setIdCardNumber(e.target.value)}
                            required
                            className="border border-gray-300 rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white font-semibold rounded-lg p-2 hover:bg-blue-600 transition duration-200"
                    onClick={handleSubmit}
                >
          Submit
                </button>
            </form>
        </div>
    );
};

export default PersonalInfoForm;
