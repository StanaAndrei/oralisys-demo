const MultipleChoiceQuestion = ({ question, selectedAnswer, onOptionChange }) => {
    return (
        <div className="mb-4">
            <h3 className="font-medium mb-2">{question.text}</h3>
            {question.options.map((option) => (
                <div key={option.id} className="mb-2">
                    <label className="flex items-center cursor-pointer">
                        <input
                            type="radio"
                            name={`question-${question.id}`}
                            value={option.id}
                            checked={selectedAnswer?.id === option.id}
                            onChange={() => onOptionChange(option)}
                            className="form-radio text-blue-600 h-4 w-4"
                        />
                        <span className="ml-2 text-gray-700">{option.label}</span>
                    </label>
                </div>
            ))}
        </div>
    );
};

export default MultipleChoiceQuestion;
