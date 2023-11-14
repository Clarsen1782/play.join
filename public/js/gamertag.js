document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('gamerTagForm'); // Adjust this ID if necessary
    form.addEventListener('submit', function(e) {
        e.preventDefault();

        // Assuming there's no need for a gamerTagId for new additions, only for edits
        const gamerTagName = document.getElementById('gamerTag').value; // Adjust this ID if necessary

        // Determine if we are adding or editing based on some condition
        // For now, let's assume all submissions are additions
        fetch('/api/gamertags', {  // Adjust the endpoint if necessary
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // Include any necessary headers like authentication tokens
            },
            body: JSON.stringify({ name: gamerTagName })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            // console.log('Success:', data);
            // Update the gamer tags list in the UI
            updateGamerTagsList(data);
            // Reset the form
            form.reset();
            // Show success message
            // Need to import Materialize
            // Materialize.toast({html: 'Gamer tag added successfully!'});
        })
        .catch(error => {
            console.error('Error:', error);
            Materialize.toast({html: `Error: ${error.message}`});
        });
    });
});

function updateGamerTagsList(newGamerTag) {
    const list = document.querySelector("#list-gamertags");
    const listItem = document.createElement('li');
    listItem.textContent = newGamerTag.name;
    list.appendChild(listItem);
}