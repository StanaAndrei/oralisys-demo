import {useRef, useState} from 'react';
import Spinner from './Spinner.jsx';

const PersonalInfoForm = ({ handleOnPersonalInfoFormSubmited }) => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [cnp, setCnp] = useState('');
    const [idCardSeries, setIdCardSeries] = useState('');
    const [idCardNumber, setIdCardNumber] = useState('');

    const fileInputRef = useRef(null);

    const handleButtonClick = () => {
        // Trigger click on the hidden file input
        fileInputRef.current.click();
    };

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

        setIsProcessing(true);
        setTimeout(() =>  {
            setSelectedImage(URL.createObjectURL(file));
            setIsProcessing(true);

            //hardocded values
            setFirstName('Păsaran');
            setLastName('Răzvan-Andrei');
            setCnp('5030824350013');
            setIdCardSeries('MH');
            setIdCardNumber('654869');
            setIsProcessing(false);
        }, 3000);
    };

    return (
        <div className="max-w-lg mx-auto p-4">
            <h2 className="text-2xl font-bold mb-8 text-blue-900">Formular pentru informații personale</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block mb-1 text-sm font-bold text-blue-950" htmlFor="firstName">
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
                        <label className="block mb-1 text-sm font-bold text-blue-950" htmlFor="lastName">
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
                    <label className="block mb-1 text-sm font-bold text-blue-950" htmlFor="cnp">
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
                        <label className="block mb-1 text-sm font-bold text-blue-950" htmlFor="idCardSeries">
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
                        <label className="block mb-1 text-sm font-bold text-blue-950" htmlFor="idCardNumber">
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

                <div className="upload-container mt-4">
                    { !isProcessing && !selectedImage &&
                        <button
                            onClick={handleButtonClick}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
                        >
                            {/* SVG Icon */}
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"
                                xmlns="http://www.w3.org/2000/svg">
                                <path d="M4 3a2 2 0 00-2 2v5h2V5h12v5h2V5a2 2 0 00-2-2H4z"></path>
                                <path
                                    d="M4 13a2 2 0 00-2 2v3a2 2 0 002 2h12a2 2 0 002-2v-3a2 2 0 00-2-2H4zm5-3l3 3h-2v4H8v-4H6l3-3z"></path>
                            </svg>
                            <span>Upload ID Image</span>
                        </button>
                    }

                    { isProcessing && <Spinner /> }

                    {/* Hidden file input */}
                    <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        accept="image/*"
                        onChange={handleImageUpload} // Handle file selection here
                    />
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
