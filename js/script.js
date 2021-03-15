let next = document.querySelector('.next');
let previous = document.querySelector('.previous');
let restart = document.querySelector('.restart');
let results = document.querySelector('.results');
let list = document.querySelector('.list');
let userScorePoint = document.querySelector('.userScorePoint');
let average = document.querySelector('.average');
let question = document.querySelector('.question');
let answers = document.querySelectorAll('.list-group-item');
let pointsElem = document.querySelector('.score');
let index = 0;
let points = 0;
let questionNumber = document.querySelector('#index');

fetch('https://quiztai.herokuapp.com/api/quiz')
    .then(resp => resp.json())
    .then(resp => {
        let preQuestions = resp;

        function setQuestion(index) {

            question.innerHTML = preQuestions[index].question;

            answers[0].innerHTML = preQuestions[index].answers[0];
            answers[1].innerHTML = preQuestions[index].answers[1];

            if (preQuestions[index].answers.length === 2) {
                answers[2].style.display = 'none';
                answers[3].style.display = 'none';
            } else {
                answers[2].style.display = 'block';
                answers[3].style.display = 'block';
            }

            answers[2].innerHTML = preQuestions[index].answers[2];
            answers[3].innerHTML = preQuestions[index].answers[3];
        }

        setQuestion(index);
        next.addEventListener('click', function () {
            index++;
            if (index >= preQuestions.length) {
                list.style.display = 'none';
                results.style.display = 'block';
                userScorePoint.innerHTML = points;
                average.innerHTML = JSON.parse(localStorage.getItem("average"));
            } else {
                questionNumber.innerHTML = index + 1;
                setQuestion(index);
                activateAnswers();
            }
        });

        previous.addEventListener('click', function () {
            if (index > 0) {
                index--;
                questionNumber.innerHTML = index + 1;
            }
            setQuestion(index);
            activateAnswers();
        });

        restart.addEventListener('click', function (event) {
            event.preventDefault();

            index = 0;
            questionNumber.innerHTML = index + 1;
            points = 0;
            let userScorePoint = document.querySelector('.score');
            userScorePoint.innerHTML = points;

            setQuestion(index);
            activateAnswers();
            list.style.display = 'block';
            results.style.display = 'none';


        });


        for (let i = 0; i < answers.length; i++) {
            answers[i].addEventListener('click', doAction);
        }

        function doAction(event) {
            //event.target - Zwraca referencję do elementu, do którego zdarzenie zostało pierwotnie wysłane.
            if (event.target.innerHTML === preQuestions[index].correct_answer) {
                points++;
                pointsElem.innerText = points;
                markCorrect(event.target);
            } else {
                markInCorrect(event.target);
            }
            disableAnswers();
            if (index === preQuestions.length - 1) {
                saveLocalResults();
            }
        }


        function activateAnswers() {
            for (let i = 0; i < answers.length; i++) {
                answers[i].addEventListener('click', doAction);
                if (answers[i].classList.contains('correct')) {
                    answers[i].classList.remove('correct');
                } else if (answers[i].classList.contains('incorrect')) {
                    answers[i].classList.remove('incorrect');
                }
            }
        }

        activateAnswers();

        function disableAnswers() {
            for (let i = 0; i < answers.length; i++) {
                answers[i].removeEventListener('click', doAction);
            }
        }

        function markCorrect(elem) {
            elem.classList.add('correct');
        }

        function markInCorrect(elem) {
            elem.classList.add('incorrect');
        }


        function saveLocalResults() {
            let rounds = JSON.parse(localStorage.getItem("rounds"));
            let sum = JSON.parse(localStorage.getItem("sum"));
            if (rounds == null) {
                rounds = 0;
            }
            if (sum == null) {
                sum = 0;
            }
            rounds += 1;
            sum = sum + points;
            let average = sum / rounds;
            localStorage.setItem("rounds", JSON.stringify(rounds));
            localStorage.setItem("sum", JSON.stringify(sum));
            localStorage.setItem("average", JSON.stringify(average));
            console.log(rounds);
            console.log(sum);
            console.log(average);
        }

        questionNumber.innerHTML = index + 1;

    });
