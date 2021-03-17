
























































var inputText = document.querySelector('#startlang');
var inputLanguage = document.querySelector('#first-language');
var outputText = document.querySelector('#secondlang');
var outputLanguage = document.querySelector('#second-language');
var redirect = document.location.href;
var clientID = '794573419509-4cuda41iqqvm9lj8dsree30qlohj6m38.apps.googleusercontent.com';
var substring = location.hash.substring(1);

// Parse query string to see if page request is coming from OAuth2.0 Server
var params = {};
var regex = /([^&=]+)=([^&=]*)/g, m;

while (m = regex.exec(substring)) {
    params[decodeURIComponent(m[1])] = decodeURIComponent(m[2]);
}
if (Object.keys(params).length > 0) {
    localStorage.setItem('oauth2-test-params', JSON.stringify(params) );
    translateLanguageRequest()
}

// attempt to call api if keys are found
var translateLanguageRequest = function() {
    
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
        'scope': ['https://www.googleapis.com/auth/cloud-platform','https://www.googleapis.com/auth/cloud-translation'],
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

var translateEventHandler = function(event) {
    event.preventDefault();
    translateLanguageRequest();
}

translateButton.addEventListener("click", translateEventHandler);



