const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
var recognition = new SpeechRecognition();
  recognition.onresult = function(event) {
    if (event.results.length > 0) {
      var text = event.results[0][0].transcript;
      console.log(query.value)
      //query.form.submit();
    }
  }

