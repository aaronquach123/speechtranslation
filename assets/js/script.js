const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
var recognition = new SpeechRecognition();
var text = "";

$("#speech-btn").on("click", function() {
    recognition.onresult = function(event) {
        $("#speech-btn")
        .text("Press to record")
        .addClass("");
        if (event.results.length > 0) {
        text = event.results[0][0].transcript;
        $("#startlang").val(text);
        }
    };
    $("#speech-btn")
    .text("Now recording...")
    .addClass("");
    recognition.start();
});

var speechLangaugesGet = function() {
    var settings = {
        "async": true,
        "crossDomain": true,
        "url": "https://google-translate1.p.rapidapi.com/language/translate/v2/languages?target=en",
        "method": "GET",
        "headers": {
            "x-rapidapi-key": "5b577398ebmsh05c14699df757d0p137b70jsn38436407b2e2",
            "x-rapidapi-host": "google-translate1.p.rapidapi.com"
        }
    };
    
    $.ajax(settings).done(function (response) {
        for (var i = 0; i < response.data.languages.length; i++) {
            var optionText = response.data.languages[i].name;
            var optionValue = response.data.languages[i].language;
            $("#second-language").append(`<option value="${optionValue}"> ${optionText} </option>`);
        }
    });
};


var speechTranslate = function() {
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
            "q": $("#startlang"),
            "source": "en",
            "target": "es"
        }
    };
    
    $.ajax(settings).done(function (response) {
        console.log(response);
    });
}

speechLangaugesGet();