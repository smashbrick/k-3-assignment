import { useState, useEffect } from "react";

type QuizQuestion = {
	id: string;
	question_text: string;
	options: string[];
	correct_answer: string;
	marks: number;
};

function QuizApp() {
	const [name, setName] = useState<string>("");
	const [quizStarted, setQuizStarted] = useState<boolean>(false);
	const [responses, setResponses] = useState<{ [key: number]: string }>({});
	const [submitted, setSubmitted] = useState<boolean>(false);
	const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
	const [quizData, setQuizData] = useState<QuizQuestion[]>([]);

	useEffect(() => {
		const fetchQuizData = async () => {
			try {
				const response = await fetch(
					"http://127.0.0.1:5000/api/getQuizQuestions"
				);
				if (!response.ok) {
					throw new Error("Network response was not ok");
				}
				const data = await response.json();
				setQuizData(data);
			} catch (error) {
				console.error("Error fetching quiz data:", error);
			}
		};

		fetchQuizData();
	}, []);

	const handleStartQuiz = () => {
		if (name.trim()) setQuizStarted(true);
	};

	const handleOptionChange = (option: string) => {
		setResponses({ ...responses, [currentQuestionIndex]: option });
	};

	const handleNext = () => {
		if (currentQuestionIndex < quizData.length - 1) {
			setCurrentQuestionIndex(currentQuestionIndex + 1);
		}
	};

	const handlePrevious = () => {
		if (currentQuestionIndex > 0) {
			setCurrentQuestionIndex(currentQuestionIndex - 1);
		}
	};

	const handleSubmit = async () => {
		setSubmitted(true);
	};

	const evaluateScore = (): { totalMarks: number; scoredMarks: number } => {
		let scoredMarks = 0;
		let totalMarks = 0;
		quizData.forEach((q, index) => {
			totalMarks += q.marks;
			if (responses[index] === q.correct_answer) {
				scoredMarks += q.marks;
			}
		});
		return { totalMarks, scoredMarks };
	};

	const getResult = (score: number, totalMarks: number): string => {
		const percentage = (score / totalMarks) * 100;
		if (percentage < 50) return "Failed";
		if (percentage <= 75) return "Good";
		return "Excellent";
	};

	if (!quizStarted) {
		return (
			<div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
				<h1 className="text-3xl font-bold mb-4">Welcome to the Quiz</h1>
				<input
					type="text"
					placeholder="Enter your name"
					value={name}
					onChange={(e) => setName(e.target.value)}
					className="p-2 border border-gray-300 rounded mb-4 w-64 text-center"
				/>
				<button
					onClick={handleStartQuiz}
					className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
				>
					Start Quiz
				</button>
			</div>
		);
	}

	if (submitted) {
		const { totalMarks, scoredMarks } = evaluateScore();
		const result = getResult(scoredMarks, totalMarks);
		return (
			<div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
				<h1 className="text-3xl font-bold mb-4">Results</h1>
				<p className="text-lg">Name: {name}</p>
				<p className="text-lg">
					Score: {scoredMarks} / {totalMarks}
				</p>
				<p className="text-lg">
					Evaluation:{" "}
					<span
						className={
							result === "Failed"
								? "text-red-500"
								: result === "Good"
								? "text-yellow-500"
								: "text-green-500"
						}
					>
						{result}
					</span>
				</p>
				<h2 className="text-2xl font-bold mt-6">Incorrect Answers:</h2>
				<ul className="mt-4">
					{quizData.map((q, index) => {
						if (responses[index] !== q.correct_answer) {
							return (
								<li key={index} className="mb-4">
									<strong>Question:</strong> {q.question_text} <br />
									<strong>Your Answer:</strong>{" "}
									{responses[index] || "No Answer"} <br />
									<strong>Correct Answer:</strong> {q.correct_answer}
								</li>
							);
						}
						return null;
					})}
				</ul>
			</div>
		);
	}

	const currentQuestion = quizData[currentQuestionIndex];

	return (
		<div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
			<h1 className="text-3xl font-bold mb-6">Quiz</h1>
			<div className="bg-white p-6 rounded shadow-md w-96">
				<p className="text-lg font-semibold mb-4">
					{currentQuestion.question_text}
				</p>
				{currentQuestion.options.map((option, optIndex) => (
					<label key={optIndex} className="block mb-2">
						<input
							type="radio"
							name={`question-${currentQuestionIndex}`}
							value={option}
							onChange={() => handleOptionChange(option)}
							checked={responses[currentQuestionIndex] === option}
							className="mr-2"
						/>
						{option}
					</label>
				))}
			</div>
			<div className="mt-4 flex space-x-4">
				<button
					onClick={handlePrevious}
					disabled={currentQuestionIndex === 0}
					className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 disabled:opacity-50"
				>
					Previous
				</button>
				<button
					onClick={handleNext}
					disabled={currentQuestionIndex === quizData.length - 1}
					className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
				>
					Next
				</button>
			</div>
			<button
				onClick={handleSubmit}
				className="bg-green-500 text-white px-6 py-2 rounded mt-6 hover:bg-green-600"
			>
				Submit
			</button>
		</div>
	);
}

export default QuizApp;
