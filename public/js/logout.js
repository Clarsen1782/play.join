async function logoutUser(event) {
    event.preventDefault();
    event.stopPropagation();

    try {
        const response = await fetch("/api/users/logout", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (response.ok) {
            document.location.replace("/"); // Go back to homepage upon logout
        }
    } catch (error) {
        alert("Couldn't logout for some reason");
        console.error(error);
    }
}

document.getElementById("navbar-logout").addEventListener("click", logoutUser);
document.getElementById("navbar-logout-mobile").addEventListener("click", logoutUser);