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
const recap_area = document.querySelector('#recap_area');

const categories = document.querySelector('#select_category');
const questions = document.querySelector('#question_area');
const answers = document.querySelector('#answer_area');
const result = document.querySelector('#result');
const scores_area = document.querySelector('#scores_area');
const drink_area = document.querySelector('#drink_distribution');

const liste_players = document.querySelector('#list_players');
const liste_drinkers = document.querySelector('#list_drinkers');
const nbPlayers = document.querySelector('#nbPlayersValueId');
const slide_nbPlayers = document.querySelector('#nbPlayersId');

const btn_start = document.querySelector('#start_game');
const btn_play = document.querySelector('#play_game');
const btn_question = document.querySelector('#start_question');
const btn_next = document.querySelector('#next_game');
const btn_restart = document.querySelector('#new_game');

const btn_add_player = document.querySelector('#add_pseudo');

var current_player = 1;
var current_round = 1;
var drink_limit = 5;
var nbDrinksInGame = 0;

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
    var player = document.createElement('p');
    
    player.textContent = document.querySelector('#pseudo').value;
    player.value = 0; //sert a compter le score 

    liste_players.appendChild(player);
    document.querySelector('#pseudo').value = "";

    slide_nbPlayers.value++;
    nbPlayers.value = slide_nbPlayers.value;

    player_score = document.createElement('p');
    player_score.value = player.value;
    
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
    majScores();
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
    if ((cat == "any_category") && (diff == "any_difficulty")){
        url = 'https://opentdb.com/api.php?amount=1';
    } else if (diff == "any_difficulty"){
        url = 'https://opentdb.com/api.php?amount=1&category='+cat;
    } else if (cat == "any_category"){
        url = 'https://opentdb.com/api.php?amount=1&difficulty='+diff;
    } else {
        url = 'https://opentdb.com/api.php?amount=1&category='+cat+'&difficulty='+diff;
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

    //Recuperation de la question 
    document.querySelector('#question_category').textContent = quest.category;
    document.querySelector('#question_difficulty').textContent = quest.difficulty;
    document.querySelector('#question_wording').textContent = quest.question;

    //Recuperation du nombre de gorgées en jeu 
    var diff = document.querySelector('#question_difficulty').textContent;

    if (diff == 'easy'){
        nbDrinksInGame = 1;
    } else if (diff ='medium'){
        nbDrinksInGame = 2;
    } else if (diff = 'hard'){
        nbDrinksInGame = 3;
    }

    //Remplissage de la zone de reponses possibles (ordre aléatoire)
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
    //mise en valeur de la réponse choisie et de la réponse correcte 
    document.querySelector('.correct_answer').classList.toggle('highlight_answer');
    e.currentTarget.classList.toggle('selected_answer');
    
    console.log("nb de gorgées en jeu ", nbDrinksInGame);
    
    //Verification de la reponse 
    if (e.currentTarget.classList.contains('correct_answer')){
        correctAnswer();
    } else {
        incorrectAnswer();
    }

    //affichage de la zone de resultat 
    displayOrHide(result_area);
}

