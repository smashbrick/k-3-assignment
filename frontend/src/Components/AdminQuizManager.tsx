import React, { useState, useEffect } from "react";

interface Question {
	id: string;
	questionText: string;
	options: string[];
	correctAnswer: number;
	marks: number;
}

interface NewQuestion {
	id: string;
	questionText: string;
	options: string[];
	correctAnswer: number;
	marks: number;
}

function AdminQuizManager() {
	const [questions, setQuestions] = useState<Question[]>([]);
	const [newQuestion, setNewQuestion] = useState<NewQuestion>({
		id: "",
		questionText: "",
		options: ["", "", "", ""],
		correctAnswer: 1,
		marks: 1,
	});
	const [isLoggedIn, setIsLoggedIn] = useState(false);

	const fetchData = async () => {
		try {
			const response = await fetch(
				"http://127.0.0.1:5000/api/getQuizQuestions"
			);
			if (!response.ok) {
				throw new Error("Network response was not ok");
			}
			const data = await response.json();
			const questions: Question[] = [];

			// @ts-expect-error any type fix
			data.map((d) => {
				const q: Question = {
					id: d.id,
					questionText: d.question_text,
					options: d.options,
					correctAnswer: d.correct_answer,
					marks: d.marks,
				};

				questions.push(q);
			});

			setQuestions(questions);
		} catch (error) {
			console.error("Error fetching quiz data:", error);
		}
	};

	useEffect(() => {
		const fetchQuizData = async () => {
			try {
				await fetchData();
			} catch (error) {
				console.error("Error fetching quiz data:", error);
			}
		};

		fetchQuizData();
	}, []);

	const handleInputChange = (
		field: keyof NewQuestion,
		value: string | number | string[]
	) => {
		setNewQuestion({ ...newQuestion, [field]: value });
	};

	const handleOptionChange = (index: number, value: string) => {
		const updatedOptions = [...newQuestion.options];
		updatedOptions[index] = value;
		setNewQuestion({ ...newQuestion, options: updatedOptions });
	};

	const handleAddQuestion = async () => {
		if (
			newQuestion.questionText.trim() &&
			newQuestion.options.every((opt) => opt.trim()) &&
			newQuestion.correctAnswer >= 1 &&
			newQuestion.correctAnswer <= 4 &&
			newQuestion.marks > 0
		) {
			try {
				const response = await fetch(
					"http://127.0.0.1:5000/api/createQuestion",
					{
						method: "POST",
						headers: {
							"Content-Type": "application/json",
						},
						body: JSON.stringify(newQuestion),
					}
				);

				if (!response.ok) {
					throw new Error("Failed to add question.");
				}

				await fetchData();
			} catch (error) {
				if (error instanceof Error) {
					alert(`Error: ${error.message}`);
				} else {
					alert("An unknown error occurred.");
				}
			}
		} else {
			alert("Please fill all fields correctly.");
		}
	};

	const handleDeleteQuestion = async (questionId: string) => {
		try {
			const response = await fetch(
				`http://127.0.0.1:5000/api/deleteQuestionByID/${questionId}`,
				{
					method: "DELETE",
				}
			);
			if (!response.ok) {
				throw new Error("Failed to delete question.");
			}
			setQuestions(questions.filter((q) => q.id !== questionId));
		} catch (error) {
			alert(`Error deleting question: ${error}`);
		}
	};

	const handleLogin = (username: string, password: string) => {
		if (username === "admin" && password === "password") {
			setIsLoggedIn(true);
		} else {
			alert("Invalid credentials");
		}
	};

	if (!isLoggedIn) {
		return <Login onLogin={handleLogin} />;
	}

	return (
		<div className="min-h-screen bg-gray-100 p-6">
			<h1 className="text-3xl font-bold text-center mb-6">
				Admin Quiz Manager
			</h1>
			<div className="bg-white p-6 rounded shadow-md max-w-2xl mx-auto">
				<h2 className="text-2xl font-bold mb-4">Create a New Question</h2>
				<div className="mb-4">
					<label className="block text-gray-700 font-medium mb-2">
						Question Text
					</label>
					<input
						type="text"
						value={newQuestion.questionText}
						onChange={(e) => handleInputChange("questionText", e.target.value)}
						className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
					/>
				</div>
				{newQuestion.options.map((option, index) => (
					<div className="mb-4" key={index}>
						<label className="block text-gray-700 font-medium mb-2">
							Option {index + 1}
						</label>
						<input
							type="text"
							value={option}
							onChange={(e) => handleOptionChange(index, e.target.value)}
							className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
						/>
					</div>
				))}
				<div className="mb-4">
					<label className="block text-gray-700 font-medium mb-2">
						Correct Answer
					</label>
					<select
						value={newQuestion.correctAnswer}
						onChange={(e) => handleInputChange("correctAnswer", e.target.value)}
						className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
					>
						{[1, 2, 3, 4].map((num) => (
							<option key={num} value={num}>
								Option {num}
							</option>
						))}
					</select>
				</div>
				<div className="mb-4">
					<label className="block text-gray-700 font-medium mb-2">Marks</label>
					<input
						type="number"
						min="1"
						value={newQuestion.marks}
						onChange={(e) =>
							handleInputChange("marks", parseInt(e.target.value))
						}
						className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
					/>
				</div>
				<button
					onClick={handleAddQuestion}
					className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600 transition duration-200"
				>
					Add Question
				</button>
			</div>
			<div className="mt-10 max-w-2xl mx-auto">
				<h2 className="text-2xl font-bold mb-4">Stored Questions</h2>
				{questions.map((q, index) => (
					<div
						key={index}
						className="bg-white p-4 rounded shadow-md mb-4 flex justify-between items-start"
					>
						<div>
							<p className="font-bold">{q.questionText}</p>
							<ul className="list-disc ml-5 mt-2">
								{q.options.map((opt, i) => (
									<li key={i}>{opt}</li>
								))}
							</ul>
							<p className="mt-2">
								<strong>Correct Answer:</strong> Option {q.correctAnswer}
							</p>
							<p>
								<strong>Marks:</strong> {q.marks}
							</p>
						</div>
						<button
							onClick={() => handleDeleteQuestion(q.id)}
							className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
						>
							Delete
						</button>
					</div>
				))}
			</div>
		</div>
	);
}

function Login({
	onLogin,
}: {
	onLogin: (username: string, password: string) => void;
}) {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		onLogin(username, password);
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-100">
			<div className="bg-white p-6 rounded shadow-md w-96">
				<h1 className="text-2xl font-bold mb-4 text-center">Admin Login</h1>
				<form onSubmit={handleSubmit}>
					<div className="mb-4">
						<label className="block text-gray-700 font-medium mb-2">
							Username
						</label>
						<input
							type="text"
							value={username}
							onChange={(e) => setUsername(e.target.value)}
							className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
						/>
					</div>
					<div className="mb-4">
						<label className="block text-gray-700 font-medium mb-2">
							Password
						</label>
						<input
							type="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
						/>
					</div>
					<button
						type="submit"
						className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition duration-200"
					>
						Login
					</button>
				</form>
			</div>
		</div>
	);
}

export default AdminQuizManager;
