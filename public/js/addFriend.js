async function addFriend(event) {
    event.preventDefault();
    event.stopPropagation();

    console.log("@addFriend ");
    const friendId = event.target.dataset.userId;

    await fetch("/api/users/addFriend", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ friendId: friendId })
    });

    document.location.reload();
}

document.getElementById('button-add-friend').addEventListener("click", addFriend);