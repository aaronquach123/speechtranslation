const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
var recognition = new SpeechRecognition();
var text = "";

var inputText = document.querySelector('#startlang');
var inputLanguage = document.querySelector('#first-language');
var outputText = document.querySelector('#secondlang');
var outputLanguage = document.querySelector('#second-language');
var redirect = 'https://aaronquach123.github.io/speechtranslation/';
var clientID = '794573419509-4cuda41iqqvm9lj8dsree30qlohj6m38.apps.googleusercontent.com';
var substring = location.hash.substring(1);


$("#speech-btn").on("click", function() {
    recognition.onresult = function(event) {
        if (event.results.length > 0) {
        text = event.results[0][0].transcript;
        $("#startlang").val(text);
        };
    };
    recognition.start();
    speechTranslate();
});

var speechTranslate = function() {
    var firstLanguage = $("#first-language option:selected").val();
    var secondLanguage = $("#second-language option:selected").val();
    if (firstLanguage == secondLanguage) {
        console.log("choose different translated language")
        return;
    }
    var settings = {
        "async": true,
        "crossDomain": true,
        "url": "https://google-translate1.p.rapidapi.com/language/translate/v2",
        "method": "POST",
        "headers": {
            "content-type": "application/x-www-form-urlencoded",
            "x-rapidapi-key": "5b577398ebmsh05c14699df757d0p137b70jsn38436407b2e2",
            "x-rapidapi-host": "google-translate1.p.rapidapi.com"
        },
        "data": {
            "q": $("#startlang").val(),
            "source": firstLanguage,
            "target": secondLanguage
        }
    };
    
    $.ajax(settings).done(function (response) {
        console.log(response);
        $("#secondlang").val(response.data.translations[0].translatedText)
    });
};

$("#translateButton").on("click", function(event) {
    event.preventDefault();
    speechTranslate();
});