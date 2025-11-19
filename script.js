// Variables globales
const addbtn = document.querySelector(".ajoutworker");
const modal = document.getElementById("modal");
const closebtn = document.getElementById("btnClose");
const savebtn = document.getElementById("btnSave");
const affichage = document.getElementById("affichage");
const previewImg = document.getElementById("previewImg");
const photoInput = document.getElementById("photo");

let currentCard = null;
let workers = [];
let assignments = {};
let dataLoaded = false;

// CHARGER LES DONNÉES DEPUIS LE FICHIER JSON 
async function loadDataFromJSON() {
    try {
        const response = await fetch('data.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);//le statut fu requete doit etre entre 200 et 299
        }
        const data = await response.json();//continue seulement quand cette opération est terminé
        workers = data.workers || [];
        assignments = data.assignments || {
            "conference": [],
            "reception": [],
            "Salle-des-serveurs": [],
            "Salle-de-sécurité": [],
            "Salle-du-personnel": [],
            "Salle-darchives": [],
            "div3": []
        };
        dataLoaded = true;
        console.log("Données chargées depuis data.json");
    } catch (error) {
        console.error('Erreur lors du chargement de data.json:', error);
        // Fallback si le fichier JSON n'existe pas
        workers = [];
        assignments = {
            "conference": [],
            "reception": [],
            "Salle-des-serveurs": [],
            "Salle-de-sécurité": [],
            "Salle-du-personnel": [],
            "Salle-darchives": [],
            "div3": []
        };
    }
}

