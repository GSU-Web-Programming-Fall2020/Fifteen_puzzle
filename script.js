//div elements
var ids = [
    "one", "two", "three", "four",
    "five", "six", "seven", "eight",
    "nine", "ten", "eleven", "twelve",
    "thirteen", "fourteen", "fifteen", ""
];
// ids into the shuffle array
var shuffle = ids.slice();

var ids_numeric = {
    "one": 1,
    "two": 2,
    "three": 3,
    "four": 4,
    "five": 5,
    "six": 6,
    "seven": 7,
    "eight": 8,
    "nine": 9,
    "ten": 10,
    "eleven": 11,
    "twelve": 12,
    "thirteen": 13,
    "fourteen": 14,
    "fifteen": 15,
    "sixteen": 16
};

var select_background;
var gamePiece;

// This maps the available movement
// On arr[0] or block "one" if the empty block was there, it can't move up or left, but it can move down or right.

// up right  down  left    [0 = no, 1 = yes]
//[ 0,   1,    1,    0  ]
var movement = [
    [0, 1, 1, 0], //arr 0: one
    [0, 1, 1, 1], //arr 1: two
    [0, 1, 1, 1], //arr 2: three
    [0, 0, 1, 1], //arr 3: four
    [1, 1, 1, 0], //arr 4: five
    [1, 1, 1, 1], //arr 5: six
    [1, 1, 1, 1], //arr 6: seven
    [1, 0, 1, 1], //arr 7: eight
    [1, 1, 1, 0], //arr 8: nine
    [1, 1, 1, 1], //arr 9: ten
    [1, 1, 1, 1], //arr 10: eleven
    [1, 0, 1, 1], //arr 11: twelve
    [1, 1, 0, 0], //arr 12: thirteen
    [1, 1, 0, 1], //arr 13: fourteen
    [1, 1, 0, 1], //arr 14: fifteen
    [1, 0, 0, 1] //arr 15: sixteen
];

var background = ["kirby", "doctor-kirby", "kirby-peach", "sonic-kirby"];

/**
 * When the game starts, it will display a random background
 * One of the four options from the background array
 */
function startGame() {
    var background_id = Math.floor((Math.random() * 4));
    select_background = background[background_id];

    document.getElementById(background[background_id]).select = true; // Grab the selected option and mark it as selected

    for (var i = 0; i < ids.length - 1; i++) {
        document.getElementById(ids[i]).className = "tile " + background[background_id];
    }
}

//The background image of the main div and each of the block divs is replaced
function changeBackground() {
    var class_name = document.getElementById("characters").value;

    if (background.indexOf(class_name) < 0) {
        return;
    }

    select_background = class_name;

    document.getElementById("main").innerHTML = "";

    for (var i = 0; i < ids.length; i++) {
        if (ids[i] == "") {
            document.getElementById("main").innerHTML += '<div id="sixteen" class="tile"></div>';
        } else {
            var id_name = ids[i];
            document.getElementById("main").innerHTML += '<div id="' + ids[i] + '" class="tile' + " " + select_background + '">' + ids_numeric[id_name] + '</div>';
        }
    }
}

function shuffleBoard() {
    startMusic();
    setInterval(setTime, 1000);
    shuffle = ids.slice(); // Reinitialize the shuffled array
    var sixteen = 15;

    // Set a loop to go through 500 times
    for (var i = 0; i < 500; i++) {

        var movement_id = Math.floor((Math.random() * 4));
        while (movement[sixteen][movement_id] != 1) {
            movement_id = Math.floor((Math.random() * 4));
        }
        // The index id where the blank space will go to
        var move_to;
        switch (movement_id) {
            case 0:
                move_to = sixteen - 4;
                break;
                // subtract 4 to go up
            case 1:
                move_to = sixteen + 1;
                break;
                // add 1 to go right
            case 2:
                move_to = sixteen + 4;
                break;
                // subtract 4 to go down
            case 3:
                move_to = sixteen - 1;
                break;
                // subtract 1 to go left
        }

        // swap sixteen and move_to
        var temp = shuffle[sixteen];
        shuffle[sixteen] = shuffle[move_to];
        shuffle[move_to] = temp;

        sixteen = move_to;
    }

    displayBoard();

}

/**
 * Clears the inner html of the file and cycles through the shuffled array 
 * display the div in the correct order.
 */
