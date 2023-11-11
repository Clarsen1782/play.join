async function acceptFriend(event) {
    event.preventDefault();
    event.stopPropagation();

    console.log("@acceptFriend")
    const friendId = parseInt(event.target.dataset.userId);

    const response = await fetch("/api/users/acceptFriend", {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ friendId: friendId })
    });

    if (response.ok) {
        document.location.reload();
    } else {
        console.log("couldn't accept request");
    }
}

document.getElementById('button-accept-friend').addEventListener("click", acceptFriend);