class AdminPanel {
	constructor (questions, question, answer, addQuestion, addAnswer, addToServer, error, address, MQL, MAL) {
		this.sectionEditQuestions = document.querySelector("section.edit-questions");
		this.editAllQuestions = document.querySelector(".edit-all_questions");
		this.showQuestionsBtn = document.querySelector("#show-questions");
		this.sectionQuiz = document.querySelector(".quiz");
		this.backToQuiz = document.querySelector("#back");
		this.hideBtn = document.querySelector(".hideBtn");
		this.tips = document.querySelector(".tips");
		this.addQuestionBtn = addQuestion;
		this.addToServerBtn = addToServer;
		this.questionsAndAnswers = [];
		this.addAnswerBtn = addAnswer;
		this.questionsCounter = 0;
		this.questions = questions;
		this.question = question;
		this.address = address;
		this.answer = answer;
		this.error = error;
		this.MQL = MQL; //max question length
		this.MAL = MAL; //max answer length
	}

	//Вывод вопроса на дисплей
	addQuestion () {
		if (this.question.value.length <= MQL && this.question.value.length > 0) {
			let p = document.createElement("p");
			p.innerText = this.question.value;
			this.questions.appendChild(p);
			this.questionsAndAnswers.push(this.question.value);
			this.addQuestionBtn.disabled = true;
			this.questionsCounter++;
		} else {
			this.error.innerText = "Ошибка: неверная длина вопроса";
			this.error.style.display = "block";
			setTimeout(function () {
				error.style.display = "none";
			}, 700);
		}
		this.question.value = "";
	}

	//Вывод ответа на дисплей
	addAnswer () {
		if (this.answer.value.length <= MAL && this.answer.value.length > 0 && this.questionsCounter > 0) {
			let p = document.createElement("p");
			p.classList.add("answer");
			p.innerText = this.answer.value;
			this.questions.appendChild(p);
			this.questionsAndAnswers.push(this.answer.value);
			if(this.questionsAndAnswers.length === 11) this.addAnswerBtn.disabled = true;
		} else if (this.questionsCounter === 0) {
			this.error.innerText = "Ошибка: сначала введите вопрос";
			this.error.style.display = "block";
			setTimeout(function () {
				error.style.display = "none";
			}, 700);
		} else {
			this.error.innerText = "Ошибка: неверная длина ответа";
			this.error.style.display = "block";
			setTimeout(function () {
				error.style.display = "none";
			}, 700);
		}
		this.answer.value = "";
	}

	//Отправка вопросов и ответов на сервер
	addToServer () {
		if (this.questionsAndAnswers.length > 2) {
			fetch(this.address + "/questions", {
				method: "POST",
				body: JSON.stringify({
					question: this.questionsAndAnswers.shift(),
					answers: this.questionsAndAnswers
				}),
				headers: {
					"Content-type": "application/json; charset=UTF-8"
				}
			})
				.then(function () {
					window.location.reload();
				})
				.catch(console.log);
		} else {
			this.error.innerText = "Ошибка: недостаточно ответов";
			this.error.style.display = "block";
			setTimeout(function () {
				error.style.display = "none";
			}, 700);
		}
	}
	
	//При клике на кнопку "Скрыть" в правилах использования админ-панели
	hideTips () {
			this.tips.style.display = "none";
	}

	//Инициализация библиотеки materialize css
	initializeMaterialCss () {
		document.addEventListener('DOMContentLoaded', function() {
			let elems = document.querySelectorAll('.collapsible'),
					instances = M.Collapsible.init(elems);
		});
	}

	//Показать список всех вопросов при клике на кнопку "Показать вопросы"
	showQuestions () {
		if (this.sectionEditQuestions.style = "display: none") {
			this.tips.style.display = "none";
			this.sectionQuiz.style = "display: none;";
			this.sectionEditQuestions.style = "display: block";
		} else {
			this.tips.style.display = "block";
			this.sectionQuiz.style = "display: block;";
			this.sectionEditQuestions.style = "display: none"
		}
	}

	//Показывает админ-панель при клике на кнопку "Назад"
	showQuiz () {
		if (this.sectionEditQuestions.style = "display: block") {
			this.tips.style.display = "block";
			this.sectionQuiz.style = "display: block;";
			this.sectionEditQuestions.style = "display: none";
		} else {
			this.sectionQuiz.style = "display: none;";
			this.sectionEditQuestions.style = "display: block"
		}
	}

	//Выводит все вопросы и ответы к ним при клике на кнопку "Показать все вопросы"
	async showQuestionsAndAnswers () {
		await fetch(this.address + "/questions")
							.then(response => response.json())
							.then(questionsAndAnswersArr => {
								questionsAndAnswersArr.forEach(elements => {
									let li = document.createElement("li"),
											question = document.createElement("div");
										question.classList.add("collapsible-header");
										question.innerText = elements.question;
										li.append(question);
										for(let i = 0; i < elements.answers.length; i++) {
											let answer = document.createElement("div");
											answer.innerText = elements.answers[i];
											answer.classList.add("collapsible-body");
											answer.style = `background-color: #cfcfcf;
																			color: white;`;
											li.append(answer);
										}
									this.editAllQuestions.append(li);
								});
							})
							.catch(console.log);
	}

	startQuiz () {
		this.initializeMaterialCss();
		this.hideBtn.addEventListener("click", () => this.hideTips());
		this.backToQuiz.addEventListener("click", () => this.showQuiz())
		this.addAnswerBtn.addEventListener("click", () => this.addAnswer());
		this.addQuestionBtn.addEventListener("click", () => this.addQuestion());
		this.addToServerBtn.addEventListener("click", () => this.addToServer());
		this.showQuestionsBtn.addEventListener("click", () => this.showQuestions());
		this.showQuestionsBtn.addEventListener("click", () => this.showQuestionsAndAnswers());
	}
}