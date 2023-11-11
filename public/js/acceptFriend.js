async function acceptFriend(event) {
    event.preventDefault();
    event.stopPropagation();

    console.log("@acceptFriend");
}

document.getElementById('button-accept-friend').addEventListener("click", acceptFriend);