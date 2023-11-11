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

            const isAUserFavorite = isUsersFavorite(this.user, game.id);
            cardA.addEventListener("click", (e) => onClickBookmark(e, game.id, game.name));

            const bookmarkIcon = isAUserFavorite ? "bookmark" : "bookmark_border";
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
    async function onClickBookmark(event, gameId, gameName) {
        event.preventDefault();
        event.stopPropagation();

        // Get the HTML that shows if the bookmark icon is filled in or not.
        const bookmarkIcon = document.querySelector(`[data-game-id="${gameId}"]`).children[0];

        if (bookmarkIcon.innerHTML === "bookmark") { // It's a favorite so unfavorite

            const removeFavorite = {
                gameId: gameId,
            }

            await fetch("/api/users/removeFavorite", {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(removeFavorite)
            });

            // Show game is now unfavorited
            bookmarkIcon.innerHTML = "bookmark_border";
        } else { // Not a favorite so make a favorite

            // Add the game to the database if it doesn't exist
            await fetch(`/api/games/${gameId}`, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ gameName: gameName })
            });

            const newFavorite = {
                gameId: gameId,
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
            bookmarkIcon.innerHTML = "bookmark";
        }
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