// SAUVEGARDER LES DONNÉES DANS LE FICHIER JSON 
async function saveDataToJSON() {
    const data = {
        workers: workers,
        assignments: assignments
    };

    try {
        // Envoyer au serveur pour sauvegarder
        const response = await fetch('save-data.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        console.log('Données sauvegardées:', result.message);
    } catch (error) {
        console.error('Erreur lors de la sauvegarde:', error);
        alert('Erreur lors de la sauvegarde des données. Vérifiez la console.');
    }
}

// MODAL D'AJOUT/ÉDITION D'EMPLOYÉ 
addbtn.addEventListener("click", () => {
    modal.style.display = "block";
    currentCard = null;
    document.getElementById("nom").value = "";
    document.getElementById("role").value = "";
    document.getElementById("photo").value = "";
    document.getElementById("email").value = "";
    document.getElementById("telephone").value = "";
    document.getElementById("experiencesContainer").innerHTML = "";
    previewImg.style.display = "none";
});

closebtn.addEventListener("click", () => {
    modal.style.display = "none";
});

savebtn.addEventListener("click", () => {
    let nom = document.getElementById("nom").value.trim();
    let role = document.getElementById("role").value.trim();
    let photo = document.getElementById("photo").value.trim();
    let email = document.getElementById("email").value.trim();
    let telephone = document.getElementById("telephone").value.trim();

    // Validation
    if (!nom || !role || !email || !telephone) {
        alert("Veuillez remplir tous les champs obligatoires!");
        return;
    }

    // Récupérer les expériences
    const experienceInputs = document.querySelectorAll(".experience-item");
    const experiences = [];
    experienceInputs.forEach(item => {
        const inputs = item.querySelectorAll("input");
        if (inputs[0].value.trim() || inputs[1].value.trim() || inputs[2].value.trim()) {
            experiences.push({
                titre: inputs[0].value.trim(),
                entreprise: inputs[1].value.trim(),
                duree: inputs[2].value.trim()
            });
        }
    });

    if (currentCard) {
        // Mettre à jour la card existante
        const index = currentCard.dataset.index;
        workers[index] = { nom, role, photo, email, telephone, experiences };
    } else {
        // Si aucune card n'est sélectionnée, créer une nouvelle card
        workers.push({ nom, role, photo, email, telephone, experiences });
    }

    saveDataToJSON();
    renderworkers();

    modal.style.display = "none";
    currentCard = null;
});

document.querySelector("form").addEventListener("submit", e => e.preventDefault());

// AFFICHAGE DES EMPLOYÉS 
affichage.addEventListener("click", function (e) {
    const card = e.target.closest(".worker-card");
    if (!card) return;

    const index = card.dataset.index;
    if (e.target.closest(".edit-btn")) {
        const btn = e.target.closest(".edit-btn");
        currentCard = btn.closest(".worker-card");
        const workerIndex = currentCard.dataset.index;
        const worker = workers[workerIndex];

        document.getElementById("nom").value = btn.dataset.nom;
        document.getElementById("role").value = btn.dataset.role;
        document.getElementById("photo").value = btn.dataset.photo;
        document.getElementById("email").value = btn.dataset.email;
        document.getElementById("telephone").value = btn.dataset.telephone;

        // Afficher les expériences
        displayWorkerExperiences(worker);

        if (btn.dataset.photo) {
            previewImg.src = btn.dataset.photo;
            previewImg.style.display = "block";
        }

        modal.style.display = "block";
    } else if (e.target.closest(".delete-btn")) {
        if (confirm("Êtes-vous sûr de vouloir supprimer cet employé?")) {
            workers.splice(index, 1);
            saveDataToJSON();
            renderworkers();
        }
    }
});

function renderworkers() {
    affichage.innerHTML = "";
    workers.forEach((worker, index) => {
        const photoSrc = worker.photo || "https://via.placeholder.com/80?text=No+Photo";
        affichage.innerHTML += `
        <div class="worker-card" data-index="${index}">
            <div class="worker-info">
                <img src="${photoSrc}" alt="${worker.nom}" class="worker-photo" onerror="this.src='https://via.placeholder.com/80?text=No+Photo'">
                <h3 class="worker-name">${worker.nom}</h3>
            </div>
            <p class="worker-role">${worker.role}</p>
            <button class="edit-btn"
                    data-nom="${worker.nom}"
                    data-role="${worker.role}"
                    data-photo="${worker.photo || ''}"
                    data-email="${worker.email}"
                    data-telephone="${worker.telephone}">
            <i class="fa-solid fa-pen-to-square"></i>
            </button>
            <button class="delete-btn"><i class="fa-solid fa-ban"></i></button>
        </div>`;
    });
}

// GESTION DES EXPÉRIENCES 
document.addEventListener("DOMContentLoaded", async () => {
    await loadDataFromJSON();
    renderworkers();
    renderAssignments();
    setupExperienceManager();
});

function setupExperienceManager() {
    const addExperienceBtn = document.getElementById("addExperienceBtn");
    if (addExperienceBtn) {
        addExperienceBtn.addEventListener("click", addExperienceField);
    }
}

function addExperienceField() {
    const container = document.getElementById("experiencesContainer");
    const experienceItem = document.createElement("div");
    experienceItem.className = "experience-item";
    experienceItem.innerHTML = `
        <input type="text" placeholder="Titre du poste" class="experience-titre">
        <input type="text" placeholder="Entreprise" class="experience-entreprise">
        <input type="text" placeholder="Durée (ex: 3 ans)" class="experience-duree">
        <button type="button" class="remove-exp-btn">
            <i class="fa-solid fa-trash"></i>
        </button>
    `;
    
    experienceItem.querySelector(".remove-exp-btn").addEventListener("click", function() {
        experienceItem.remove();
    });

    container.appendChild(experienceItem);
}

function displayWorkerExperiences(worker) {
    const container = document.getElementById("experiencesContainer");
    container.innerHTML = "";
    
    if (worker.experiences && worker.experiences.length > 0) {
        worker.experiences.forEach(exp => {
            const experienceItem = document.createElement("div");
            experienceItem.className = "experience-item";
            experienceItem.innerHTML = `
                <input type="text" placeholder="Titre du poste" class="experience-titre" value="${exp.titre || ''}">
                <input type="text" placeholder="Entreprise" class="experience-entreprise" value="${exp.entreprise || ''}">
                <input type="text" placeholder="Durée" class="experience-duree" value="${exp.duree || ''}">
                <button type="button" class="remove-exp-btn">
                    <i class="fa-solid fa-trash"></i>
                </button>
            `;
            
            experienceItem.querySelector(".remove-exp-btn").addEventListener("click", function() {
                experienceItem.remove();
            });

            container.appendChild(experienceItem);
        });
    }
}

// Aperçu de l'image juste lorsque on entre l'url
photoInput.addEventListener("input", function () {
    const url = photoInput.value.trim();
    if (url) {
        previewImg.src = url;
        previewImg.style.display = "block";
    } else {
        previewImg.style.display = "none";
    }
});

//  GESTION DES ACCÈS PAR ZONE 
const accessrules = {
    "reception": ["Réceptioniste", "Manager"],
    "Salle-des-serveurs": ["Technicien-IT", "Manager"],
    "Salle-de-sécurité": ["Agent de sécurité", "Manager"],
    "Salle-darchives": ["Manager"],
    // Les salles libres
    "Salle-du-personnel": "all",
    "conference": "all",
    "div3": "all"
};

function hasAccess(Role, zone) {
    const rule = accessrules[zone];
    if (rule === "all") {
        return true;
    }
    return rule.includes(Role);
}

// ========== SYSTÈME D'ASSIGNEMENT ==========
// Cliquer sur le bouton + pour activer le modal d'assignement
document.querySelectorAll(".assign-btn").forEach(btn => {
    btn.addEventListener("click", function () {
        const zone = this.parentElement.classList[0];
        showAssignableWorkers(zone);
    });
});

// Fermeture du modal d'assignement
document.getElementById("assignModalClose").addEventListener("click", () => {
    document.getElementById("assignModal").style.display = "none";
});

// Fonction d'affichage des employés assignables
function showAssignableWorkers(zone) {
    const list = document.getElementById("assignModalList");
    list.innerHTML = "";

    workers.forEach((w, index) => {
        if (hasAccess(w.role, zone)) {
            const photoSrc = w.photo || "https://via.placeholder.com/40?text=No";
            list.innerHTML += `
                <div class="assign-item" data-index="${index}">
                    <img src="${photoSrc}" alt="${w.nom}" onerror="this.src='https://via.placeholder.com/40?text=No'">
                    <span>${w.nom} (${w.role})</span>
                </div>
            `;
        }
    });

    if (list.innerHTML === "") {
        list.innerHTML = "<p style='text-align:center; padding:20px;'>Aucun employé n'a accès à cette zone.</p>";
    }

    document.getElementById("assignModal").dataset.zone = zone;
    document.getElementById("assignModal").style.display = "block";
}

// Gestion de l'assignement
document.getElementById("assignModalList").addEventListener("click", function (e) {
    const item = e.target.closest(".assign-item");
    if (!item) return;

    const index = item.dataset.index;
    const zone = document.getElementById("assignModal").dataset.zone;

    assignWorkerToZone(index, zone);
});

// Assigner l'employé à la zone avec persistance
function assignWorkerToZone(index, zone) {
    const worker = workers[index];

    // Ajouter aux assignements
    assignments[zone].push(worker);

    // Sauvegarder les données
    saveDataToJSON();

    // Enlever de la liste des disponibles
    workers.splice(index, 1);
    saveDataToJSON();

    // Mettre à jour l'affichage
    renderworkers();
    renderAssignments();

    document.getElementById("assignModal").style.display = "none";
}

// Fonction pour réafficher les assignements
function renderAssignments() {
    // Nettoyer les zones (garder les boutons)
    document.querySelectorAll(".zone").forEach(zone => {
        const workerCards = zone.querySelectorAll(".worker-card-zone");
        workerCards.forEach(w => w.remove());
    });

    // Réafficher les assignements
    Object.keys(assignments).forEach(zone => {
        const container = document.querySelector(`.${zone}`);
        if (!container) return;

        assignments[zone].forEach((worker, workerIndex) => {
            const photoSrc = worker.photo || "https://via.placeholder.com/40?text=No";
            container.innerHTML += `
                <div class="worker-card-zone">
                    <img src="${photoSrc}" alt="${worker.nom}" onerror="this.src='https://via.placeholder.com/40?text=No'">
                    <p>${worker.nom}</p>
                    <small>${worker.role}</small>
                    <button class="unassign-btn" data-zone="${zone}" data-worker-index="${workerIndex}">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </div>
            `;
        });
    });

    // Réattacher les event listeners pour les boutons assign
    document.querySelectorAll(".assign-btn").forEach(btn => {
        btn.addEventListener("click", function () {
            const zone = this.parentElement.classList[0];
            showAssignableWorkers(zone);
        });
    });

    // Gestion de la désassignation
    document.querySelectorAll(".unassign-btn").forEach(btn => {
        btn.addEventListener("click", function () {
            const zone = this.dataset.zone;
            const workerIndex = parseInt(this.dataset.workerIndex);

            // Récupérer le worker avant suppression
            const worker = assignments[zone][workerIndex];

            // Supprimer de la zone
            assignments[zone].splice(workerIndex, 1);

            // Remettre en liste disponible
            workers.push(worker);

            // Sauvegarder
            saveDataToJSON();

            // Rafraîchir l'affichage
            renderworkers();
            renderAssignments();
        });
    });
}