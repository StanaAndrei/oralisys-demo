import QuestionList from './components/QuestionList.jsx';
import PersonalInfoForm from './components/PersonalInfoForm.jsx';
import { useState } from 'react';
import { questionsData } from '../datastore/questions-pacient-state.js';
import Logo from './assets/logo.png'

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
     <img src={Logo} style={{}} />
      <div className="max-w-lg mx-auto p-4">
        {
          personalInfo ?
            <QuestionList questionsData={questionsData} handleFormFinalSubmit={handleFormFinalSubmit} /> :
            <PersonalInfoForm handleOnPersonalInfoFormSubmited={setPersonalInfo} />
        }
      </div>
    </>
  );
}

export default App;
