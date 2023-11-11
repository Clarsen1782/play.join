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
            card.className = 'card merchard';
            
            const cardImage = document.createElement('div');
            cardImage.className = 'card-image';
            cardImage.setAttribute("height", 100);
            
            const imgSrc = document.createElement('img');
            if (game.cover.image_id) {
                imgSrc.src = `https://images.igdb.com/igdb/image/upload/t_cover_big/${game.cover.image_id}.jpg`;
            } else {
                // If no cover art then show a placeholder
                imgSrc.src = "/Image/Gaming.png"
            }

            const cardTitle = document.createElement('span');
            cardTitle.className = 'card-title';
            cardTitle.textContent = game.name;

            const cardA = document.createElement('a');
            cardA.className = 'btn-floating halfway-fab waves-effect waves-light deep-purple'
            cardA.innerHTML = '<i class="material-icons">add</i>'

            // Append to card image div
            cardImage.append(cardTitle, imgSrc, cardTitle, cardA);

            const cardContent = document.createElement('div');
            cardContent.className = 'card-content';
            const playerCount = document.createElement('p');
            playerCount.textContent = `${game.count > 0 ? game.count : 0} players`

            // Append to card content
            cardContent.append(playerCount);

            // Append everything to the card then the main div
            card.append(cardImage, cardContent);
            resultsContainer.appendChild(card);
        });
        
        // games.forEach(game => {
        //     const gameDiv = document.createElement('div');
        //     gameDiv.className = 'game-result';
        //     gameDiv.setAttribute("data-game-id", game.id);

        //     const title = document.createElement('h3');
        //     title.textContent = game.name;
        //     gameDiv.appendChild(title);

        //     if (game.cover && game.cover.image_id) {
        //         const imageUrl = `https://images.igdb.com/igdb/image/upload/t_cover_big/${game.cover.image_id}.jpg`;
        //         const image = document.createElement('img');
        //         image.src = imageUrl;
        //         image.alt = `Cover of ${game.name}`;
        //         gameDiv.appendChild(image);
        //     } else {
        //         // TODO: Put placeholder. Example game is Medal of Valor 4
                
        //     }

        //     resultsContainer.appendChild(gameDiv);
        // });
    }
});