const BASE_URL = "http://localhost:3000"
const TRAINERS_URL = `${BASE_URL}/trainers`
const POKEMONS_URL = `${BASE_URL}/pokemons`
const mainTag= document.querySelector('main')


document.addEventListener('DOMContentLoaded',init)



function init(){
  fetchTrainersWPokemon()
  mainEventListener()
}


function fetchTrainersWPokemon(){
  mainTag.innerHTML=""
  console.log("in fetchTrainersWPokemon");
  fetch(TRAINERS_URL)
    .then(res=>res.json())
    .then(json=>
      json.forEach(function(trainer){
        renderTrainerCard(trainer)
      })
    )
}

function renderTrainerCard(trainer){

  mainTag.innerHTML+=`<div class="card" data-id="${trainer.id}"><p>${trainer.name}</p>
  <button data-trainer-id="${trainer.id}">Add Pokemon</button>
  <ul>${renderPokemon(trainer)}</ul>
</div>`
}

function renderPokemon(trainer){

  let liPoke=""
  trainer.pokemons.forEach(function(pokemon){
    liPoke+=`<li>${pokemon.nickname} (${pokemon.species}) <button class="release" data-pokemon-id="${pokemon.id}">Release</button></li>`
  })
  return liPoke
}

function mainEventListener(){
  mainTag.addEventListener('click',function(event){
    event.preventDefault()
    if (event.target.className==="release"){

      let pokeId=event.target.dataset.pokemonId
      let trainerId=event.target.parentElement.parentElement.previousElementSibling.dataset.trainerId
       releasePokemon(pokeId,trainerId)
    }
    else if (event.target.innerText==="Add Pokemon"){
      //if children of ul !=6 addpokemon
      if(event.target.nextElementSibling.children.length!=6)
      addPokemon(event.target.dataset.trainerId)
    }
  })
}


function addPokemon(trainerId){
  data={
    trainer_id:trainerId
  }
  console.log("in addPokemon");
  fetch(POKEMONS_URL,{
    method:"POST",
    headers:{
      'Content-Type':'application/json'
    },
    body:
      JSON.stringify(data)

  }).then(res=>res.json())
    .then(fetchTrainersWPokemon())
}

function releasePokemon(pokeId,trainerId){
  console.log("in releasePokemon");
  fetch(`${POKEMONS_URL}/${pokeId}`,{
    method: "DELETE",

  }).then(res=>res.json())
    .then(fetchTrainersWPokemon())
}
