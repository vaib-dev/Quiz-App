const API_URL = '../questions.json';
let questions = [];
let saveQuestions = [];
let saveIndex = 0;
async function getQuestions() {
    try {
        const response = await fetch(API_URL);
        const data = await response.json();
        saveQuestions = data;
        return await data;
    } catch (error) {
        console.error(error);
    }
}

const start_btn = document.querySelector(".start_btn button");
const info_box = document.querySelector(".info_box");
const exit_btn = info_box.querySelector(".buttons .quit");
const continue_btn = info_box.querySelector(".buttons .restart");
const quiz_box = document.querySelector(".quiz_box");
const result_box = document.querySelector(".result_box");
const option_list = document.querySelector(".option_list");
const progress_line = document.querySelector("header .time_line");
const timeText = document.querySelector(".timer .time_left_txt");
const timeCount = document.querySelector(".timer .timer_sec");
// if startQuiz button clicked
start_btn.onclick = () => {
    info_box.classList.add("activeInfo"); //show info box
}

// if exitQuiz button clicked
exit_btn.onclick = () => {
    info_box.classList.remove("activeInfo"); //hide info box
}
let que_count = 0;
let que_numb = 1;
let userScore = 0;
let counter;
let counterLine;
let widthValue = 0;
let tickIconTag = '<div class="icon tick"><i class="fas fa-check"></i></div>';
let crossIconTag = '<div class="icon cross"><i class="fas fa-times"></i></div>';
let easyIconTag = '<div class="icon cross"><i class="fas fa-star"></i></div>';
let mediumIconTag = '<div class="icon cross"><i class="fas fa-star"></i><i class="fas fa-star"></i></div>';
let hardIconTag = '<div class="icon cross"><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i></div>';
const restart_quiz = result_box.querySelector(".buttons .restart");
const quit_quiz = result_box.querySelector(".buttons .quit");
const next_btn = document.querySelector("footer .next_btn");
const bottom_ques_counter = document.querySelector("footer .total_que");



next_btn.onclick = next;

function next(questions) {
    if (saveIndex < 20) { //if question count is less than total question length
        que_count++; //increment the que_count value
        que_numb++; //increment the que_numb value
        showQuestion(questions, que_count);
        timeCount.innerHTML = '';
        difficulty(questions, que_count);
        queCounter(que_numb); //passing que_numb value to queCounter
        timeText.textContent = "Level"; //change the timeText to Level
        next_btn.classList.remove("show"); //hide the next button
    } else {
        showResult(questions); //calling showResult function
    }

}


function showQuestion(questions) {
    const que_text = document.querySelector(".que_text");
    let que_tag;
    console.log(typeof (saveIndex), saveIndex + 1)
    //creating a new span and div tag for question and option and passing the value using array index
    que_tag = '<span>' + (saveIndex + 1) + ". " + decodeURIComponent(saveQuestions[saveIndex].question) + '</span>';
    let options = [
        decodeURIComponent(saveQuestions[saveIndex].incorrect_answers[0]),
        decodeURIComponent(saveQuestions[saveIndex].incorrect_answers[1]),
        decodeURIComponent(saveQuestions[saveIndex].incorrect_answers[2]),
        decodeURIComponent(saveQuestions[saveIndex].correct_answer)
    ];
    options.sort(() => Math.random() - 0.5); // shuffle options
    let option_tag = '';
    for (let i = 0; i < options.length; i++) {
        option_tag += '<div class="option"><span>' + options[i] + '</span></div>';
    }
    que_text.innerHTML = que_tag; //adding new span tag inside que_tag
    option_list.innerHTML = option_tag; //adding new div tag inside option_tag

    const option = option_list.querySelectorAll(".option");

    // set onclick attribute to all available options
    for (i = 0; i < option.length; i++) {
        option[i].setAttribute("onclick", "optionSelected(this, " + JSON.stringify(questions) + ")");
    }
    progressLine(questions);
}