function correctAnswer(){

    displayOrHide(btn_next);
    console.log("Bonne réponse ! ");
    
    const player = current_player;
    console.log("Il reste ",nbDrinksInGame," gorgée(s) à distribuer");
    
    if (slide_nbPlayers.value == 2){
        //affichage de la zone de résultat 
        if (nbDrinksInGame>1){
            result.textContent = 'Bravo, bonne réponse '+players[current_player].textContent+' ! Ton adversaire boit '+nbDrinksInGame+' gorgées !';
        } else {
            result.textContent = 'Bravo, bonne réponse '+players[current_player].textContent+' ! Ton adversaire boit '+nbDrinksInGame+' gorgée !';
        }
        
        if (player == 1){
            drink(2, nbDrinksInGame);
        } else {
            drink(1, nbDrinksInGame);
        }

    }else{
        //affichage de la zone de résultat 
        if (nbDrinksInGame>1){
            result.textContent = 'Bravo, bonne réponse '+players[current_player].textContent+' ! Distribue '+nbDrinksInGame+' gorgées en cliquant sur les noms des joueurs !';
        } else {
            result.textContent = 'Bravo, bonne réponse '+players[current_player].textContent+' ! Distribue '+nbDrinksInGame+' gorgée en cliquant sur les noms des joueurs !';
        }

        //nettoyage la zone de distribution 
        while (liste_drinkers.lastChild){
            liste_drinkers.remove(liste_drinkers.lastChild);
        }

        //remplissage de la zone de distribution des gorgees 
        document.querySelector('#drinks_to_give').textContent = "Il reste "+nbDrinksInGame+" gorgées à distribuer";
    
        for (var i = 1 ; i <= slide_nbPlayers.value ; i++){
            if (!players[i].classList.contains("current_player")){
                console.log(players[i], i);
                var newDrinker = document.createElement('div');
                newDrinker.textContent = players[i].textContent;
                newDrinker.value = i;
                newDrinker.addEventListener('click', drinkClick);
                liste_drinkers.appendChild(newDrinker);
            }
        }
        //affichage de la zone de distribution des gorgees 
        displayOrHide(drink_area);
    }
}

function drinkClick (e){ 
    drinker = e.currentTarget;
    drink(drinker.value, 1);
}

function incorrectAnswer(){
    console.log("Mauvaise réponse ! ");
    if (nbDrinksInGame>1){
        result.textContent = 'Dommage, mauvaise réponse '+players[current_player].textContent+' ! Bois '+nbDrinksInGame+' gorgées !';
    } else {
        result.textContent = 'Dommage, mauvaise réponse '+players[current_player].textContent+' ! Bois '+nbDrinksInGame+' gorgée !';
    }
    drink(current_player, nbDrinksInGame);
}

function drink (player, nbDrink){
    console.log(players[player].textContent, " boit ", nbDrink);
    nbDrinksInGame -= nbDrink;
    document.querySelector('#drinks_to_give').textContent = "Il reste "+nbDrinksInGame+" gorgées à distribuer";
    
    players[player].value += nbDrink;
    majScores();

    if (nbDrinksInGame == 0){
        btn_next.classList.remove("hidden_element");
        drink_area.classList.add("hidden_element");
    }
}

function majScores(){
    for (var i =1; i<=slide_nbPlayers.value; i++){
        scores[i-1].textContent="Score de "+players[i].textContent+" = "+players[i].value;
    }
    testFin();
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

    document.querySelector('#current_player').textContent = "Tour de "+players[current_player].textContent;
    document.querySelector('#current_player').value = current_player;
    
    displayOrHide(play_param);
    displayOrHide(play_area);
    displayOrHide(result_area);
}
btn_next.addEventListener('click',nextClick);

function testFin () {    
    var fin = 0;
    for (var i = 1; i <= slide_nbPlayers.value ; i++){
        if(players[i].value >= drink_limit && fin == 0){
            console.log("fin de la partie");
            fin = 1;
            btn_next.textContent = "Fin de la partie";
            btn_next.removeEventListener('click',nextClick);
            btn_next.addEventListener('click', endGame);
        }
    }   
}

function endGame (){
    //affiche la fin de partie 
    for (var i = 1 ; i <= slide_nbPlayers.value ; i++){
        var recap = document.createElement('p');
        recap.textContent = scores[i-1].textContent;
        recap.value = scores[i-1].value;
        recap_area.appendChild(recap);
    }

    displayOrHide(section_fin);
    displayOrHide(section_jeu);
    
    //affiche les scores 
    //bouton pour relancer une partie avec même joueurs 
    //bouton pour relancer du début 
}


function restartClick(e){
    while (recap_area.lastChild){
        recap_area.removeChild(recap_area.lastChild);
    }
    while (liste_players.lastChild){
        liste_players.removeChild(liste_players.lastChild);
        
    }
    while (scores_area.lastChild){
        scores_area.removeChild(scores_area.lastChild);
    }
    
    nbPlayers.value = 0;
    slide_nbPlayers.value = 0;

    displayOrHide(section_parametres);
    displayOrHide(section_fin);
    displayOrHide(btn_play);
}
btn_restart.addEventListener('click', restartClick);