function displayBoard() {
    document.getElementById("main").innerHTML = "";

    for (var i = 0; i < shuffle.length; i++) {
        if (shuffle[i] == "") {
            document.getElementById("main").innerHTML += '<div id="sixteen" class="tile"></div>';
        } else {
            var id_name = shuffle[i];
            document.getElementById("main").innerHTML += '<div id="' + shuffle[i] + '" class="tile' + " " + select_background + '">' + ids_numeric[id_name] + '</div>';
        }
    }

    var click_id;

    if (movement[shuffle.indexOf("")][0] == 1) {
        click_id = shuffle.indexOf("") - 4;
        document.getElementById(shuffle[click_id]).className += " click";
        document.getElementById(shuffle[click_id]).setAttribute("onclick", "swapPieces(" + click_id + ", " + shuffle.indexOf("") + ")");
    }

    if (movement[shuffle.indexOf("")][1] == 1) {
        click_id = shuffle.indexOf("") + 1;
        document.getElementById(shuffle[click_id]).className += " click";
        document.getElementById(shuffle[click_id]).setAttribute("onclick", "swapPieces(" + click_id + ", " + shuffle.indexOf("") + ")");
    }

    if (movement[shuffle.indexOf("")][2] == 1) {
        click_id = shuffle.indexOf("") + 4;
        document.getElementById(shuffle[click_id]).className += " click";
        document.getElementById(shuffle[click_id]).setAttribute("onclick", "swapPieces(" + click_id + ", " + shuffle.indexOf("") + ")");
    }

    if (movement[shuffle.indexOf("")][3] == 1) {
        click_id = shuffle.indexOf("") - 1;
        document.getElementById(shuffle[click_id]).className += " click";
        document.getElementById(shuffle[click_id]).setAttribute("onclick", "swapPieces(" + click_id + ", " + shuffle.indexOf("") + ")");
    }
}

/**
 * Swaps the pieces and increments the total number of moves the player has done
 *
 * @param click_id
 * @param empty_id
 */
function swapPieces(click_id, empty_id) {
    animateMove(click_id, empty_id);
    incrementMoves();
    setTimeout(function() {
        var temp = shuffle[empty_id];
        shuffle[empty_id] = shuffle[click_id];
        shuffle[click_id] = temp;
        displayBoard();
        checkIfSolved();

    }, 600);

}

/**
 * Animates the movement of the blocks
 * @param click_id
 * @param empty_id
 */
function animateMove(click_id, empty_id) {
    if (click_id - 4 == empty_id) {
        console.log(shuffle[click_id]);
        document.getElementById(shuffle[click_id]).className += " move-up";
    } else if (click_id + 1 == empty_id) {
        document.getElementById(shuffle[click_id]).className += " move-right";
    } else if (click_id + 4 == empty_id) {
        document.getElementById(shuffle[click_id]).className += " move-down";
    } else if (click_id - 1 == empty_id) {
        document.getElementById(shuffle[click_id]).className += " move-left";
    }
}

/**
 * Do the audio
 */
function startMusic() {
    var audio = new Audio('bensound-adventure.mp3');
    audio.volume(.3);
    audio.play();
}
var minutesLabel = document.getElementById("minutes");
var secondsLabel = document.getElementById("seconds");
var totalSeconds = 0;
var movesLabel = document.getElementById("moves");
var movesCount = 1;

function setTime() {
    ++totalSeconds;
    secondsLabel.innerHTML = pad(totalSeconds % 60);
    minutesLabel.innerHTML = pad(parseInt(totalSeconds / 60));
}

function pad(val) {
    var valString = val + "";
    if (valString.length < 2) {
        return "0" + valString;
    } else {
        return valString;
    }
}

function incrementMoves() {
    movesLabel.innerHTML = movesCount++;
}
/** Function to check if the board has been solved */
function checkIfSolved() {

    var n = 1;
    /* gameBoard gets the ID "Main" from the fifteen.html */
    var gameBoard = document.getElementById('main');
    /* gamePiece is the assigned to the div tags inside of div*/
    gamePiece = gameBoard.getElementsByTagName('div');

    /* we set a For loop to go through the board one by one*/
    for (var i = 0; i < gamePiece.length; i++) {
        /* if the current gamePiece is equal to n then proceed 
         *to check next piece
         */
        if (n == parseInt(gamePiece[i].innerHTML)) {
            n++;
        }
        /**
         * only way to reach i = 15 is if the previous pieces are in the
         * correct order.
         */
        else if (i == 15) {
            document.getElementById("wining").src = "Kirby_won.png";
        } else {
            return;
        }

    }


}