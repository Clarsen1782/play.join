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
            console.log("game:", game);
            const columnDiv = document.createElement('div');
            columnDiv.className = 'col s12 m4';
            columnDiv.setAttribute("data-game-id", game.id);

            const card = document.createElement('div');
            card.className = 'card merchcard';
                        
            const cardImage = document.createElement('div');
            cardImage.className = 'card-image';
            cardImage.setAttribute("height", 100);
            cardImage.setAttribute("width", "auto");
            
            const imgSrc = document.createElement('img');
            imgSrc.className = 'custom-card-image';
            // imgSrc.setAttribute("width", 200);
            // imgSrc.setAttribute("height", "auto");
            if (game.cover && game.cover.image_id) {
                imgSrc.src = `https://images.igdb.com/igdb/image/upload/t_cover_big/${game.cover.image_id}.jpg`;
            } else {
                // If no cover art then show a placeholder
                imgSrc.src = "/Image/Gaming.png"
            }

            cardImage.append(imgSrc);

            const cardBody = document.createElement('div');
            cardBody.className = 'card-body';

            const cardTitle = document.createElement('p');
            cardTitle.className = 'card-title center-align custom-card-title';
            cardTitle.textContent = game.name;

            const playerCount = document.createElement('p');
            playerCount.className = 'center-align  player-count';
            playerCount.textContent = `${game.count > 0 ? game.count : 0} players`
            
            // Bookmark
            const cardA = document.createElement('a');
            cardA.className = 'waves-effect waves-light btn-large deep-purple bookmark-icon';
            const bookmarkIcon = game.isFavorite ? "bookmark" : "bookmark_border";
            cardA.innerHTML = `<i class="material-icons">${bookmarkIcon}</i>`

            cardBody.append(cardTitle, playerCount, cardA)

            // Append everything to the card then the main div
            card.append(cardImage, cardBody);
            columnDiv.append(card);
            resultsContainer.appendChild(columnDiv);
        });
    }
});