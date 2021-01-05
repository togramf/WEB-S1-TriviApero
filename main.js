/* rappel : #id et .class */

const section_menu = document.querySelector('#menu_section');
const section_parametres = document.querySelector('#param_section');
const section_jeu = document.querySelector('#game_section');
const section_fin = document.querySelector('#end_section');

const logo = document.querySelector('#logo2');

const game_menu = document.querySelector('#game_menu');
const play_menu = document.querySelector('#play_menu');
const section_scores = document.querySelector('#score_section');

const play_param = document.querySelector('#play_parameters');
const play_area = document.querySelector('#play_area');
const result_area = document.querySelector('#result_area');

const categories = document.querySelector('#select_category');
const questions = document.querySelector('#question_area');
const answers = document.querySelector('#answer_area');
const result = document.querySelector('#result');
const scores_area = document.querySelector('#scores_area');
const drink_area = document.querySelector('#drink_distribution');

const liste_players = document.querySelector('.list_players');
const liste_drinkers = document.querySelector('#list_drinkers');
const nbPlayers = document.querySelector('#nbPlayersValueId');
const slide_nbPlayers = document.querySelector('#nbPlayersId');

const btn_start = document.querySelector('#start_game');
const btn_play = document.querySelector('#play_game');
const btn_question = document.querySelector('#start_question');
const btn_next = document.querySelector('#next_game');

const btn_add_player = document.querySelector('#add_pseudo');

const stop_game = false; 
var current_player = 1;
var current_round = 1;
var drink_limit = 5;
var nbDrinks = 0;

function displayOrHide (element){
    element.classList.toggle("hidden_element");
};

function startClick(e){
    console.log("Lancement du Jeu !");
    displayOrHide(section_menu); //disparition menu
    displayOrHide(logo);    //apparition logo 
    displayOrHide(section_parametres);  //apparition parametres 
}
btn_start.addEventListener('click',startClick);


function addPlayer() {
    var player = document.createElement('li');
    
    player.textContent = document.querySelector('#pseudo').value;
    player.value = 0; //sert a compter le score 

    liste_players.appendChild(player);
    document.querySelector('#pseudo').value = "";

    slide_nbPlayers.value++;
    nbPlayers.value = slide_nbPlayers.value;

    player_score = document.createElement('li');
    player_score.value = player.value;
    player_score.textContent = "Score de "+player.textContent+" = "+player.value;
    
    scores_area.appendChild(player_score);
    
    console.log("Ajout de ", player.textContent);

    if (slide_nbPlayers.value == 2) {
        displayOrHide(btn_play);
    }
    if (slide_nbPlayers.value == 10) {
        displayOrHide(document.querySelector('.pseudo-form'));
    }
}
btn_add_player.addEventListener('click', addPlayer);

document.querySelector('#pseudo').addEventListener("keyup", function(e) {
    if (e.keyCode === 13){
        addPlayer();
        return false;
    }
});

const players = liste_players.childNodes;
const scores = scores_area.childNodes;

function playClick(e){
    drink_limit = document.querySelector('#nbDrinkId').value;
    console.log("Partie en ", drink_limit,"gorgées ! Lancement du Jeu !");
    displayOrHide(section_parametres);
    players[current_player].classList.toggle("current_player");
    document.querySelector('#current_player').textContent = "Tour de "+players[current_player].textContent;
    document.querySelector('#current_player').value = current_player;
    displayOrHide(section_jeu);

    getCategories();
}
btn_play.addEventListener('click',playClick);


async function getCategories(){
    const response = await fetch ('https://opentdb.com/api_category.php');
    const body = await response.json();

    try {
        console.log(body);
        for (i=0; i<body.trivia_categories.length; i++){
            
            
            var newElement = document.createElement('option');
            newElement.value = body.trivia_categories[i].id;
            newElement.textContent=body.trivia_categories[i].name;
            categories.appendChild(newElement);
        }
    }
    catch {
        console.log("erreur");
    }
}

async function getQuestion(){
    var url;
    var cat = document.querySelector('#select_category').value;
    var diff = document.querySelector('#select_difficulty').value;
    console.log(cat, diff);
    if (diff != "any_difficulty"){
        url = 'https://opentdb.com/api.php?amount=1&category='+cat+'&difficulty='+diff;
    } else {
        url = 'https://opentdb.com/api.php?amount=1&category='+cat;
    }
    const response = await fetch(url);
    const body = await response.json();

    try {
        console.log(body);
        createQuestion(body.results[0]);
    }
    catch {
        console.log("erreur");
    }
    displayOrHide(play_area);
    displayOrHide(play_param);
}

