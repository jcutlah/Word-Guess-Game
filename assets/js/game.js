
    var randomNum;
    var computer = {
        wordChoice:"",
        choiceMeta:{
            name:"",
            img:"",
            youtube:""
        },
        chosenWords: [],
        words: [
            {
                name: "africa",
                img: "",
                youtube: "https://www.youtube.com/embed/FTQbiNvZqaY?autoplay=1",
                desc: "Couldn't find a YouTube"            
            },
            {
                name: "kickstart my heart",
                img: "",
                youtube: "https://www.youtube.com/embed/NrOemQaEJGU?autoplay=1"            
            },
            {
                name: "spirit of radio",
                img: "",
                youtube: "https://www.youtube.com/embed/5Tq-UsaRchI?autoplay=1"            
            },
            {
                name: "fade to black",
                img: "",
                youtube: "https://www.youtube.com/embed/WEQnzs8wl6E?autoplay=1"
            },
            {
                name: "just a girl",
                youtube: "https://www.youtube.com/embed/PHzOOQfhPFg?autoplay=1"
            },
            {
                name: "hub life",
                youtube: "https://www.youtube.com/embed/IQV3j3w6Fpg?autoplay=1&start=3"
            }
        ],
        randomNumGenerator: function(){
            return Math.floor(Math.random() * Math.floor(this.words.length));
        },
        isDupe: function(word){
            console.log('running isDupe() for ' + word);
            console.log(this.chosenWords);
            console.log(this.chosenWords.indexOf(word));
            if (this.chosenWords.indexOf(word) == -1){
                this.chosenWords.push(word);
                console.log(this.chosenWords);
                return false;
            } else {
                console.log('dupe found');
                return true;
            }
        },
        chooseWord: function(){
            randomNum = this.randomNumGenerator();
            while (this.isDupe(this.words[randomNum].name) && this.chosenWords.length < this.words.length){
                randomNum = this.randomNumGenerator();
            }
            if (this.chosenWords.length == this.words.length){
                document.getElementById('game-status').innerText = "You broke the game you're so good!!!";
                document.getElementById('new-game-prompt').innerHTML = "It appears the computer has no new words for you to guess at."
            }
            this.wordChoice = this.words[randomNum].name;
            console.log("word choice: " + this.wordChoice);
            computer.choiceMeta.name = this.wordChoice;
            computer.choiceMeta.img = this.words[randomNum].img;
            computer.choiceMeta.youtube = this.words[randomNum].youtube;
            
            return this.wordChoice;
        }
    };
    var player = {
        numGuesses: 9,
        lettersGuessed: [],
        numWins: 0,
        numLosses: 0,
        numRepeatGuesses: 0,
        active: false,
        guess: {
            letter: "",
            indices: [],
            guessedAlready: false
        }
    };
    
    
    function isPartOfArray(letter, array){
        var indices = [];
        var idx = array.indexOf(letter.toLowerCase());
        while (idx != -1) {
            indices.push(idx);
            idx = array.indexOf(letter.toLowerCase(), idx + 1);
        }
        return indices;
    }
    function loadWordContainer(word){
        for (i=0;i<word.length;i++) {
            var letter = document.createElement('span');
            var letterContainer = document.createElement('div');
            letterContainer.setAttribute('class', 'letter-wrapper unsolved');
            if (word[i] == " "){
                letterContainer.classList.remove('unsolved');
                letterContainer.classList.add('space');
            }
            letterContainer.appendChild(letter);
            document.getElementById('word-wrapper').appendChild(letterContainer);
        }
    }
    function clearContainers(){
        document.getElementById('word-wrapper').innerHTML = "";
        document.getElementById('letters').innerHTML = "";
    }
    function writeLetters(){
        var letters = document.querySelectorAll('.letter-wrapper span');
            for(i=0;i<player.guess.indices.length;i++){
                letters[player.guess.indices[i]].innerHTML = player.guess.letter;
                letters[player.guess.indices[i]].parentElement.classList.remove('unsolved');
            }
    }
    function checkAnswer(){
        var answer = "";
        var letterWrappers = document.querySelectorAll('.letter-wrapper span');
        var guess = "";
        for (i=0;i<letterWrappers.length;i++){
            if(letterWrappers[i].parentElement.classList.contains('space')){
                guess = guess + " ";
            } else {
                guess = guess + letterWrappers[i].innerHTML;
            }
            
        }
        if (guess.toLowerCase() == computer.wordChoice){
            return true;
        } else {
            return false;
        }
    }
    function adjustGuesses(guess, correct){
        if(player.lettersGuessed.indexOf(guess) == -1){
            player.lettersGuessed.push(guess);
            if (!correct){
                player.numGuesses--;
            }
            document.querySelector('#guesses-remaining span').innerHTML = player.numGuesses;
            document.getElementById('letters').innerHTML = document.getElementById('letters').innerHTML + " " + guess;
        } else {
            player.numRepeatGuesses++;
            if (player.numRepeatGuesses > 2) {
                alert('Hey bahd! Looks lahk you keep guessing the same lettahs...');
                player.numRepeatGuesses = 0;
            }
        }
        
    }
    function newGame(){
        clearContainers();
        player.numGuesses = 9;
        player.lettersGuessed = [];
        player.numRepeatGuesses = 0;
        player.active = true;
        loadWordContainer(computer.chooseWord());
        document.querySelector('#guesses-remaining span').innerHTML = player.numGuesses;
        document.getElementById('game-info').parentElement.className = document.getElementById('game-info').parentElement.className + " live";
        document.querySelector('#wins span').innerHTML = player.numWins;
        document.querySelector('#losses span').innerHTML = player.numLosses;
    }
    function bitterLoss(){
        player.numLosses++;
        document.getElementById('game-status').innerHTML = "Loser!!!";
        document.getElementById('game-info').parentElement.classList.remove('live');
        document.querySelector('#losses span').innerHTML = player.numLosses;
        player.active = false;
    }
    function showVideo(url){
        document.querySelector('#video-lightbox iframe').setAttribute('src',url);
        document.getElementById('video-lightbox').setAttribute('style',"display:block");
    }
    function hideVideo(){
        document.querySelector('#video-lightbox iframe').setAttribute('src','');
        document.querySelector('#video-lightbox').setAttribute('style','display:none');
    }
    function victory(){
        showVideo(computer.choiceMeta.youtube);
        document.getElementById('game-status').innerHTML = "Victory!!!";
        document.getElementById('game-info').parentElement.classList.remove('live');
        player.numWins ++;
        document.querySelector('#wins span').innerHTML = player.numWins;
        player.active = false;
    }
    function keyInput(e){
        var reLetter = /^[A-Z,a-z]{1}$/;
        player.guess.letter = e.code.replace('Key','');
        if (reLetter.test(player.guess.letter) && player.active == true){
            //Things that happen once a user types a valid key entry (any letter a-z):
            // Check if they've already guessed it/add it it to list of already guessed letters, print to screen
            
            // See if their letter is in the computer's choice, return the index position(s) of the letter
            player.guess.indices = isPartOfArray(player.guess.letter, computer.wordChoice);
            if (player.guess.indices.length != 0){
                // Use index values to set the innerHTML of the correct element(s) on the page/adjust CSS for proper display
                writeLetters();
                adjustGuesses(player.guess.letter, true);
            } else {
                // Increment down the player's number of guesses, return number of guesses left, print to screen
                adjustGuesses(player.guess.letter, false);
            }
            // Read the letters on the page, determine if the resulting word matches the computer's choice
            if (checkAnswer()){
                victory();
            } else if (player.numGuesses == 0){
                bitterLoss();
            }
            
        } 
    }
window.addEventListener('DOMContentLoaded', function(){
    document.querySelector('#game-info button').addEventListener("click",function(){
        document.onkeyup = keyInput;
        newGame();
    });
    document.querySelector('#lightbox-close a').addEventListener('click',function(){
        hideVideo();
    });
});
      
 
    