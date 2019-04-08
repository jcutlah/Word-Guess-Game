
    var randomNum;
    var computer = {
        wordChoice:"",
        choiceMeta:{
            name:"",
            img:"",
            youtube:"",
            artist:"",
            desc:""
        },
        chosenWords: [],
        words: [
            {
                name: "Go Robot",
                artist: "Red Hot Chili Peppers",
                img: "",
                youtube: "https://www.youtube.com/embed/HI-8CVixZ5o?autoplay=1&start=20"            
            },
            {
                name: "Easy Lover",
                artist: "Philip Bailey and Phil Collins",
                img: "",
                youtube: "https://www.youtube.com/embed/JkRKT6T0QLg?autoplay=1&start=20"            
            },
            {
                name: "In A Big Country",
                artist: "Big Country",
                img: "",
                youtube: "https://www.youtube.com/embed/vBfFDTPPlaM?autoplay=1&start=20"            
            },
            {
                name: "Africa",
                artist: "Toto",
                img: "",
                youtube: "https://www.youtube.com/embed/FTQbiNvZqaY?autoplay=1",
                desc: ""            
            },
            {
                name: "Kickstart My Heart",
                artist: "Mötley Crüe",
                img: "",
                youtube: "https://www.youtube.com/embed/CmXWkMlKFkI?autoplay=1&start=20"            
            },
            {
                name: "Spirit Of Radio",
                artist: "Rush",
                img: "",
                youtube: "https://www.youtube.com/embed/F179XHVn8S8?autoplay=1",
                desc: "Picture me belting this out on full falsetto at a karaoke bar in Utah."            
            },
            {
                name: "Blackened",
                artist: "Metallica",
                img: "",
                youtube: "https://www.youtube.com/embed/DhFmdamo1vg?autoplay=1"
            },
            {
                name: "Just A Girl",
                artist: "No Doubt",
                youtube: "https://www.youtube.com/embed/PHzOOQfhPFg?autoplay=1"
            },
            {
                name: "Hub Life",
                artist: "James Cutler",
                youtube: "https://www.youtube.com/embed/IQV3j3w6Fpg?autoplay=1&start=4",
                desc: "This was something I scraped together for my HubSpot new hire project."
            },
            {
                name: "Live Wire",
                artist: "Mötley Crüe",
                youtube: "https://www.youtube.com/embed/Ahq4blDfU5s?autoplay=1"
            },
            {
                name: "Feel Good Inc",
                artist: "Gorillaz",
                youtube: "https://www.youtube.com/embed/HyHNuVaZJ-k?autoplay=1&start=7"
            },
            {
                name: "Take On Me",
                artist: "Aha",
                youtube: "https://www.youtube.com/embed/djV11Xbc914?autoplay=1"
            },
            {
                name: "Der Kommissar",
                artist: "After the Fire",
                youtube: "https://www.youtube.com/embed/vBfFDTPPlaM?autoplay=1"
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
            this.wordChoice = this.words[randomNum].name.toLowerCase();
            console.log("word choice: " + this.wordChoice);
            computer.choiceMeta.name = this.words[randomNum].name;
            computer.choiceMeta.img = this.words[randomNum].img;
            computer.choiceMeta.youtube = this.words[randomNum].youtube;
            computer.choiceMeta.artist = this.words[randomNum].artist;
            computer.choiceMeta.desc = this.words[randomNum].desc;
            
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
        document.querySelector('#video-lightbox iframe').setAttribute('src',url.youtube);
        document.querySelector('#video-header span').innerHTML = "'" + url.name + "'" + " by " + url.artist;
        document.getElementById('video-lightbox').setAttribute('style',"display:block");
    }
    function hideVideo(){
        document.querySelector('#video-lightbox iframe').setAttribute('src','');
        document.querySelector('#video-lightbox').setAttribute('style','display:none');
    }
    function victory(){
        showVideo(computer.choiceMeta);
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
      
 
    