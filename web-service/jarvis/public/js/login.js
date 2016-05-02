function validateCredentials(email, password) {
    var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function() {
		if (xhr.readyState === XMLHttpRequest.DONE) {
			// Response received
			if (xhr.status === 200) {
				
				var json = JSON.parse(xhr.responseText);

                document.getElementById("loginMessage").innerHTML = 'Valid login!'; 
                document.cookie = 'token=' + json.token; 
			}
            else if (xhr.status === 401) {
                // Failed the authentication
                document.getElementById("loginMessage").innerHTML = 
                    'Invalid credentials. Please try again.';
            }
			else {
				document.getElementById("loginMessage").innerHTML = 
					'Status Code: ' + xhr.status;
			}
		}
		else {
			document.getElementById("loginMessage").innerHTML = 
				'Loading... Please wait...';
		}
	};
	xhr.open("POST", 'https://joshbiol.com/api/authenticate', true);
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	xhr.send('email=' + email + '&password=' + password);
}

function loaded() {
    document.getElementById('loginForm').addEventListener('submit', function(event) {
        event.preventDefault();
        var email = document.getElementById('address').value;
        var password = document.getElementById('secret').value;
        
        validateCredentials(email, password);
        
        document.getElementById('loginForm').reset();
    });
}

window.addEventListener('load', loaded, false);
