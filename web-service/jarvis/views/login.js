function validateCredentials(email, password) {
    var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function() {
		if (xhr.readyState === XMLHttpRequest.DONE) {
			// Response received
			if (xhr.status === 200) {
				
				var json = JSON.parse(xhr.responseText);
				
				document.getElementById('validationResults').innerHTML = JSON.stringify(json, null, 2);
			}
			else {
				document.getElementById("validationResults").innerHTML = 
					'Status Code: ' + xhr.status;
			}
		}
		else {
			document.getElementById("validationResults").innerHTML = 
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
        console.log(email + ' ' + password);
        
        validateCredentials(email, password);
        
        document.getElementById('address').innerHTML = '';
        document.getElementById('secret').innerHTML = '';
    });
}

window.addEventListener('load', loaded, false);