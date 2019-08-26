let question = document.querySelector(".question"),
		answer = document.querySelector(".answers"),
		checkBtn = document.querySelector(".btns input"),
		address = "http://127.0.0.1:3000/",
		sectionQuiz = document.querySelector("section.quiz"),
		sectionEnd = document.querySelector("section.end"),
		result = document.querySelector("section.end .section-header h2"),
		resultBtn = document.querySelector("section.end .enter-name input[type='button']"),
		removeAnswers = document.querySelector(".removeAnswers");

const quiz = new Quiz(question, answer, checkBtn, address, result, sectionQuiz, sectionEnd, resultBtn, removeAnswers);
		
quiz.startQuiz();
quiz.checkBtn.addEventListener("click", () => quiz.clickOnCheckBtn());
quiz.answer.addEventListener("click", answer => quiz.addUserAnswersToArr(answer));
quiz.resultBtn.addEventListener("click", () => quiz.dataToServer());