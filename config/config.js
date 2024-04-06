const urlParams = new URLSearchParams(window.location.search);
const query = urlParams.get("search");

let categories = [];
let selectedGame = null;
let selectedGameThumbnail = null;
let selectedCategory = null;

async function performSearch() {

    let a = query.replaceAll(" ","%20");

    document.querySelector("#body p1").innerHTML = "Search result for : " + query;
    
    fetch(
        "https://www.speedrun.com/api/v1/games?page=2&name=" + a
    )
        .then((response) => {
            response.json()
                .then(data => {
                    data.data.forEach((game) => {
                        createVignette(game);
                    })})
                .catch(e => console.log(e))
        })
        .catch(e => console.log(e));
}

performSearch();


function createVignette (game) {
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
            categories[game.id] = data;
            categories[game.id]["name"] = game.names.international;
        });
    });
}

function gameHover (game, div) {
    let menu = document.getElementById("contextMenu");
    menu.innerHTML = "";
    menu.classList.remove("hidden");

    categories[game.id].data.forEach((cate,index) => {
        if (cate.type != "per-game") return;
        let li = document.createElement("li")
        let a = document.createElement("a");
        a.innerHTML = cate.name;
        a.setAttribute("href","#");
        a.setAttribute("onclick","selectedGameThumbnail=\""+ game.assets["cover-large"].uri + "\";selectedGame=\""+game.id+"\";selectedCategory=\""+index+"\";showModal();");
        //selectedGame="+game.id+";selectedCategory="+cate.id+";"
        //a.setAttribute("href","../leaderboard.html?game="+game.id+"&category="+cate.id+"&count=20");
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

function showModal () {
    document.getElementById('modalWindow').classList.remove('hidden');
    document.querySelector('#header h1').innerHTML = categories[selectedGame].name;
    document.querySelector('#header h3').innerHTML = categories[selectedGame].data[selectedCategory].name;
    document.querySelector('#header img').src = selectedGameThumbnail;
    document.getElementById("game").value = selectedGame;
    document.getElementById("category").value = categories[selectedGame].data[selectedCategory].id;
}

function hideModal () {
    document.getElementById('modalWindow').classList.add('hidden');
}

function submitLeaderboard () {
    window.location.href = "../leaderboard.html?game="+selectedGame+"&category="+categories[selectedGame].data[selectedCategory].id+"&count=20";
    return false;
}

//Modal window
const checkbox = document.getElementById('modalCheckbox');
const animParam = document.getElementById('animParam');

checkbox.addEventListener('change', (event) => {
  if (event.currentTarget.checked) {
    animParam.classList.remove("hidden");
  } else {
    animParam.classList.add("hidden");
  }
})