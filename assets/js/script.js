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

$("#submit").on("click", function(event) {
    event.preventDefault();
    speechTranslate();
});
var translationEvent = function() {
    // Parse query string to see if page request is coming from OAuth2.0 Server
var params = {};
var regex = /([^&=]+)=([^&=]*)/g, m;

while (m = regex.exec(substring)) {
    params[decodeURIComponent(m[1])] = decodeURIComponent(m[2]);
}


// attempt to call api if keys are found
function translateLanguageRequest() {
    
    var params = JSON.parse(localStorage.getItem('oauth2-test-params'));
    if (params && params['access_token']) {
        var request = fetch('https://translation.googleapis.com/language/translate/v2', {
            'method': 'POST',
            'headers': {
                'content-type': 'application/json',
                'Authorization': `${params['access_token']}`
            },
            'body': {
                'q': `${inputText}`,
                'source': `${inputLanguage}`,
                'target': `${outputLanguage}`
            }
        }).then(function(response) {
            if (response.ok) {
                response.json().then(function(data) {
                    console.log(data);
                    outputText = data.data.translations[0].translatedText;
                }
                )} else {
                console.error(response.statusText);
                signIn();
            }
        })
    } else {
        signIn();
    }
}

var signIn = function() {
// find google's OAuth2 endpoint
    var oauth2Endpoint = 'https://accounts.google.com/o/oauth2/v2/auth';

    // create form element to send paramaters to OAuth2's endpoint
    var form = document.createElement("form");
    form.setAttribute('method', 'GET'); // Send as a get request;
    form.setAttribute('action', oauth2Endpoint);

    // Paramaters to pass to Oauth2's endpoint
    var params = {
        'client_id': `${clientID}`,
        'redirect_uri': `${redirect}`,
        'response_type': 'token',
        'scope': 'https://www.googleapis.com/auth/cloud-translation',
        'include_granted_scopes': 'true',
        'state': 'pass-through value'
    }

    // add form paramaters as hidden input values
    for (var p in params) {
        var input = document.createElement('input');
        input.setAttribute('type', 'hidden');
        input.setAttribute('name', p);
        input.setAttribute('value', params[p]);
        form.appendChild(input);
    }

    // Add form to page and submit it to OAuth 2.0 endpoint
    document.body.appendChild(form);
    form.submit();
}
}

var translateEventHandler = function(event) {
    event.preventDefault();
    translationEvent();
    
}

translateButton.addEventListener("click", translateEventHandler);

console.log('test')

