/* rappel : #id et .class */

const section_accueil = document.querySelector('#accueil');
const section_parametres = document.querySelector('#parametre_partie');
const section_jeu = document.querySelector('#jeu');
const participants = document.querySelector('#players');
const liste_participants = document.querySelector('.list_players');
const btn_add_player = document.querySelector('#add_pseudo');
const btn_start = document.querySelector('#start_game');
const btn_play = document.querySelector('#play_game');
const btn_question = document.querySelector('#start_question');
const nbPlayers = document.querySelector('#nbPlayersValueId');
const slide_nbPlayers = document.querySelector('#nbPlayersId');
const categories = document.querySelector('#categories');
const questions = document.querySelector('#question_area');
const answers = document.querySelector('#answer_area');

//const url_API = 'https://opentdb.com/api.php?amount=10&token=Triviapero';

function displayOrHide (element){
    element.classList.toggle("hidden_element");
};

function startClick(e){
    console.log("Lancement du Jeu !");
    displayOrHide(section_accueil);
    displayOrHide(section_parametres);
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
    displayOrHide(section_jeu);
}

btn_play.addEventListener('click',playClick);


async function getCategories(){
    const response = await fetch ('https://opentdb.com/api_category.php');
    const body = await response.json();

    try {
        //console.log(body.trivia_categories);
        console.log(body);
        for (i=0; i<body.trivia_categories.length; i++){
            //console.log(body.trivia_categories[i].id);
            //console.log(body.trivia_categories[i].name);
            
            var newElement = document.createElement('button');
            newElement.type = "button";
            //newElement.id=body.trivia_categories[i].id;
            //newElement.name=body.trivia_categories[i].name;
            newElement.textContent=body.trivia_categories[i].name;
            newElement.classList.add("category");
            newElement.addEventListener('click',categoriesClick,false);
            categories.appendChild(newElement);
        }
    }
    catch {
        console.log("erreur");
    }
}
btn_play.addEventListener('click', getCategories);

function categoriesClick (e){
    console.log(e.currentTarget.name);
}

async function getQuestion(){
    //var category =  ;
    var difficulty = document.querySelector('#select_difficulty').value;
    const response = await fetch('https://opentdb.com/api.php?amount=1&category=9&difficulty='+difficulty);
    const body = await response.json();

    try {
        console.log(body);
        createQuestion(body.results[0]);
    }
    catch {
        console.log("erreur");
    }
}

function createQuestion ( quest ) {
    console.log(quest.category);
    var newQuestion = document.createElement('div');
    newQuestion.classList.add("question");
    newQuestion.classList.add(quest.type);
    var newQuestCat = document.createElement('p');
    newQuestCat.textContent = quest.category;
    var newQuestDiff = document.createElement('p');
    newQuestDiff.textContent = quest.difficulty;
    var newQuest = document.createElement('p');
    newQuest.textContent = quest.question;
    newQuestion.appendChild(newQuestCat);
    newQuestion.appendChild(newQuestDiff);
    newQuestion.appendChild(newQuest);
    questions.appendChild(newQuestion);

    var newAnswer = document.createElement('div');
    newAnswer.classList.add("answer");
    if (quest.type == "multiple" || quest.type == "boolean"){
        for (var i = 0; i < quest.incorrect_answers.length; i++){
            var newProposition = document.createElement('p');
            newProposition.classList.add("incorrect_answer");
            newProposition.textContent = quest.incorrect_answers[i];
            newAnswer.appendChild(newProposition);
        }
        //insérer la bonne réponse à une position aléatoire de newAnswer
        var newProposition = document.createElement('p');
        newProposition.classList.add("correct_answer");
        newProposition.textContent = quest.correct_answer;
        newAnswer.appendChild(newProposition);
    }
    answers.appendChild(newAnswer);
}

btn_question.addEventListener('click', getQuestion);
