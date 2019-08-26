class AdminPanel {
	constructor (questions, question, answer, addQuestion, addAnswer, addToServer, error, address, MQL, MAL) {
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
	
	hideTips () {
			this.tips.style.display = "none";
	} 
}