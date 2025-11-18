const accessrules={
    "reception":["Réceptioniste","Manager"],
    "salle-de-serveurs":["Technicien-IT","Manager"],
    "Salle-de-sécurité": ["Agent de sécurité", "Manager"],
    "Salle-darchives": ["Manager"],
    //ce sont les zones libres
    "Salle-du-personnel": "all",
    "conference": "all",
    "div3": "all"
}
function hasAccess(Role,zone){
    const rule=accessrules[zone];
    if(rule==="all"){
        return true;
    }
    return rule.includes(Role);
}
//cliquer sur le bouton + et avtiver la
document.querySelectorAll(".assign-btn").forEach(btn=>{
    btn.addEventListener("click",function(){
        const zone=this.ParentElement.classList[1];//recupere le div de la zone selectionnéé
        showAssignableWorkers(zone);
    });
});
//fermeture de model d assignement
document.getElementById("assignModalClose").addEventListener("click", () => {
    document.getElementById("assignModal").style.display = "none";
});
//fonction d affichage des employes assignables
function showAssignableWorkers(zone) {
    const list = document.getElementById("assignModalList");
    list.innerHTML = "";

    workers.forEach((w, index) => {
        if (canEnter(w.role, zone)) {
            list.innerHTML += `
                <div class="assign-item" data-index="${index}">
                    <img src="${w.photo}" style="width:40px;height:40px;border-radius:50%">
                    <span>${w.nom} (${w.role})</span>
                </div>
            `;
        }
    });

    document.getElementById("assignModal").dataset.zone = zone;
    document.getElementById("assignModal").style.display = "block";
}
