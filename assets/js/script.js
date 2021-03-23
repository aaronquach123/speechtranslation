const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
var recognition = new SpeechRecognition();
var text = "";
var mem = [];

var inputText = document.querySelector('#startlang');
var inputLanguage = document.querySelector('#first-language');
var outputText = document.querySelector('#secondlang');
var outputLanguage = document.querySelector('#second-language');
var savedLangauages = document.querySelector('#saved-content')
var redirect = 'https://aaronquach123.github.io/speechtranslation/';
var clientID = '794573419509-4cuda41iqqvm9lj8dsree30qlohj6m38.apps.googleusercontent.com';
var substring = location.hash.substring(1);

var elem = new Foundation.Reveal($("#errorDisplay"));

window.onload = () => {
    if( localStorage.getItem('dataJSON') === null ) {
        savedLangauages.innerHTML = 'no past translations made'
    } else {
        let dataJSON = localStorage.getItem('dataJSON');
        parsedJSON = JSON.parse(dataJSON);
        mem = parsedJSON
        listJSON()
    }
}


$("#speech-btn").on("click", function() {
    recognition.onresult = function(event) {
        if (event.results.length > 0) {
        text = event.results[0][0].transcript;
        $("#startlang").val(text);
        speechTranslate();
        } else {
            $("#errorDisplayMsg").text("We didn't quite get that. Please press record and speak into the microphone again.")
            $("#errorDisplay").foundation("open");
        }
    };
    recognition.start();
});

var speechTranslate = function() {
    var firstLanguage = $("#first-language option:selected").val();
    var secondLanguage = $("#second-language option:selected").val();
    if (firstLanguage == secondLanguage) {
        $("#errorDisplayMsg").text("Please choose two different languages to translate from")
        $("#errorDisplay").foundation("open");
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
    
    $.ajax(settings)
        .done(function (data) {
            $("#secondlang").val(response.data.translations[0].translatedText);
            buildJSON()
            aveJSON()
            console.log(mem)
        })
        .fail(function (error) {
            $("#errorDisplayMsg").text("Error:"+ error.statusText)
            $("#errorDisplay").foundation("open");
        });
};

$("#translateButton").on("click", function(event) {
    event.preventDefault();
    speechTranslate();
});

const saveJSON = () => {
    let dataJSON = JSON.stringify(mem)
    localStorage.setItem('dataJSON', dataJSON)
}

const buildJSON = () => {
    var langValue = $("#second-language option:selected").value;

    let date = new Date()
    let obj = {
        "date" : date.toLocaleDateString(),
        "input" : inputText.value,
        "starLang" : inputLanguage.value,
        "endLang" : outputLanguage.value,
        "output" : outputText.value
    }
    mem.push(obj)
}

const listJSON = () => {

    let mapJSON = (data) => {
        // displays html elements
        savedLangauages.innerHTML += data.date + '<br>'
        savedLangauages.innerHTML += data.starLang + '<br>'
        savedLangauages.innerHTML += data.input + '<br>'
        savedLangauages.innerHTML += data.endLang + '<br>'
        savedLangauages.innerHTML += data.output + '<br>'
        savedLangauages.innerHTML += '<br>'
    }
    
    mem.forEach((value, index, array) => {
       const sortDate = array.sort((a, b) => {
           return new Date(b.date) - new Date(a.date)
       })
        mapJSON(sortDate[index])
    });

}