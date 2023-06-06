
//LOAD
window.addEventListener('load', init);

//DOM Element
const body = document.querySelector("body");
const main = document.querySelector("#main");
const param1 = document.querySelector("#param1");
const param2 = document.querySelector("#param2");
const operator = document.querySelector("#operator");
const input = document.querySelector("#main input");
const nameOutput = document.querySelector("#name");
const round = document.querySelector("#round span:nth-of-type(1)");
const answered = document.querySelector("#round span:nth-of-type(2)");
const timeDisplay = document.querySelector("#time");
const scoreContainer = document.createElement("section");
const scoreTable = document.createElement("table");
const scoreHead = document.createElement("thead");
const scoreBody = document.createElement("tbody");

//Classes declaration
//Player
class Player {
     constructor(playerName, problems) {
          this.playerName = playerName;
          this.problems = problems;
          this.score = 0;
     }
     getScore() {
          let num = 0;
          for (let items of this.problems) {
               if (items.isCorrect) {
                    num++;
               }
          }
          this.score = num;
     }
}
//Question Class
class Question {
     constructor(p1, p2, operate) {
          this.p1 = p1;
          this.p2 = p2;
          this.operator = operate;
          this.answer = '';
          this.result = this.getResult();
          this.isCorrect;
     };
     getResult() {
          switch (this.operator) {
               case "+":
                    return this.p1 + this.p2;
                    break;
               case "-":
                    return this.p1 - this.p2;
                    break;
               case "x":
                    return this.p1 * this.p2;
                    break;
          }
     };
     checkAns() {
          this.isCorrect = (this.answer == this.result);
     }
}

//Variable
const username = extractQuery(window.location.search.toString(), 0);
const level = extractQuery(window.location.search.toString(), 1);
let time = 6;
let loop = 11;
let isPLaying = true;
let id;
const operation = ["+", "-", "x",];

// The first value: [max_time for each question]; the rest values: [num_digit, operator, num_digit] (twice for each question)
let questionOrder = {
     level1: [[/*time=*/10], [1, "+", 1], [2, "+", 2], [2, "-", 2], [1, "x", 1], [2, "x", 1]],
     level2: [[/*time=*/10], [3, "+", 2], [3, "+", 3], [3, "-", 3], [2, "x", 1], [1, "x", 2]],
     level3: [[/*time=*/20], [3, "+", 3], [4, "+", 4], [4, "-", 3], [4, "-", 4], [2, "x", 2]],
     level4: [[/*time=*/20], [4, "+", 4], [4, "-", 4], [5, "+", 5], [2, "x", 2], [2, "x", 2]]
} //Hardcode   
let questionList = new Array(); //Store player result
let player = new Player(username, questionList); //Store player's profile and result
const scoreHeadList = ["#", "Problem", "Your Answer", "Result"];


