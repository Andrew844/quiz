class Quiz {
  constructor (question, answer, checkBtn, address, result, sectionQuiz, sectionEnd, resultBtn, removeAnswersBtn) {
    this.answer = answer;
    this.result = result;
    this.address = address;
    this.checkBtn = checkBtn;
    this.question = question;
    this.resultBtn = resultBtn;
    this.sectionEnd = sectionEnd;
    this.userAnswersArr = new Set();
		this.rightAnswersArr = new Set();
		this.removeAnswers = removeAnswersBtn;
    this.sectionQuiz = sectionQuiz;
    this.counterRightAnswers = 0;
    this.counterQuestions = 0;
    this.counterAnswers = 0;
    this.answersArr = [];
    this.questions = 0;
  }

  //Вывод длины массива вопросов
  lengthOfQuestions () {
    fetch(this.address + "questions")
      .then(response => response.json())
      .then(questions => {
        this.questions = questions;
      })
      .catch(console.log)
      return this.questions.length;
  }

  //Вывод вопросов и ответов на экран
  outputValues (arr) {
    let displayQuestion = document.createElement("p");
    
    displayQuestion.innerText = arr[this.counterQuestions].question;
    displayQuestion.classList.add("questionsAndAnswers");
    
    for(let i = 0; i < arr[this.counterQuestions].answers.length; i++) {
      let arrAnswers = document.createElement("p"),
          currentElement = arr[this.counterQuestions].answers[i],
          lastSymbol = currentElement[currentElement.length - 1];
      if (lastSymbol === "*") {
        currentElement = currentElement.split(lastSymbol, 1).toString();
        arrAnswers.innerText = currentElement;
      } else {
        arrAnswers.innerText = currentElement;
      }
      arrAnswers.id = i;
      arrAnswers.classList.add("questionsAndAnswers");
      arrAnswers.addEventListener("click", () => {
				if (arrAnswers.style.color != "white") {
					arrAnswers.style.backgroundColor = "rgb(20, 28, 252)";
					arrAnswers.style.color = "white";
					this.addUserAnswersToArr(arrAnswers);
				} else {
					arrAnswers.style.backgroundColor = "#eaeaea";
					arrAnswers.style.color = "black";
					this.removeUserAnswers(arrAnswers.innerText);
				}
      })
      answer.appendChild(arrAnswers);
    }
    question.appendChild(displayQuestion);
  };

  //Удаление вопросов и ответов с экрана
  removeQuestionsAndAnswers () {
    let p = document.querySelectorAll("p.questionsAndAnswers");
    p.forEach((el) => {
      el.remove();
    })
  };

  //Вывод вопросов и ответов на экран и их удаление при клике на кнопку
  displayQuestionsAndAnswers () {
    fetch(this.address + "questions")
    .then((response) => response.json())
    .then((questions) => {
      for(let i = 0; i < questions.length; i++) {
        this.answersArr.push(questions[i]);
      }
      return this.answersArr;
    })
    .then((answersArr) => {
      this.outputValues(answersArr);
      this.counterQuestions++;
    })
    .catch(console.log);
    this.removeQuestionsAndAnswers();
  }
  
  //Запись ответов пользователя
  addUserAnswersToArr (answer) {
    if (answer.innerText) {
      this.userAnswersArr.add(answer.innerText);
		}
    return this.userAnswersArr;
  };

  //Запись правильных ответов
  trueAnswers () {
    fetch(this.address + "questions")
      .then(response => response.json())
      .then((questions) => {
        let currentAnswers = [],
            lastSymbol = "";
        for (let i = 0; i < questions.length; i++) {
          currentAnswers = questions[i].answers;
          for(let j = 0; j < currentAnswers.length; j++) {
            lastSymbol = currentAnswers[j][currentAnswers[j].length - 1];
            if (lastSymbol === "*") {
              this.rightAnswersArr.add(currentAnswers[j].split(lastSymbol, 1).toString());
            }
          }
        }
      })
      .catch(console.log);
    }
  //Проверка ответов
  checkAnswers(questionsLength) {
    if (questionsLength != undefined && this.counterQuestions >= questionsLength) {
      this.rightAnswersArr.forEach(rightAnswer => {
        this.userAnswersArr.forEach(userAnswer => {
          if (rightAnswer === userAnswer) {
            this.counterRightAnswers++;
          } else if (rightAnswer !== userAnswer && this.counterRightAnswers > 0) {
						this.counterRightAnswers -= 0.1;
						this.counterRightAnswers = Math.round(this.counterRightAnswers);
					}
        })
      })
    }
      return this.counterRightAnswers;
  }

  //Вывод соотношения правильных/неправильных ответов на экран
  count (rightAnswers, questionsLength) {
    if (questionsLength != undefined && this.counterQuestions >= questionsLength) {
      this.sectionQuiz.style.display = "none";
      this.sectionEnd.style.display = "block";
      this.result.innerHTML += "<i> " + rightAnswers + " из " + this.rightAnswersArr.size + "</i>";
    } else {
      this.sectionQuiz.style.display = "block";
      this.sectionEnd.style.display = "none";
    }
  }

  //Получение имени пользователя и отправка результатов на сервер
  async dataToServer () {
				if (document.querySelector("#enter-name__input").value != "") {
					await	fetch(this.address + "useranswers", {
						method: "POST",
						body: JSON.stringify({
							name: document.querySelector("section.end .enter-name #enter-name__input").value,
							score: this.counterRightAnswers
						}),
						headers: {
							"Content-type": "application/json; charset=UTF-8"
						}
					})
						.catch(console.log);
				
						document.querySelector("#enter-name__input").value = "";
						window.location.reload();
				} else {
					this.showErrorMessage(700, "Ошибка: не введено имя пользователя");
				}
	}

	// Вывод сообщения об ошибке при отправке данных на сервер для незаполненной формы
	showErrorMessage (timeout, errorText) {
		let errorMessage = document.createElement("p");
		errorMessage.innerText = errorText;
		errorMessage.style = "height: 45px; width: 350px; line-height: 45px; background-color: red; color: white; margin-top: -24.9%; float: right; border-radius: 5px; display: block;";
		document.querySelector(".enter-name").append(errorMessage);
		setTimeout(() => {
			errorMessage.style = "display: none;"
		}, timeout);
	}

	// Удаление ответов из массива
	removeUserAnswers (answer) {
		if (this.userAnswersArr.has(answer)) this.userAnswersArr.delete(answer);
	}

	//Действия при клике на кнопку "Проверить ответы"
	clickOnCheckBtn () {
		this.lengthOfQuestions();
		this.displayQuestionsAndAnswers();
		this.trueAnswers();
		this.count(this.checkAnswers(this.lengthOfQuestions()), this.lengthOfQuestions());
	}

	//Действия, которые должны выполняться до начала викторины
	startQuiz () {
		this.displayQuestionsAndAnswers();
		this.count();
	}
}