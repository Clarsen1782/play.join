document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const loginMessage = document.getElementById('loginMessage');

    loginForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const formData = {
            email: loginForm['email'].value,
            password: loginForm['password'].value
        };

        fetch('/api/users/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                window.location.replace("/"); 
            } else {
                loginMessage.textContent = 'Login failed: ' + data.message; //havent set the messages yet
            }
        })
        .catch(error => {
            console.error('Error:', error);
            loginMessage.textContent = 'Login failed: ' + error.message; //havent set the messages yet
        });
    });
});