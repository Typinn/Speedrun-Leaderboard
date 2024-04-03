const urlParams = new URLSearchParams(window.location.search);
const totalCount = urlParams.get('count') == 0 ? 999999 : urlParams.get('count')-1;
const game = urlParams.get('game');
const category = urlParams.get('category');
const animated = true;// urlParams.get('animated');
const stayCount = 3;//urlParams.get('stayCount');
const switchCount = 7;//urlParams.get('switchCount');
const time = 3000;//urlParams.get('time');

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
    
    if (count > totalCount || runs.length <= count) {
        if (animated == true) startAnimation();
        return playerData;
    }
    await playerData.push(fetch(runs[count].run.players[0].uri)
        .then((player) => {
            player.json().then((p) => {
                setupName(p, count+1);
                getNextPlayer(runs, count+1, playerData);
            }).catch((error) => {
                console.log(error); 
            });
        })
        .catch((error) => {
            console.log(error);
        }));
}

function setupName(p, position) {
    //get text
    var pName = p.data.name != null ? p.data.name : p.data.names.international;

    //create element
    const li = document.createElement("li");
    li.classList.add("names2");
    //li.innerHTML = `<span class="names2">${pName}</span>`;
    li.innerHTML = `${position + ". " + pName}`;

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

/// Animation
let list = [];

function startAnimation () {
    list = document.querySelector("#leaderboard").children;

    //Hide everything
    for (var i = 0; i < list.length; i++) {
        if (i >= stayCount) {
            hide(list[i]);
        }
    }
    resetAnimation();
}

function resetAnimation () {
    let cursorFrom = stayCount;
    let cursorTo = stayCount + switchCount;

    setTimeout(function() { showNext(cursorFrom,cursorTo) },1000);
}

function showNext (cursorFrom, cursorTo) {
    for (var i = cursorFrom; i < cursorTo; i++) {
        if (i >= list.length) continue;
        show(list[i])
    }
    setTimeout(function() {
        for (var i = cursorFrom; i < cursorTo; i++) {
            if (i >= list.length) continue;
            hide(list[i]);
        }
        if (cursorTo >= list.length) {
            resetAnimation();
            return;
        }else{
            setTimeout(function() { showNext(cursorFrom+switchCount,cursorTo+switchCount) },1000);
        } 
    },time);

    
    
}



function hide (element) {
    element.classList.add("fade-out");
    setTimeout(function() {
        element.classList.remove("fade-out");
        element.classList.add("hide");  
    }, 1000);
    
}

function show (element) {
    element.classList.remove("hide");
    element.classList.add("fade-in");
    setTimeout(function() {
        element.classList.remove("fade-in");
    },1000);
}

main();
