let form = document.querySelector("#form")
form.addEventListener("submit", async(event) => {
    event.preventDefault();
    let userName = document.querySelector("#user-name").value
    let movieName = document.querySelector("#movie-name").value
    let response = await fetch("http://localhost:5001/movie_likes",
    {
        mode: "no-cors",
        redirect: "follow",
        headers: {"Content-Type": "application/json"},
        method: "POST",
        body: JSON.stringify({userName, movieName})
    });
    let msg = await response.json()
    console.log(msg);
})