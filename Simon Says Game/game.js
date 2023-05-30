var buttonColours = ["red", "blue", "green", "yellow"];

var gamePattern = [];
var userClickedPattern = [];

var gameState = false;
var level = 0;

function playSound(name) {
    var buttonSound = new Audio("./sounds/" + name + ".mp3");
    buttonSound.play();
}

function animatePress(buttonColor) {
    var button = $("#" + buttonColor);
    button.addClass("pressed");
    setTimeout(()=> {
        button.removeClass("pressed");
    }, 
    100);
}

function checkAnswer(level) {

    if (gamePattern[level] === userClickedPattern[level]) {

      console.log("success");

      if (userClickedPattern.length === gamePattern.length) {

        setTimeout(function () {
          nextSequence();
        }, 1000);
        userClickedPattern = [];

      }

    } else {

    console.log("wrong");
    var audio = new Audio("./sounds/wrong.mp3");
    audio.play();
    $("body").addClass("game-over");
    setTimeout(function () {
      $("body").removeClass("game-over");
    }, 
    200);
    $("h1").text("Game Over, Press Any Key to Restart");
    resetGame();
    }
}

function nextSequence() {
    level++;
    $("h1").text("Level " + level);
    var rand = Math.floor(Math.random() * 4);
    var randomChosenColor = buttonColours[rand];
    gamePattern.push(randomChosenColor);
    $("#" + randomChosenColor).fadeOut(100).fadeIn(100).fadeOut(100).fadeIn(100);
    playSound(randomChosenColor);
    console.log(gamePattern);
}

$(".btn").click(function() {
    var userChosenColor = $(this).attr("id");
    userClickedPattern.push(userChosenColor);
    playSound(userChosenColor);
    animatePress(userChosenColor);
    checkAnswer(userClickedPattern.length - 1);
})

$(document).keypress(function() {
    if (gameState === false) {
        nextSequence();
        $("h1").text("Level " + level);
        gameState = true;
    }
})

function resetGame() {
    gameState = false;
    gamePattern = [];
    userClickedPattern = [];
    level = 0;
}