//Main function
function init() {
     //Set the element on the screen
     main.style.display = 'none';
     nameOutput.append(username);
     switch (level) {
          case "level1":
               round.innerHTML = "Level 1: ";
               break;
          case "level2":
               round.innerHTML = "Level 2: ";
               break;
          case "level3":
               round.innerHTML = "Level 3: ";
               break;
          case "level4":
               round.innerHTML = "Level 4: ";
               break;
     }

     //Start couting down at the beginning of the match 
     id = setInterval(countDown, 1000);

     //Listen to the Enter
     input.addEventListener("keydown", function (ev) {
          if (ev.key === "Enter") {
               initQuestion(false);
          }
     });
}
function stopGame() {
     //Remove the problems on the screen
     main.remove();

     //Stop the timer
     isPlaying = false;
     clearInterval(id);
     player.getScore();

     //Print out the score
     createTable();
     scoreContainer.append(scoreTable);
     scoreContainer.classList.add("scoreboard");
     body.append(scoreContainer);

     //Testing log
     console.log(player);
     console.log(player.score);
}
//Random function
//Note: creating two random function was uneccessary
function randomRange(min, max) {
     let mini = parseInt(min)
     let maxi = parseInt(max)
     return Math.floor(Math.random() * (max - min + 1)) + min

}
function randInt(NumDigit) {
     let digit = parseInt(NumDigit)
     return randomRange(10 ** (digit - 1), 10 ** digit - 1)
}
//Extract information from the queries
function extractQuery(queryString, i) {
     let queryList = queryString.substr(1).split('&')//name=something
     let qAttribute = queryList[i].split('=')[1]//something+something
     let stringList = qAttribute.split('+')//something...

     if (stringList.length > 1) {
          //[something1, something2]
          let result = ''
          for (let i = 0; i < stringList.length; i++) {
               if (i != stringList.lenght - 1) {
                    result += stringList[i]
                    result += ' '
               } else {
                    result += stringList[i]
               }
          }
          return result
     } else if (stringList.lenght < 1) {
          alert("Wrong Input")
          return null
     } else {
          return stringList[0]
     }
}
//Randomly create the question
function createQuestion(hardness, iteration) {
     //Creating new random operation
     let operate = questionOrder[hardness][Math.ceil((10 - iteration + 1) / 2)][1];
     let p1 = randInt(questionOrder[hardness][Math.ceil((10 - iteration + 1) / 2)][0]);
     let p2 = randInt(questionOrder[hardness][Math.ceil((10 - iteration + 1) / 2)][2]);
     console.log(Math.ceil((10 - iteration + 1) / 2));
     if (p2 > p1) {
          //Swap: Noice algorithm I learn from the internet
          p1 = p1 + p2;
          p2 = p1 - p2;
          p1 = p1 - p2;
     }

     //Declare
     operator.innerHTML = operate;
     param1.innerHTML = p1;
     param2.innerHTML = p2;
     let newQuestion = new Question(p1, p2, operate);
     questionList.push(newQuestion);
}
//Initialize New Question
function initQuestion(isFirstQuestion) {
     //value = 0 means it's the first question
     //value = 1 means it's not the first question
     if (!isFirstQuestion) {
          //Adding the answer to the questionList
          questionList[questionList.length - 1].answer = input.value;
          questionList[questionList.length - 1].checkAns();
     }
     if (loop > 1) {
          loop--;
          time = questionOrder[level][0][0];
          timeDisplay.innerHTML = time;
          answered.innerHTML = 10 - loop;
          createQuestion(level, loop);
     } else if (loop === 1) {
          answered.innerHTML = 10;
          stopGame();
     }
     input.value = '';
}
//Countdown function
function countDown() {
     // countdown timer
     if (time > 0 && loop === 11) {
          time--;
     } else if (time > 0 && loop > 0) {
          time--;
          answered.innerHTML = 10 - loop;
     } else if (time === 0 && loop === 11) {
          main.style.display = 'flex';
          timeDisplay.style.color = 'white';
          input.disabled = false;
          initQuestion(true);
          input.focus();
     } else if (time === 0) {
          initQuestion(false);
     }

     timeDisplay.innerHTML = time;
}


//Creating scoreboard table 
function createTable() {
     //Appending thead and tbody
     scoreContainer.append(scoreTable);
     scoreTable.append(scoreHead);
     scoreTable.append(scoreBody);

     scoreTable.classList.add("table");
     scoreTable.classList.add("table-borderless");

     createTableHeader();
     createTableBody();

     let scoreRow = document.createElement("tr");
     let score = document.createElement("th");
     score.append("Your score: ");
     score.append(player.score);
     score.style.fontWeight = 900;
     score.style.fontSize = "3rem";
     scoreBody.append(scoreRow);
     scoreRow.append(score);
     scoreRow.classList.add("table-light");
}

function createTableHeader() {
     let headerRow = document.createElement("tr");
     for (let i of scoreHeadList) {
          let newth = document.createElement("th");
          newth.append(i);
          headerRow.append(newth);
     }

     //Append afterward
     scoreHead.append(headerRow);
     headerRow.classList.add("table-light");
}

function createTableBody() {
     for (let i = 0; i < 10; i++) {
          let bodyRow = document.createElement("tr");

          //Add cell
          for (let j = 0; j < scoreHeadList.length; j++) {
               if (j === 0) {
                    let newth = document.createElement("th");
                    newth.append(i + 1);
                    bodyRow.append(newth);
               } else {
                    let newtd = document.createElement("td");
                    newtd.append(newCell(i, j));
                    bodyRow.append(newtd);
               }
          }
          addCellStyle(bodyRow, i);
          //Append it afterward
          scoreBody.append(bodyRow);
     }
}

function newCell(i, j) {
     switch (scoreHeadList[j]) {
          case "Problem":
               return player.problems[i].p1 + player.problems[i].operator + player.problems[i].p2;
               break;
          case "Your Answer":
               return player.problems[i].answer;
               break;
          case "Result":
               return player.problems[i].result;
               break;
     }
}

function addCellStyle(el, i) {
     if (player.problems[i].isCorrect) {
          el.classList.add("success");
     } else {
          el.classList.add("fail");
     }
}