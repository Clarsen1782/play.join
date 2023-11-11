async function addFriend(event) {
    event.preventDefault();
    event.stopPropagation();

    const friendId = parseInt(event.target.dataset.userId);

    const response = await fetch("/api/users/addFriend", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ friendId: friendId })
    });

    if (response.ok) {
        document.location.reload();
    } else {
        console.log("couldn't send request");
    }
}

document.getElementById('button-add-friend').addEventListener("click", addFriend);