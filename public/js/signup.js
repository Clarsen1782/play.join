document.addEventListener('DOMContentLoaded', function() {
    const signupForm = document.getElementById('signupForm');
    const signupMessage = document.getElementById('signupMessage');

    signupForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const formData = {
            userName: signupForm['userName'].value,
            email: signupForm['email'].value,
            password: signupForm['password'].value
        };

        fetch('/api/users/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        })
        .then(response => response.json())
        .then(data => {
            if(data.success) {
                window.location.href = '/login';
            } else {
                signupMessage.textContent = 'Signup failed: ' + data.message;
            }
        })
        .catch(error => {
            console.error('Error:', error);
            signupMessage.textContent = 'Signup failed: ' + error.message;
        });
    });
});