/* rappel : #id et .class */

const section_accueil = document.querySelector('#accueil');
const section_parametres = document.querySelector('#parametre_partie');
const section_jeu = document.querySelector('#jeu');
const participants = document.querySelector('#players');
const liste_participants = document.querySelector('.list_players');
const btn_add_player = document.querySelector('#add_pseudo');
const btn_start = document.querySelector('#start_game');
const btn_play = document.querySelector('#play_game');
const nbPlayers = document.querySelector('#nbPlayersValueId');
const slide_nbPlayers = document.querySelector('#nbPlayersId');

function displayOrHide (element){
    element.classList.toggle("hidden_element");
};

function startClick(e){
    console.log("Lancement du Jeu !");
    displayOrHide(section_accueil);
    displayOrHide(section_parametres)
}

btn_start.addEventListener('click',startClick);

const addPlayer = () => {
    var pseudo = document.querySelector('#pseudo').value;
    var player = document.createElement('li');
    player.textContent=pseudo;
    player.value=pseudo;
    liste_participants.appendChild(player);
    slide_nbPlayers.value++;
    nbPlayers.value = slide_nbPlayers.value;
    console.log("Ajout de ", pseudo);

    if (slide_nbPlayers.value==2){
        displayOrHide(btn_play);
    }
    if (slide_nbPlayers.value==10){
        displayOrHide(document.querySelector('.management-form'));
    }
}

btn_add_player.addEventListener('click', addPlayer);

function playClick(e){
    console.log("Lancement du Jeu !");
    displayOrHide(section_parametres);
    displayOrHide(section_jeu)
}

btn_play.addEventListener('click',playClick);


