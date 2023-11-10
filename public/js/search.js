document.addEventListener('DOMContentLoaded', function() {
    const searchForm = document.getElementById('searchForm');
    const searchInput = document.getElementById('searchInput');
    const resultsContainer = document.getElementById('searchResults');

    searchForm.addEventListener('submit', function(event) {
        event.preventDefault();
        
        const searchText = searchInput.value;
        const body = {
            keyword: encodeURIComponent(searchText)
        }

        fetch(`/api/games/search`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body)
        })
            .then(response => response.json())
            .then(games => {
                displaySearchResults(games);
            })
            .catch(error => {
                console.error('Search Error:', error);
                resultsContainer.textContent = 'Search failed: ' + error.message;
            });
    });

    function displaySearchResults(games) {
        console.log("@displaySearchResults");
        resultsContainer.innerHTML = ''; 

        games.forEach(game => {
            const gameDiv = document.createElement('div');
            gameDiv.className = 'game-result';

            const title = document.createElement('h3');
            title.textContent = game.name;
            gameDiv.appendChild(title);

            const gameId = document.createElement('p');
            gameId.textContent = `Game ID: ${game.id}`;
            gameDiv.appendChild(gameId);

            if (game.cover && game.cover.image_id) {
                const imageUrl = `https://images.igdb.com/igdb/image/upload/t_cover_big/${game.cover}.jpg`;
                const image = document.createElement('img');
                image.src = imageUrl;
                image.alt = `Cover of ${game.name}`;
                gameDiv.appendChild(image);
            }

            resultsContainer.appendChild(gameDiv);
        });
    }
});