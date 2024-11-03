import { useState } from 'react';
import MultipleChoiceQuestion from './MultipleChoiceQuestion.jsx';

const QuestionsList = ({ questionsData, handleFormFinalSubmit }) => {
    const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);
    const [answers, setAnswers] = useState({});
    console.log(answers);

    const categories = Object.keys(questionsData);

    const handleAnswerChange = (questionId, answer) => {
        console.log(questionId, answer);
        setAnswers((prevAnswers) => ({
            ...prevAnswers,
            [questionId]: answer,
        }));
    };

    const handleSubmit = () => {
        console.log('Submitted Answers:', answers);
        handleFormFinalSubmit(answers);
    };

    const isAllAnswered = () => {
        const currentCategory = categories[currentCategoryIndex];
        return currentCategory && questionsData[currentCategory].every((q) => answers[q.id]);
    };

    const handleNextCategory = () => {
        if (isAllAnswered()) {
            setCurrentCategoryIndex((prevIndex) => Math.min(prevIndex + 1, categories.length - 1));
        }
    };

    return (
        <div className="max-w-3xl mx-auto p-4">
            {currentCategoryIndex < categories.length ? (
                <div>
                    <h2 className="text-2xl font-bold mb-4 text-blue-900">
                        Intrebari despre {categories[currentCategoryIndex]}
                    </h2>
                    {questionsData[categories[currentCategoryIndex]].map((question) => (
                        <MultipleChoiceQuestion
                            key={question.id}
                            question={question}
                            selectedAnswer={answers[question.id]}
                            onOptionChange={(answer) => handleAnswerChange(question.id, answer)}
                        />
                    ))}
                    <div className="flex justify-between mt-4">
                        {
                            currentCategoryIndex < categories.length - 1 && <button
                                onClick={handleNextCategory}
                                disabled={!isAllAnswered()}
                                className={`p-2 bg-blue-500 text-white rounded hover:bg-blue-950-600 transition duration-200 ${
                                    !isAllAnswered() ? 'opacity-50 cursor-not-allowed' : ''
                                }`}
                            >
                                Next Questions
                            </button>
                        }
                        {currentCategoryIndex === categories.length - 1 && (
                            <button
                                onClick={handleSubmit}
                                disabled={!isAllAnswered()}
                                className={`ml-4 p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-200 ${
                                    !isAllAnswered() ? 'opacity-50 cursor-not-allowed' : ''
                                }`}
                            >
                                Submit Answers
                            </button>
                        )}
                    </div>
                </div>
            ) : (
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-4">Thank you for completing the quiz!</h2>
                    <button onClick={() => setCurrentCategoryIndex(0)} className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-200">
                        Restart Quiz
                    </button>
                </div>
            )}
        </div>
    );
};

export default QuestionsList;
