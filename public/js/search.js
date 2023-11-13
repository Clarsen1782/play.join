document.addEventListener('DOMContentLoaded', function () {
    const searchForm = document.getElementById('searchForm');
    const searchInput = document.getElementById('searchInput');
    const resultsContainer = document.getElementById('searchResults');
    let user;
    loadUser(); // Load user so we can check if a user has a favorited game

    searchForm.addEventListener('submit', onClickSearch);

    /**
     * Search IGDB for games
     * @param {Event} event 
     */
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
     * Depending if this game is a user's favorite, it will change the favorite icon.
     * @param {Array} games 
     */
    function displaySearchResults(games) {
        resultsContainer.innerHTML = '';

        if (games.length === 0) {
            const noGamesMessage = document.createElement('h1');
            noGamesMessage.className = "center-align white-text";
            noGamesMessage.textContent = "No games found. Please modify search";
            resultsContainer.appendChild(noGamesMessage);
        }

        games.forEach(async (game) => {
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
                imgSrc.src = "/images/Gaming.png"
            }

            cardImage.append(imgSrc);

            const cardBody = document.createElement('div');
            cardBody.className = 'card-body';

            const cardTitle = document.createElement('p');
            cardTitle.className = 'card-title center-align custom-card-title';
            cardTitle.textContent = game.name;

            const playerCount = document.createElement('p');
            playerCount.className = 'center-align  player-count';
            const count = await getGamePlayerCount(game);
            playerCount.setAttribute("data-game-player-count", `${game.id},${count}`); // Mark with game id and its playercount
            playerCount.textContent = `${count} ${count === 1 ? "player" : "players" }`

            const br = document.createElement('br');
            const buttonViewPlayers = document.createElement('a');
            buttonViewPlayers.setAttribute("href", `/games/${game.id}`);
            
            if (count === 0) {
                buttonViewPlayers.textContent = "View details";
            } else {
                buttonViewPlayers.textContent = `${count === 1 ? "View player & details" : "View players & details"}` ;
            }

            playerCount.append(br, buttonViewPlayers);

            // Show favorites if user is logged in

            if (this.user) {
                const cardA = document.createElement('a');
                cardA.className = 'waves-effect waves-light btn-large deep-purple favorite-icon';
                cardA.setAttribute("data-game-id", game.id);
                cardA.setAttribute("data-game-name", game.name);
    
                const isAUserFavorite = isUsersFavorite(this.user, game.id);
                cardA.addEventListener("click", (e) => onClickFavorite(e, game, count));
    
                const favoriteIcon = isAUserFavorite ? "favorite" : "favorite_border";
                cardA.innerHTML = `<i class="material-icons">${favoriteIcon}</i>`
                // If user is logged in, then allow favoriting
                cardBody.append(cardTitle, playerCount, cardA);
            } else {
                // Else don't allow favoriting
                cardBody.append(cardTitle, playerCount);
            }

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
    async function onClickFavorite(event, game, playerCount) {
        event.preventDefault();
        event.stopPropagation();
        
        // Get the HTML that shows if the favorite icon is filled in or not.
        const favoriteIcon = document.querySelector(`[data-game-id="${game.id}"]`).children[0];
        const elPlayerCount = document.querySelector(`[data-game-player-count="${game.id},${playerCount}"]`);
        
        if (favoriteIcon.innerHTML === "favorite") { // It's a favorite so unfavorite

            const removeFavorite = {
                gameId: game.id,
            }

            await fetch("/api/users/removeFavorite", {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(removeFavorite)
            });

            // Show game is now unfavorited
            favoriteIcon.innerHTML = "favorite_border";

        } else { // Not a favorite so make a favorite

            const newFavorite = {
                gameId: game.id,
                gamertagId: null // Might not need this for mvp
            }

            await fetch("/api/users/addFavorite", {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newFavorite)
            });

            // Show game is now favorited
            favoriteIcon.innerHTML = "favorite";
        }

        // update current game's player count on the spot
        const newCount = await getGamePlayerCount(game);
        elPlayerCount.innerHTML = `${newCount} ${newCount === 1 ? "player" : "players" }`

        // Add back the "View players" anchor if player count is higher than 0
        const br = document.createElement('br');
        const buttonViewPlayers = document.createElement('a');
        buttonViewPlayers.setAttribute("href", `/games/${game.id}`);
        
        if (newCount === 0) {
            buttonViewPlayers.textContent = "View details";
        } else {
            buttonViewPlayers.textContent = `${newCount === 1 ? "View player & details" : "View players & details"}` ;
        }

        elPlayerCount.append(br, buttonViewPlayers);
    }
});

/**
 * Loads the user's info if logged in. This is used for determining if a user has booked marked a game before or not.
 */
async function loadUser() {
    try {
        const response = await fetch(`/api/users/0`, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (response.ok) {
            user = await response.json();
            // console.log("user:", user);
        }
    } catch (error) {
        console.log("Couldn't fetch user info");
        console.error(error);
    }
}

/**
 * Iterates through the user's "games" array and checks if the user has favorited a game or not
 * @param {Object} user 
 * @param {Int} gameId 
 * @returns 
 */
function isUsersFavorite(user, gameId) {
    for (const game of user.games) {
        if (game.id === gameId) {
            // console.log("this is a user's favorite");
            return true
        }
    }

    return false;
}

async function getGamePlayerCount(game) {
    const response = await fetch(`/api/games/${game.id}`, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ gameName: game.name })
    });

    if (response.ok) {
        // Only return the player count from the json
        return (await response.json()).playerCount;
    } else {
        return 0;
    }
}

document.addEventListener('DOMContentLoaded', function() {
    var searchIcon = document.querySelector('.label-icon');
    var searchInput = document.getElementById('searchInput');

    searchIcon.addEventListener('click', function() {
        // Toggle visibility or expand the search bar
        searchInput.style.width = searchInput.style.width === '100%' ? '0' : '100%'; // Example toggle
        searchInput.focus(); // Focus on the input field
    });
});