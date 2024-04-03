const urlParams = new URLSearchParams(window.location.search);
const totalCount = urlParams.get('count') == 0 ? 999999 : urlParams.get('count')-1;
const game = urlParams.get('game');
const category = urlParams.get('category');
console.log(game);
console.log(category);
console.log(totalCount);

async function getLeaderboard() {
    //"https://www.speedrun.com/api/v1/leaderboards/nd28z0ed/category/w20e4yvd"
    return fetch(
        "https://www.speedrun.com/api/v1/leaderboards/" + game + "/category/" + category
    )
        .then((response) => response.json())
        .catch((e) => {
            console.log(e);
        });
}

async function getNextPlayer (runs, count, playerData) {
    if (count > totalCount) return playerData;
    if (runs.length <= count) return;
    await playerData.push(fetch(runs[count].run.players[0].uri)
        .then((player) => {
            player.json().then((p) => {
                setupName(p);
                getNextPlayer(runs, count+1, playerData);
            }).catch((error) => {
                console.log(error); 
            });
        })
        .catch((error) => {
            console.log(error);
        }));
}

function setupName(p) {
    //get text
    var pName = p.data.name != null ? p.data.name : p.data.names.international;

    //create element
    const li = document.createElement("li");
    li.classList.add("names2");
    //li.innerHTML = `<span class="names2">${pName}</span>`;
    li.innerHTML = `${pName}`;

    //style
    let color1 =
        p.data["name-style"].style == "gradient"
            ? p.data["name-style"]["color-from"]
            : p.data["name-style"].color;
    let color2 =
        p.data["name-style"].style == "gradient"
            ? p.data["name-style"]["color-to"]
            : p.data["name-style"].color;
    li.style.backgroundImage = `linear-gradient(to right, ${color1.dark},${color2.dark})`;

    //add to html
    document.querySelector("#leaderboard").appendChild(li);
}

async function main() {
    let data = await getLeaderboard();
    await getNextPlayer (data.data.runs, 0, []);
}

main();
