let	questions = document.querySelector(".questions"),
		addQuestion = document.getElementById("add_question"),
		addToServer = document.getElementById("add_to-server"),
		addAnswer = document.getElementById("add_answer"),
		question = document.getElementById("question"),
		answer = document.getElementById("answer"),
		error = document.querySelector(".error p"),
		address = "http://127.0.0.1:3000",
		questionsAndAnswers = [],
		MQL = 300, //max question length
		MAL = 30; //max answer length

const adminPanel = new AdminPanel(questions, question, answer, addQuestion, addAnswer, addToServer, error, address, MQL, MAL);

adminPanel.hideBtn.addEventListener("click", () => adminPanel.hideTips());
adminPanel.addQuestionBtn.addEventListener("click", () => adminPanel.addQuestion());
adminPanel.addAnswerBtn.addEventListener("click", () => adminPanel.addAnswer());
adminPanel.addToServerBtn.addEventListener("click", () => adminPanel.addToServer());