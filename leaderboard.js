const urlParams = new URLSearchParams(window.location.search);

const totalCount =
    urlParams.get("count") == 0 ? 999999 : urlParams.get("count") - 1;

// Game id
// https://github.com/speedruncomorg/api/blob/master/version1/games.md
const game = urlParams.get("game");

// Category id
// https://github.com/speedruncomorg/api/blob/master/version1/categories.md
const category = urlParams.get("category");



let animated = urlParams.get("animated");
if (animated == null) animated = false;
else animated = true;
const stayCount = parseInt(urlParams.get("stayCount"));
const switchCount = parseInt(urlParams.get("switchCount"));
const time = 6000 / urlParams.get("speed");

// Get additionnal variables that filter the leaderboard
// https://github.com/speedruncomorg/api/blob/master/version1/variables.md
let additionalVariables = "?";
urlParams.forEach((value, key) => {
    if (key.startsWith("var-")) {
        if (additionalVariables.length > 1) additionalVariables += "&";
        additionalVariables += key+"="+value;
    }
});


// https://github.com/speedruncomorg/api/blob/master/version1/leaderboards.md
async function getLeaderboard() {
    return fetch(
        "https://www.speedrun.com/api/v1/leaderboards/" +
            game +
            "/category/" +
            category + additionalVariables
    )
        .then((response) => response.json())
        .catch((e) => {
            console.log(e);
        });
}

//Recursive function that fetch and display every player in the leaderboard one after the other because the order is important
async function getNextPlayer(runs, count, playerData) {
    if (count > totalCount || runs.length <= count) {
        //Don't play the animation if there is not enough names
        if (animated == true && count > stayCount+switchCount) startAnimation();
        return playerData;
    }
    await playerData.push(
        fetch(runs[count].run.players[0].uri)//Get Player data
            .then((player) => {
                player
                    .json()//Convert data to json
                    .then((p) => {
                        setupName(p, count + 1);
                        getNextPlayer(runs, count + 1, playerData);
                    })
                    .catch((error) => {
                        console.log(error);
                    });
            })
            .catch((error) => {
                console.log(error);
            })
    );
}

function setupName(p, position) {
    //get text
    var pName = p.data.name != null ? p.data.name : p.data.names.international;

    //create element
    const li = document.createElement("li");
    li.classList.add("names");
    li.innerHTML = `${position + ". " + pName}`;

    //Setup colored name according to the player's settings
    const pstyle = p.data["name-style"];
    let color1 = "#FFF";
    let color2 = "#FFF";

    if (pstyle != null) {
        //style
        color1 = pstyle.style == "gradient" ? pstyle["color-from"] : pstyle.color;
        color2 = pstyle.style == "gradient" ? pstyle["color-to"] : pstyle.color;
    }

    li.style.backgroundImage = `linear-gradient(to right, ${color1.dark},${color2.dark})`;

    //add to html
    document.querySelector("#leaderboard").appendChild(li);
}

/// Animation
let list = [];

function startAnimation() {
    list = document.querySelector("#leaderboard").children;

    //Hide everything
    for (var i = 0; i < list.length; i++) {
        if (i >= stayCount) {
            hide(list[i]);
        }
    }
    resetAnimation();
}

//When the recursive function gets to the end of the list, resets the cursors and start again
function resetAnimation() {
    let cursorFrom = stayCount;
    let cursorTo = stayCount + switchCount;

    setTimeout(function () {
        showNext(cursorFrom, cursorTo);
    }, 1000);
}

//recursive function that show and hide the next set of names
function showNext(cursorFrom, cursorTo) {
    for (var i = cursorFrom; i < cursorTo; i++) {
        if (i >= list.length) continue;
        show(list[i]);
    }
    setTimeout(function () {
        for (var i = cursorFrom; i < cursorTo; i++) {
            if (i >= list.length) continue;
            hide(list[i]);
        }
        if (cursorTo >= list.length) {
            resetAnimation();
            return;
        } else {
            setTimeout(function () {
                showNext(cursorFrom + switchCount, cursorTo + switchCount);
            }, 1000);
        }
    }, time);
}

//Shows the name with an animation
function show(element) {
    element.classList.remove("hide");
    element.classList.add("fade-in");
    setTimeout(function () {
        element.classList.remove("fade-in");
    }, 1000);
}

//Hides the name with an animation
function hide(element) {
    element.classList.add("fade-out");
    setTimeout(function () {
        element.classList.remove("fade-out");
        element.classList.add("hide");
    }, 1000);
}

async function main() {
    let data = await getLeaderboard();
    await getNextPlayer(data.data.runs, 0, []);
}

main();