function difficulty() {
    let difficulty = saveQuestions[saveIndex].difficulty;
    if (difficulty == "easy") {
        timeCount.insertAdjacentHTML('beforeend', easyIconTag);
    } else if (difficulty == "medium") {
        timeCount.insertAdjacentHTML('beforeend', mediumIconTag);
    } else if (difficulty == "hard") {
        timeCount.insertAdjacentHTML('beforeend', hardIconTag);
    }
}
function optionSelected(answer, questions) {
    let userAns = answer.textContent; //getting user selected option
    let correcAns = decodeURIComponent(questions[saveIndex].correct_answer); //getting correct answer from array
    const allOptions = option_list.children.length; //getting all option items

    if (userAns == correcAns) { //if user selected option is equal to array's correct answer
        userScore += 1; //upgrading score value with 1
        answer.classList.add("correct"); //adding green color to correct selected option
        answer.insertAdjacentHTML("beforeend", tickIconTag); //adding tick icon to correct selected option
    } else {
        answer.classList.add("incorrect"); //adding red color to correct selected option
        answer.insertAdjacentHTML("beforeend", crossIconTag); //adding cross icon to correct selected option

        for (i = 0; i < allOptions; i++) {
            if (option_list.children[i].textContent == correcAns) { //if there is an option which is matched to an array answer 
                option_list.children[i].setAttribute("class", "option correct"); //adding green color to matched option
                option_list.children[i].insertAdjacentHTML("beforeend", tickIconTag); //adding tick icon to matched option
            }
        }
    }
    for (i = 0; i < allOptions; i++) {
        option_list.children[i].classList.add("disabled"); //once user select an option then disabled all options
    }
    next_btn.classList.add("show"); //show the next button if user selected any option
    next_btn.addEventListener("click", () => {
        next(questions)
    })
}
function progressLine(questions) {
    const progress_percent = ((que_count + 1) / questions.length)*10;
    progress_line.style.width = progress_percent + "%";
  }  
function showResult(questions) {
  info_box.classList.remove("activeInfo"); //hide info box
    quiz_box.classList.remove("activeQuiz"); //hide quiz box
    result_box.classList.add("activeResult"); //show result box
    const scoreText = result_box.querySelector(".score_text");
    if (userScore > 17) { // if user scored more than 3
        //creating a new span tag and passing the user score number and total question number
        let scoreTag = '<span>Congrats! 🎉, You got <p>' + userScore + '</p> out of <p>' + questions.length + '</p></span>';
        scoreText.innerHTML = scoreTag;  //adding new span tag inside score_Text
    }
    else if (userScore > 12) { // if user scored more than 1
        let scoreTag = '<span>Cool 😎, You got <p>' + userScore + '</p> out of <p>' + questions.length + '</p></span>';
        scoreText.innerHTML = scoreTag;
    }
    else { // if user scored less than 1
        let scoreTag = '<span>Sorry 😐, You got only <p>' + userScore + '</p> out of <p>' + questions.length + '</p></span>';
        scoreText.innerHTML = scoreTag;
    }
}


continue_btn.onclick = () => {
    info_box.classList.remove("activeInfo"); //hide info box
    quiz_box.classList.add("activeQuiz"); //show quiz box
    getQuestions().then(questions => {
        showQuestion(questions, 0);
        difficulty(questions, 0);
        queCounter(1, questions.length); //passing 1 parameter to queCounter
    });
}



function queCounter(index, questions) {
    let totalQueCounTag = '<span><p>' + (saveIndex + 1) + '</p> of <p>' + 20 + '</p> Questions</span>';
    bottom_ques_counter.innerHTML = totalQueCounTag;
}

$(".next_btn").click(function () {
    saveIndex++;
})

$(".replay").click(function () {
    window.location.reload();
})
$(".quit").click(function () {
    window.location.reload();
})
