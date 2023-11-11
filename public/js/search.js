document.addEventListener('DOMContentLoaded', function() {
    const searchForm = document.getElementById('searchForm');
    const searchInput = document.getElementById('searchInput');
    const resultsContainer = document.getElementById('searchResults');
    let user;

    searchForm.addEventListener('submit', onClickSearch);

    function onClickSearch(event) {
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
    }

    /**
     * Takes an Array of Objects called "games" and creates HTML elements using a game's name, image, and player count.
     * Depending if this game is a user's favorite, it will change the bookmark icon.
     * @param {Array} games 
     */
    function displaySearchResults(games) {
        console.log("@displaySearchResults");
        resultsContainer.innerHTML = '';

        games.forEach(game => {
            const columnDiv = document.createElement('div');
            columnDiv.className = 'col s12 m4';

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
            cardA.setAttribute("data-game-id", game.id);
            cardA.setAttribute("data-game-name", game.name);
            cardA.addEventListener("click", onClickBookmark);

            const bookmarkIcon = game.isFavorite ? "bookmark" : "bookmark_border";
            cardA.innerHTML = `<i class="material-icons">${bookmarkIcon}</i>`

            cardBody.append(cardTitle, playerCount, cardA)

            // Append everything to the card then the main div
            card.append(cardImage, cardBody);
            columnDiv.append(card);
            resultsContainer.appendChild(columnDiv);
        });
    }

    /**
     * Allows a user to favorite a game and store it in the database.
     * @param {Event} event 
     */
    async function onClickBookmark(event) {
        event.preventDefault();
        event.stopPropagation();

        console.log("hello bookmark");
        const target = event.target;
        const gameId = target.getAttributeNode("data-game-id").value;
        const gameName = target.getAttributeNode("data-game-name").value;

        // Add the game to the database if it doesn't exist
        await fetch(`/api/games/${gameId}`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ gameName: gameName})
        }); 


        const newFavorite = {
            gameId: gameId,
            gamertagId: null // Might not need this for mvp
        }

        const response = await fetch("/api/users/favorites", {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(newFavorite)
        });

        if (response.ok) {
            
            // onClickSearch(event);
        }
    }
});