const urlParams = new URLSearchParams(window.location.search);
const query = urlParams.get("search");

let categories = [];

async function performSearch() {

    let a = query.replaceAll(" ","%20");
    console.log(a);

    document.querySelector("#body p1").innerHTML = "Search result for : " + query;
    
    fetch(
        "https://www.speedrun.com/api/v1/games?page=2&name=" + a
    )
        .then((response) => {
        
            let result = response.json()
            result.then(data => {
                data.data.forEach((game) => {
                    let div = document.createElement("div");
                    let img = new Image();
                    img.src = game.assets["cover-large"].uri;
                    div.className = "thumbnail";
                    let name = document.createElement("span");
                    name.innerHTML = game.names.international;
                    div.appendChild(name);
                    div.appendChild(img);
                    document.getElementById('body').appendChild(div);
                    div.onmouseleave = function() { gameleave(); }
                    img.onmouseenter = function() { gameHover(game, div); }
                    fetch(
                        "https://www.speedrun.com/api/v1/games/" + game.id + "/categories"
                    ).then(gameCate => {
                        gameCate.json().then(data => {
                            console.log(data);
                            categories[game.id] = data;
                        });
                    });
                    
                })
            })
        })
        .catch((e) => {
            console.log(e);
        });
}

performSearch();


function gameHover (game, div) {
    let menu = document.getElementById("contextMenu");
    menu.innerHTML = "";
    menu.classList.remove("hidden");
    categories[game.id].data.forEach(cate => {
        if (cate.type != "per-game") return;
        let li = document.createElement("li")
        let a = document.createElement("a");
        a.innerHTML = cate.name;
        a.setAttribute("href","../leaderboard.html?game="+game.id+"&category="+cate.id+"&count=20");
        li.appendChild(a);
        menu.appendChild(li);
        div.appendChild(menu);
    })
}

function gameleave () {
    menu = document.getElementById("contextMenu");
    menu.innerHTML = "";
    menu.classList.add("hidden");
}