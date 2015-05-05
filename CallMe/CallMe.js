var CALLME_TIRED_ASSET = "violin.mp3";
var CRICKET_AWKWARD_ASSET = "crickets.mp3";

if (Meteor.isClient) {

  var tiredCounter = 0;
  var lastSpeechTimeStamp;
  var audio;
  var recognition;

  $(document).ready(function () {
    //alert("jquery ready");
    audio = new Audio();
    lastSpeechTimeStamp = new Date();

    setInterval(timedFunction, 5000);

    function timedFunction () {
        console.log("timed function called");

        //checkAwkwardState();

    }

    function checkAwkwardState () {
      if (new Date() - lastSpeechTimeStamp > 5000) {
        handleAwkwardState();
      }
    }

    function handleIncomingTranscript (event) {
      lastSpeechTimeStamp = new Date();
      var results = event.results;
      if (event.results[results.length - 1].isFinal) {

        var transcript = results[results.length - 1][0].transcript;

        var confidence = results[results.length - 1][0].confidence;

        var transcriptArray = transcript.split(" ");

        for (var i = 0; i < transcriptArray.length; i++) {

          var tempWord = transcriptArray[i];
          processWord(tempWord);
        }

        analyzeConversationState();

        console.log(transcript + "Confidence = " + confidence);
      }


    }

    function handleSpeechStart () {
      console.log("Speech Started");
      lastSpeechTimeStamp = new Date();
    }

    function handleSpeechEnd () {
      console.log("Speech ended");
    }

    function processWord (word) {
        console.log("Processing Word :" + word);
        switch(word) {
          case 'tired' :
              tiredCounter++;
              break;
        }
    }

    function analyzeConversationState () {
        console.log("Analyzing Conversation");
        if (tiredCounter > 2) {
           handleTiredState();
        }
    }

    function handleTiredState () {
        console.log("Handling Tired State");
        changeMoodSong(CALLME_TIRED_ASSET);
    }

    function handleAwkwardState () {
      console.log("Handling awkward state");
      changeMoodSong(CRICKET_AWKWARD_ASSET);
    }

    function changeMoodSong (song) {
        if (!audio.paused) {
          audio.pause();
        }

        audio.src = song;
        audio.play();
    }
    $("#debugButton").click(function () {
      lastSpeechTimeStamp = new Date();

      console.log("Iv'e pressed the debug button");

      recognition = new webkitSpeechRecognition();
      recognition.onspeechstart = handleSpeechStart;
      recognition.onspeechend = handleSpeechEnd();

      recognition.lang = "en";
      recognition.continuous = true;
      recognition.interimResults = true;

      recognition.onresult = handleIncomingTranscript;

      recognition.onerror = function(event) {
        console.log(event.error);
      };

      recognition.start();
    });

    $("#handleTiredState").click(function () {
        console.log("Handling Tired State Button clicked");

        handleTiredState();
    });

    $("#stopSong").click(function () {
        if (!audio.paused) {
          audio.pause();
        }
    });
  });
  // counter starts at 0
  Session.setDefault('counter', 0);

  Template.hello.helpers({
    counter: function () {
      return Session.get('counter');
    }
  });

  Template.hello.events({
    'click button': function () {
      // increment the counter when button is clicked
      Session.set('counter', Session.get('counter') + 1);
    }
  });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}


