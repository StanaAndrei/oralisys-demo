import QuestionList from './components/QuestionList.jsx';
import PersonalInfoForm from './components/PersonalInfoForm.jsx';
import { useState } from 'react';
import { questionsData } from '../datastore/questions-pacient-state.js';
import Logo from './assets/logo-blue.png';

function App() {
    const [personalInfo, setPersonalInfo] = useState(null);

    const handleFormFinalSubmit = (questionListAnswersForm) => {
        console.log({
            personalInfo,
            questionListAnswers: questionListAnswersForm
        });
    };

    return (
        <>
            <section className="py-12 bg-transparent sm:py-16 lg:py-20 xl:py-24">
                <div className="px-4 mx-auto sm:px-6 lg:px-8 max-w-7xl">
                    <div className="relative mx-auto overflow-hidden max-w-7xl rounded-3xl p-4">
                        <img className="w-16 md:w-24 lg:w-32 xl:w-full mb-8"
                            src="https://landingfoliocom.imgix.net/store/collection/saasui/images/newsletter/3/ring-pattern.svg"
                            alt=""/>

                        <div className="relative px-8 py-12 md:p-16 xl:p-24">
                            <img src={Logo} alt="Oralisys Logo" className="mx-auto mb-32" style={{width: '70%'}}/>

                            <div className="max-w-2xl mx-auto text-center">
                                <h2 className="text-3l font-semibold tracking-tight text-black sm:text-4xl lg:text-5xl">Chestionar
                                    pentru starea de sanatate</h2>
                                <p className="mt-4 text-base font-normal leading-7 text-gray-400 lg:text-lg lg:mt-6 lg:leading-8">
                                    Revoluționează experiența pacienților tăi! Completează documentele stomatologice instant,
                                    prin scanarea unui singur cod QR.
                                </p>
                            </div>
                        </div>
                        <div className="max-w-lg mx-auto p-4 bg-white rounded-3xl">
                            {
                                personalInfo ?
                                    <QuestionList questionsData={questionsData}
                                        handleFormFinalSubmit={handleFormFinalSubmit}/> :
                                    <PersonalInfoForm handleOnPersonalInfoFormSubmited={setPersonalInfo}/>
                            }
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}

export default App;
