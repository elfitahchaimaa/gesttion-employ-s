const addbtn=document.querySelector(".ajoutworker");
const modal=document.getElementById("modal");
const closebtn=document.getElementById("btnClose");
const savebtn=document.getElementById("btnSave");
const affichage=document.getElementById("affichage");
const previewImg =document.getElementById("previewImg");
const photoInput =document.getElementById("photo");
let currentCard = null;
let workers=JSON.parse(localStorage.getItem("workers")) || [];

addbtn.addEventListener("click",()=>{
    modal.style.display="block";
    currentCard = null;
    document.getElementById("nom").value = "";
    document.getElementById("role").value = "";
    document.getElementById("photo").value = "";
    document.getElementById("email").value = "";
    document.getElementById("telephone").value = "";
});
closebtn.addEventListener("click",()=>{
    modal.style.display="none";
});
savebtn.addEventListener("click",()=>{
 
  let nom = document.getElementById("nom").value;
  let role = document.getElementById("role").value;
  let photo = document.getElementById("photo").value;
  let email = document.getElementById("email").value;
  let telephone = document.getElementById("telephone").value;
  if (currentCard) {
        // Mettre à jour la card existante
        currentCard.querySelector(".worker-photo").src = photo;
        currentCard.querySelector(".worker-photo").alt = nom;
        currentCard.querySelector(".worker-name").textContent = nom;
        currentCard.querySelector(".worker-role").textContent = role;

        // Mettre à jour les data-attributes du bouton Modifier
        const editBtn = currentCard.querySelector(".edit-btn");
        editBtn.dataset.nom = nom;
        editBtn.dataset.role = role;
        editBtn.dataset.photo = photo;
        editBtn.dataset.email = email;
        editBtn.dataset.telephone = telephone;
        const index=currentCard.dataset.index;
        workers[index]={nom,role,photo,email,telephone};
    } else {
        // Si aucune card n'est sélectionnée, créer une nouvelle card
      workers.push({nom,role,photo,email,telephone});
    }
    localStorage.setItem("workers", JSON.stringify(workers));
    renderworkers();

    modal.style.display = "none";
    currentCard = null;
});
document.querySelector("form").addEventListener("submit", e => e.preventDefault());

affichage.addEventListener("click", function(e) {
    const card = e.target.closest(".worker-card");
    if (!card) return;

    const index = card.dataset.index;
    if (e.target.classList.contains("edit-btn")) {
    const btn = e.target.closest(".edit-btn");
    currentCard = btn.closest(".worker-card");

        document.getElementById("nom").value = btn.dataset.nom;
        document.getElementById("role").value = btn.dataset.role;
        document.getElementById("photo").value = btn.dataset.photo;
        document.getElementById("email").value = btn.dataset.email;
        document.getElementById("telephone").value = btn.dataset.telephone;

        
        modal.style.display = "block";
    }else if (e.target.classList.contains("delete-btn")) {
      
        workers.splice(index, 1); 
        localStorage.setItem("workers", JSON.stringify(workers)); 
        renderworkers(); 
    }
});

function renderworkers() {
    affichage.innerHTML = "";
    workers.forEach((worker, index) => {
        affichage.innerHTML += `
        <div class="worker-card" data-index="${index}">
            <div class="worker-info">
                <img src="${worker.photo}" alt="${worker.nom}" class="worker-photo">
                <h3 class="worker-name">${worker.nom}</h3>
            </div>
            <p class="worker-role">${worker.role}</p>
            <button class="edit-btn"
                    data-nom="${worker.nom}"
                    data-role="${worker.role}"
                    data-photo="${worker.photo}"
                    data-email="${worker.email}"
                    data-telephone="${worker.telephone}">
            <i class="fa-solid fa-pen-to-square"></i>
            </button>
            <button class="delete-btn"><i class="fa-solid fa-ban"></i></button>
        </div>`;
    });
}

document.addEventListener("DOMContentLoaded", () => {
    renderworkers();
});
// aperçu de l'image juste lorsque on entre l'url
photoInput.addEventListener("input",function(){
    const url=photoInput.value.trim();
    if(url){
        previewImg.src=url;
        previewImg.style.display="block";

    }
    else{
        previewImg.style.display="none";
    }
})


