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
        "https://www.speedrun.com/api/v1/games?name=" + a
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
        "https://www.speedrun.com/api/v1/games/" + game.id + "/categories?embed=variables"
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
        //Allow for the category to be clickable
        a.setAttribute("href","#");
        //On click set the values to get the game and category needed
        a.setAttribute("onclick","selectedGameThumbnail=\""+ game.assets["cover-large"].uri + "\";selectedGame=\""+game.id+"\";selectedCategory=\""+index+"\";showModal();return false;");

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

    // Customize Header
    document.querySelector('#header h1').innerHTML = categories[selectedGame].name;
    document.querySelector('#header h3').innerHTML = categories[selectedGame].data[selectedCategory].name;
    document.querySelector('#header img').src = selectedGameThumbnail;

    // Set the values of hidden input in the form
    document.getElementById("game").value = selectedGame;
    document.getElementById("category").value = categories[selectedGame].data[selectedCategory].id;

    // Create new input for each game specific variables
    let variables = categories[selectedGame].data[selectedCategory].variables.data;
    variables.forEach(v => {
        if (v["is-subcategory"] == false) return;
        console.log(v);
        createVariableSelector(v);
    });
}

function hideModal () {
    document.getElementById('modalWindow').classList.add('hidden');
    //Clear variable selector
    document.querySelector("#variables").innerHTML = "";
}

function createVariableSelector (variable) {
    /*
    <div id="variables">
        <div class="modalElement">
            <p>Platform</p>
            <select name="var-variableID" class="variable" required>
                <option value="var1ID">Option 1</option>
                <option value="var2ID">Option 2</option>
            </select>
        </div>
    </div>
    */

    // Wrapper div for all variable selector
    const div = document.querySelector("#variables");

    // Wrapper div for one selector
    const modalElement = document.createElement("div");
    modalElement.classList.add("modalElement");
    div.appendChild(modalElement);

    // Variable Name
    const p = document.createElement("p");
    p.innerHTML = variable.name;
    modalElement.appendChild(p);

    // Select element
    const select = document.createElement("select");
    select.setAttribute("name","var-" + variable.id);
    select.setAttribute("required","true");
    select.classList.add("variable");
    modalElement.appendChild(select);

    // Add options to the select
    for (const [key, value] of Object.entries(variable.values.values)) {
        const option = document.createElement("option");
        option.setAttribute("value",key);
        option.innerHTML = value.label;
        select.appendChild(option);
    }

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