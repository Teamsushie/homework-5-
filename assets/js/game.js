var animationSetup = false;

 function animationPlease() {
   
   /* Variables */
   var self = this,
   buttonOne = document.getElementById('buttonOne'),
   buttonTwo = document.getElementById('buttonTwo'),
   buttonThree = document.getElementById('buttonThree'),
   buttonFour = document.getElementById('buttonFour'),
   buttonArray = [buttonOne, buttonTwo, buttonThree, buttonFour],
   w = window.innerWidth,
   h = window.innerHeight,
   stage = document.getElementById('stage'),
   startButton = document.getElementById('startButton'),
   title = document.getElementById('title'),
   questionTitle = document.getElementsByClassName("questions"),
   score = document.getElementsByClassName("score"),
   scoreSpan = score[0].getElementsByTagName('span'),
   timer = document.getElementsByClassName("timer"),
   timerSpan = timer[0].getElementsByTagName('span'),
   gameChoices = document.getElementById('gameChoices'),
   gameHeader = document.getElementById('gameHeader'),
  
  
   modal_window = document.getElementById('modal_window')
   startAnimation = new TimelineMax({repeat:0}),
   gameIndex = 0,
   actualScore = 0,
   timerIndex = 8,
   runningGameAgain = false,
   timerObject = undefined,
   gameQuestions = [],
   questions = [
    'When was the first commercial arcade video game released?',
    'What was the name of the first successful commercial video game?',
    'What was the name of the first home video game console to be released?',
    'When was the Nintendo Entertainment System released?',
    'Who is the "Father of Video Games"?',
    'In what era did we see the trainsition to 3D video games?',
    'What is commonly referred to as the "Golden Age" of Video games?',
    'What does the term "MMO" refer to?',
    'Microsoft designed which console?',
    'Is fortnite lame?'
   ],
   answers = [
    ['1950', '1975', '1971', '1981'],
    ['Pong', 'Space Wars', 'Pacman', 'World of Warcraft'],
    ['Atari', 'Odyssey', 'Super Nintendo', 'Sega Genesis'],
    ['1985', '1975', '1995', '2005'],
    ['Ralph Baer', 'Steve Jobs', 'Luke Skywalker', 'Tom Cruise'],
    ['The 80s', 'The 90s', 'The 60s', 'The 30s'],
    ['1978-1982', '1980-1984', '1992-1996', '1950-1954'],
    ['Mas Mas Ole', 'More Monkeys Online', 'Massively Multiplayer Online', 'Mama Mia Oprah!'],
    ['Playstation', 'Gamecube', 'Wii', 'Xbox'],
    ['Yes', 'No', 'I LOVE FORTNITE!!', 'PUBG is better.']
   ],
   correctAnswers = [2,0,1,1,0,1,0,2,3,3],
   gameAnswers = [];

   /**
    * Setup styles and events
    **/
   self._initilize = function() {

    self.windowWasResized();
    // Add click listener to start button 
    startButton.addEventListener('click', self.startGamePlay);

    // Add answer click listener
    for (var i = 0; i < buttonArray.length; i++) {
      buttonArray[i].addEventListener('click', self.anwerClicked, false);
    }
   };

   /**
    * Called everytime the window resizes to calculate new dimensions
    **/
   self.windowWasResized = function() {
    stage.style.height = (h -20) +'px';
    stage.style.width = (w - 20) + 'px';
   };

   /**
    * Setup the stage and fire off the stage animations
    **/
   self.startGamePlay = function() {

    // Get the game indexes
    self.generateGameIndexes();
 
    // Add data to the interface
    self.setupUserInterfaceWithData();
    // Set the score to zero
    scoreSpan[0].textContent = actualScore;
    timerSpan[0].textContent = timerIndex;

    startAnimation.to([startButton, title], 1, {alpha:0});
    startAnimation.to([startButton, title], 0.1, {css:{display:'none'}});
    startAnimation.to([gameHeader, gameChoices], 0.1, {css:{display:'block'}, onComplete:self.fireOffGameLogic});
   };

   /**
    * Callback function from the startAnimation timeline above
    * This function starts the timer and plays the music at the same time
    **/
   self.fireOffGameLogic = function() {
    self.runTimer();
    gameMusic.currentTime = 0;
    gameMusic.play();
   }

   /**
    * This function rebuilds the UI with a new question and answer
    **/
   self.setupUserInterfaceWithData = function() {
    // Add questions to buttons
    var ques = questions[gameQuestions[gameIndex]];
    var t = questionTitle[0].getElementsByTagName('span');
    t[0].innerHTML = ques;
    // Add answers to buttons
    var ans = answers[gameQuestions[gameIndex]];
    for (var i = 0; i < ans.length; i++) {
      var a = ans[i];
      buttonArray[i].textContent = a;
    }
   };
   /**
    * Called to start a gameplay timer that runs every second
    **/
   self.runTimer = function() {
    timerObject = window.setInterval(self.updateClock, 1000);
   };
   /**
    * Callback function for the gameplay timer
    **/
   self.updateClock = function() {
    timerIndex--;
    if (timerIndex == -1) {
      timerIndex = 8;
      gameIndex++;
    } 
 
    if (gameIndex == gameQuestions.length) {
      clearTimeout(timerObject);
      // end the game
      self.runEndOfGame();
      return;
    } else if(timerIndex == 8){
      self.setupUserInterfaceWithData();
    }
    // Display updated time
    timerSpan[0].textContent = timerIndex;
   };

   /**
    * Determines if an answer is correct or incorrect
    **/
   self.anwerClicked = function(e) {

    clearTimeout(timerObject);
    gameMusic.pause();
    gameMusic.currentTime = 0;
    // Get the answer index
    var answerIndex = Number(e.target.getAttribute('data-index'));
    // Get the actual answer index 
    var actualCorrectAnswerIndex = gameAnswers[gameIndex];

    // Correct answer
    if (actualCorrectAnswerIndex == answerIndex) {
      rightAnswer.play();
      actualScore += 10;
      scoreSpan[0].textContent = actualScore;
      cancelButtons = true;
      self.dispatch_modal('YOUR ANSWER IS: <span class="correct">CORRECT!</span>', 1000);
    // Incorrect Answer
    } else {
      wrongAnser.play();
      cancelButtons = true;
      self.dispatch_modal('YOUR ANSWER IS: <span class="incorrect">INCORRECT!</span>', 1000);
    }
   }

   /**
    * This function generates random indexes to be used for our game logic
    * The indexes are used to assign questions and correct answers
    **/
   self.generateGameIndexes = function() {
    var breakFlag = false;
    while (!breakFlag) {
      var randomNumber = Math.floor(Math.random() * 9);
      if (gameQuestions.indexOf(randomNumber) == -1) {
        gameQuestions.push(randomNumber);
        gameAnswers.push(correctAnswers[randomNumber]);
      }
      if (gameQuestions.length == 5) {
        breakFlag = true;
      }
    }
   };

  /**
   *  Dispatches a modal window with a message to user
   */
   self.dispatch_modal = function(message, time) {
    window_width = window.innerWidth|| document.documentElement.clientWidth
                   || document.body.clientWidth;

    modal_window.getElementsByTagName('p')[0].innerHTML = message;
    modal_window.style.left = ((window_width / 2) - 150)+ 'px';

    self.fade_in(time, modal_window, true);
   };

        // Determine if we need to run another game loop
        if (gameIndex != gameQuestions.length) {
          timerIndex = 8;
          timerSpan[0].textContent = timerIndex
          self.setupUserInterfaceWithData();
          self.runTimer();
          gameMusic.play();
        } else {
          self.runEndOfGame();
        }
      }
    var fading = window.setInterval(func, interval);
   };


   /**
    * Runs when the game ends
    * Displays a modal window with the option to play again
    **/
   self.runEndOfGame = function() {
  
    window_width = window.innerWidth|| document.documentElement.clientWidth
                   || document.body.clientWidth;
    var playAgainButton = '<button id="playAgain" class="left" onClick="self.resetGame()">PLAY AGAIN</button>';
    var actualScoreHeader = '<h2>CONGRATS, YOUR FINAL SCORE IS: '+ actualScore + '</h2>';
    var insertedHTML = actualScoreHeader +'<div>' + tweetButton + playAgainButton + '</div>';
    modal_window.getElementsByTagName('div')[0].innerHTML = insertedHTML;
    modal_window.style.left = ((window_width / 2) - 150)+ 'px';

    self.fade_in(1000, modal_window, false);
   };

   /**
    * This function resets the game and starts it all over again
    * This function acts as to reset all data from scratch
    **/
   self.resetGame = function() {

    modal_window.style.opacity = 0.0;
    modal_window.innerHTML = '<div class="modal_message"><p></p></div>';

    window.clearTimeout(timerObject);
    timerObject = undefined;
    gameIndex = 0;
    gameAnswers = [];
    actualScore = 0;
    timerIndex = 8;
    gameQuestions = [];
    // Get the game indexes
    self.generateGameIndexes();
 
    // Add data to the interface
    self.setupUserInterfaceWithData();
    // Set the score to zero
    scoreSpan[0].textContent = actualScore;
    timerSpan[0].textContent = timerIndex;
    self.runTimer();
    gameMusic.currentTime = 0;
    gameMusic.play();

   };

 

   // Initialize the functionality of the controller
   self._initilize();

 } // End animationPipeline

 // Used to call animation between questions
 var interval = setInterval(function() {
  if(document.readyState === 'complete') {
    clearInterval(interval);
    var pipe = animationPlease();

    window.onresize = function(event) {
      var pipe = animationPlease()
    };
  }
 }, 100);