function createQuestion ( quest ) {
    console.log(quest.category);

    document.querySelector('#question_category').textContent = quest.category;
    document.querySelector('#question_difficulty').textContent = quest.difficulty;
    document.querySelector('#question_wording').textContent = quest.question;

    while (answers.lastChild){
        answers.removeChild(answers.lastChild);
    }

    var nb_options = 1 + quest.incorrect_answers.length; 
    var position_correct = Math.round((nb_options -1) * Math.random()) + 1;
    console.log(nb_options, position_correct);

    var j = 0;
    for (var i = 1; i<=nb_options; i++){
        var newProposition = document.createElement('p');
        if (i!=position_correct){
            newProposition.classList.add("incorrect_answer");
            newProposition.textContent = quest.incorrect_answers[j];
            j ++;
        } else {
            newProposition.classList.add("correct_answer");
            newProposition.textContent = quest.correct_answer;
        }
        newProposition.addEventListener('click', submitAnswer);
        answers.appendChild(newProposition);
    }    
}
btn_question.addEventListener('click', getQuestion);


function submitAnswer ( e ){
    displayOrHide(btn_next);

    document.querySelector('.correct_answer').classList.toggle('highlight_answer');
    e.currentTarget.classList.toggle('selected_answer');
    
    var diff = document.querySelector('#question_difficulty');
    var score; 
    if (diff == 'easy'){
        score = 1;
    } else if (diff ='medium'){
        score = 2;
    } else if (diff = 'hard'){
        score = 3;
    }

    nbDrinks = score;
    console.log("nb de gorgées en jeu ", nbDrinks);

    if (e.currentTarget.classList.contains('correct_answer')){
        console.log("Bonne réponse ! ");
        result.textContent = 'Bravo, bonne réponse '+players[current_player].textContent+' ! Distribue '+score+' gorgées en cliquant sur les noms des joueurs !';
        giveDrinks(current_player);
    } else {
        console.log("Mauvaise réponse ! ");
        result.textContent = 'Dommage, mauvaise réponse '+players[current_player].textContent+' ! Bois '+score+' gorgées !';
        drink(current_player, score);
    }
    
    displayOrHide(result_area);
}

//fonctions pas finies 
function giveDrinks(player){
    
    document.querySelector('#drinks_to_give').textContent = "Il reste "+nbDrinks.value+" gorgées à distribuer";
    
    while (liste_drinkers.lastChild){
        liste_drinkers.remove(liste_drinkers.lastChild);
    }

    for (var i = 1; i<=nbPlayers.value; i++){
        var drinker = document.createElement('p');
        drinker.textContent = players[i].textContent;
        if (i<current_player){
            drinker.addEventListener('click', drink(i-1, 1));
            liste_drinkers.appendChild(drinker);
        } else if (i>current_player){
            drinker.addEventListener('click', drink(i, 1));
            liste_drinkers.appendChild(drinker);
        }
    }
    
    drink_area.classList.remove("hidden_element");
}

function drink (player, nbDrink){

        document.querySelector('#drinks_to_give').textContent = "Il reste "+nbDrinks+" gorgées à distribuer";
    
        console.log('joueur ', players[player].textContent, " boit", nbDrink, " gorgée(s)");
        players[player].value += nbDrink;
        nbDrinks -= nbDrink;
        majScores();
    
    if (nbDrinks == 0){
        displayOrHide(btn_next);
        drink_area.classList.add("hidden_element");
    }

    if (players[player].value >= drink_limit){
        endGame();
    }
}  

function majScores(){
    for (var i =1; i<=nbPlayers.value; i++){
        scores[current_player-1].textContent="Score de "+players[current_player].textContent+" = "+players[current_player].value;
    }
}

function nextClick (e) {
    document.querySelector('.correct_answer').classList.toggle('highlight_answer');
    
    players[current_player].classList.toggle("current_player");
    if (current_player<nbPlayers.textContent){
        current_player += 1;
    } else {
        current_player = 1;
        current_round += 1;
        document.querySelector('#round_compteur').textContent = 'Round '+current_round;
    }
    
    players[current_player].classList.toggle("current_player");

    console.log(players[current_player-1]);
    console.log(players[current_player]);

    document.querySelector('#current_player').textContent = "Tour de "+players[current_player].textContent;
    document.querySelector('#current_player').value = current_player;
    
    displayOrHide(play_param);
    displayOrHide(play_area);
    displayOrHide(result_area);
}
btn_next.addEventListener('click',nextClick);

function endGame(){
    displayOrHide(section_fin);
    displayOrHide(section_jeu);
    //affiche la fin de partie 
    //affiche les scores 
    //bouton pour relancer une partie avec même joueurs 
    //bouton pour relancer du début 
}