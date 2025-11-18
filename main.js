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
