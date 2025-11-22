
let employesGlobal = [];
const detailsModal = document.getElementById('detailsModal');
const detailNom = document.getElementById('detailNom');
const detailPhoto = document.getElementById('detailPhoto');
const detailRole = document.getElementById('detailRole');
const detailEmail = document.getElementById('detailEmail');
const detailTel = document.getElementById('detailTel');
const detailExperiences = document.getElementById('detailExperiences');
const detailsClose = document.getElementById('detailsClose');
const modal = document.getElementById('modal');
const openAddBtn = document.querySelector('.ajoutworker');
const closeAddBtn = document.getElementById('btnClose');
const affichage = document.getElementById('affichage');
const form = document.getElementById('addWorkerForm');
const saveBtn = document.getElementById('btnSave');
const inputNom = document.getElementById('nom');
const inputRole = document.getElementById('role');
const inputPhoto = document.getElementById('photo');
const inputEmail = document.getElementById('email');
const inputTel = document.getElementById('telephone');
const experiencesContainer = document.getElementById('experiencesContainer');
const addExperienceBtn = document.getElementById('addExperienceBtn');

//  data.json
async function ChargerEmp() {
  try {
    const response = await fetch('data.json');
    if (!response.ok) {
      throw new Error('erreur http:' + response.status);
    }
    const data = await response.json();   
    employesGlobal = data.workers;       
    afficherEmployes(employesGlobal);    
  } catch (err) {
    console.error(err);
    affichage.textContent = "impossible d'afficher les employés";
  }
}
ChargerEmp();

// AFFICHER LES EMPLOYÉS DANS LE SIDEBAR 
function afficherEmployes(employes) {
  affichage.innerHTML = '';

  employes.forEach(emp => {
    const card = document.createElement('div');
    card.classList.add('worker-card');

    const img = document.createElement('img');
    img.classList.add('worker-photo');
    img.src = emp.photo || 'default.jpg';
    img.alt = emp.nom;
    card.appendChild(img);

    const nom = document.createElement('h3');
    nom.textContent = emp.nom;
    card.appendChild(nom);

    const role = document.createElement('p');
    role.classList.add('worker-role');
    role.textContent = emp.role;
    card.appendChild(role);

    const email = document.createElement('p');
    email.classList.add('worker-email');
    email.textContent = emp.email;
    card.appendChild(email);

    const tel = document.createElement('p');
    tel.classList.add('worker-phone');
    tel.textContent = emp.telephone;
    card.appendChild(tel);

    const btn = document.createElement('button');
    btn.textContent = 'Assigner';
    btn.classList.add('assign-worker-btn');
    card.appendChild(btn);

    card.addEventListener('click', function () {
      ouvrirDetailsModal(emp);
    });

    affichage.appendChild(card);
  });
}

// modal details
function ouvrirDetailsModal(emp) {
  detailNom.textContent = emp.nom;
  detailPhoto.src = emp.photo;
  detailPhoto.alt = emp.nom;
  detailRole.textContent = emp.role;
  detailEmail.textContent = emp.email;
  detailTel.textContent = emp.telephone;

  detailExperiences.innerHTML = '';
  (emp.experiences || []).forEach(exp => {
    const p = document.createElement('p');
    p.textContent = `${exp.titre} - ${exp.entreprise} (${exp.duree})`;
    detailExperiences.appendChild(p);
  });

  detailsModal.style.display = 'block';
}

detailsClose.addEventListener('click', () => {
  detailsModal.style.display = 'none';
});

detailsModal.addEventListener('click', (e) => {
  if (e.target === detailsModal) {
    detailsModal.style.display = 'none';
  }
});

// MODALE FORMULAIRE (OUVRIR / FERMER)
openAddBtn.addEventListener('click', () => {
  form.reset();
  experiencesContainer.innerHTML = '';
  // nettoyer erreurs
  [inputNom, inputRole, inputEmail, inputTel].forEach(clearError);
  modal.style.display = 'flex';
});

closeAddBtn.addEventListener('click', () => {
  modal.style.display = 'none';
});

modal.addEventListener('click', (e) => {
  if (e.target === modal) {
    modal.style.display = 'none';
  }
});

//  REGEX 
const nameRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ\s'-]{2,}$/;
const phoneRegex = /^0\d(\s?\d{2}){4}$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const dateRegex = /^([1-9]\d{3})-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;

function isNameValid(v) { return nameRegex.test(v.trim()); }
function isPhoneValid(v) { return phoneRegex.test(v.trim()); }
function isEmailValid(v) { return emailRegex.test(v.trim()); }
function isDateValid(v) { return dateRegex.test(v.trim()); }

function getTodayISO() {
  const today = new Date();
  const y = today.getFullYear();
  const m = String(today.getMonth() + 1).padStart(2, '0');
  const d = String(today.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function isPastOrToday(dateStr) {
  if (!isDateValid(dateStr)) return false;
  return dateStr <= getTodayISO();
}

// fonction erreurs
function afficherErreur(input, message) {
  let old = input.parentElement.querySelector('.error-message');
  if (old) old.remove();

  const error = document.createElement('p');
  error.className = 'error-message';
  error.style.color = 'red';
  error.style.fontSize = '0.8rem';
  error.textContent = message;
  input.parentElement.appendChild(error);
  input.classList.add('invalid');
}

function clearError(input) {
  let old = input.parentElement.querySelector('.error-message');
  if (old) old.remove();
  input.classList.remove('invalid');
}

// validation 
inputNom.addEventListener('input', () => {
  if (!isNameValid(inputNom.value)) {
    afficherErreur(inputNom, 'Nom invalide (min 2 lettres).');
  } else {
    clearError(inputNom);
  }
});

inputRole.addEventListener('input', () => {
  if (!isNameValid(inputRole.value)) {
    afficherErreur(inputRole, 'Rôle invalide (min 2 lettres).');
  } else {
    clearError(inputRole);
  }
});

inputEmail.addEventListener('input', () => {
  if (!isEmailValid(inputEmail.value)) {
    afficherErreur(inputEmail, 'Email invalide.');
  } else {
    clearError(inputEmail);
  }
});

inputTel.addEventListener('input', () => {
  if (!isPhoneValid(inputTel.value)) {
    afficherErreur(inputTel, 'Téléphone invalide (ex: 06 12 34 56 78).');
  } else {
    clearError(inputTel);
  }
});

// experience dynamique
function attachRealtimeValidationToExp(item) {
  const companyInput = item.querySelector('.exp-company');
  const roleInput = item.querySelector('.exp-role');
  const fromInput = item.querySelector('.exp-from');
  const toInput = item.querySelector('.exp-to');

  const todayISO = getTodayISO();
  fromInput.max = todayISO;
  toInput.max = todayISO;

  companyInput.addEventListener('input', () => {
    if (!isNameValid(companyInput.value)) {
      afficherErreur(companyInput, 'Company invalide (min 2 caractères).');
    } else {
      clearError(companyInput);
    }
  });

  roleInput.addEventListener('input', () => {
    if (!isNameValid(roleInput.value)) {
      afficherErreur(roleInput, 'Role invalide (min 2 caractères).');
    } else {
      clearError(roleInput);
    }
  });

  function validateDatesExp() {
    const fromVal = fromInput.value.trim();
    const toVal = toInput.value.trim();

    clearError(fromInput);
    clearError(toInput);

    if (fromVal && (!isDateValid(fromVal) || !isPastOrToday(fromVal))) {
      afficherErreur(fromInput, 'From doit être une date ≤ aujourd’hui.');
    }
    if (toVal && (!isDateValid(toVal) || !isPastOrToday(toVal))) {
      afficherErreur(toInput, 'To doit être une date ≤ aujourd’hui.');
    }
    if (isDateValid(fromVal) && isDateValid(toVal) && fromVal > toVal) {
      afficherErreur(toInput, 'To doit être ≥ From.');
    }
  }

  fromInput.addEventListener('input', validateDatesExp);
  toInput.addEventListener('input', validateDatesExp);
}

addExperienceBtn.addEventListener('click', () => {
  const item = document.createElement('div');
  item.className = 'experience-item';

  item.innerHTML = `
    <div class="experience-row">
      <div class="field">
        <label>Company</label>
        <input type="text" class="exp-company" placeholder="Entreprise" />
      </div>
      <div class="field">
        <label>Role</label>
        <input type="text" class="exp-role" placeholder="Rôle" />
      </div>
    </div>
    <div class="experience-row">
      <div class="field">
        <label>From</label>
        <input type="date" class="exp-from" />
      </div>
      <div class="field">
        <label>To</label>
        <input type="date" class="exp-to" />
      </div>
    </div>
    <button type="button" class="remove-exp-btn">Supprimer</button>
  `;

  item.querySelector('.remove-exp-btn').addEventListener('click', () => {
    item.remove();
  });

  attachRealtimeValidationToExp(item);

  experiencesContainer.appendChild(item);
});

//  ENREGISTRER //STOCKER // AFFICHER CARD 
saveBtn.addEventListener('click', (e) => {
  e.preventDefault();

  let isValid = true;

  [inputNom, inputRole, inputEmail, inputTel].forEach(clearError);

  if (!isNameValid(inputNom.value)) {
    afficherErreur(inputNom, 'Nom invalide (min 2 lettres).');
    isValid = false;
  }
  if (!isNameValid(inputRole.value)) {
    afficherErreur(inputRole, 'Rôle invalide (min 2 lettres).');
    isValid = false;
  }
  if (!isEmailValid(inputEmail.value)) {
    afficherErreur(inputEmail, 'Email invalide.');
    isValid = false;
  }
  if (!isPhoneValid(inputTel.value)) {
    afficherErreur(inputTel, 'Téléphone invalide (ex: 06 12 34 56 78).');
    isValid = false;
  }

  const expItems = Array.from(document.querySelectorAll('.experience-item'));
  const experiences = [];

  expItems.forEach(item => {
    const companyInput = item.querySelector('.exp-company');
    const roleInput = item.querySelector('.exp-role');
    const fromInput = item.querySelector('.exp-from');
    const toInput = item.querySelector('.exp-to');

    [companyInput, roleInput, fromInput, toInput].forEach(clearError);

    if (!isNameValid(companyInput.value)) {
      afficherErreur(companyInput, 'Company invalide (min 2 caractères).');
      isValid = false;
    }
    if (!isNameValid(roleInput.value)) {
      afficherErreur(roleInput, 'Role invalide (min 2 caractères).');
      isValid = false;
    }

    const fromVal = fromInput.value.trim();
    const toVal = toInput.value.trim();

    if (!isDateValid(fromVal) || !isPastOrToday(fromVal)) {
      afficherErreur(fromInput, 'From doit être une date ≤ aujourd’hui.');
      isValid = false;
    }
    if (!isDateValid(toVal) || !isPastOrToday(toVal)) {
      afficherErreur(toInput, 'To doit être une date ≤ aujourd’hui.');
      isValid = false;
    }
    if (isDateValid(fromVal) && isDateValid(toVal) && fromVal > toVal) {
      afficherErreur(toInput, 'To doit être ≥ From.');
      isValid = false;
    }

    if (
      isNameValid(companyInput.value) &&
      isNameValid(roleInput.value) &&
      isDateValid(fromVal) &&
      isDateValid(toVal) &&
      isPastOrToday(fromVal) &&
      isPastOrToday(toVal) &&
      fromVal <= toVal
    ) {
      experiences.push({
        titre: roleInput.value.trim(),
        entreprise: companyInput.value.trim(),
        duree: `${fromVal} → ${toVal}`
      });
    }
  });

  if (!isValid) return;

  const newEmp = {
    nom: inputNom.value.trim(),
    role: inputRole.value.trim(),
    photo: inputPhoto.value.trim() || 'default.jpg',
    email: inputEmail.value.trim(),
    telephone: inputTel.value.trim(),
    experiences: experiences
  };

  employesGlobal.push(newEmp);
  afficherEmployes(employesGlobal);

  form.reset();
  experiencesContainer.innerHTML = '';
  modal.style.display = 'none';
});



//previsualisation de phot
inputPhoto.addEventListener('input', () => {
    const preview = document.getElementById('previewImg');
    if (inputPhoto.value.trim()) {
        preview.src = inputPhoto.value.trim();
        preview.style.display = 'block';
    } else {
        preview.style.display = 'none';
    }
});



//une fonction qui verifie si un employe peut etre affecté a une zone
// function peutAffecter(emp, zone) {
//     const role = emp.role.toLowerCase();
//     switch (zone) {
//         case 'reception':
//             return role === 'réceptionniste';
//         case 'Salle-des-serveurs':
//             return role === 'technicien it';
//         case 'Salle-de-sécurité':
//             return role === 'agent de sécurité';
//         case 'Salle-du-personnel':
//         case 'conference':
//         case 'div3':
//             return true; // tous les roles peuvent etre affectes ici
//         case 'Salle-darchives':
//             return role !== 'nettoyage'; // nettoyage interdit
//         default:
//             return true;
//     }
// }
// document.addEventListener('click', (e) => {
//     if (e.target.classList.contains('unassign-btn')) {
//         const workerCard = e.target.closest('.worker-card-zone');
//         const zone = workerCard.parentElement;
//         const worker = {
//             nom: workerCard.querySelector('p').textContent,
//             // Ajoutez les autres données nécessaires ici
//         };
//         // Retirer de la zone
//         zone.removeChild(workerCard);
//         // Ajouter à la liste "Unassigned"
//         afficherEmployes([worker]);
//     }
// });



// LISTE DES ZONES AVEC RESTRICTIONS
const zoneRestrictions = {
  "reception": emp => emp.role.toLowerCase() === "réceptionniste" || emp.role.toLowerCase() === "manager",
  "Salle-des-serveurs": emp => emp.role.toLowerCase() === "technicien it" || emp.role.toLowerCase() === "manager",
  "Salle-de-sécurité": emp => emp.role.toLowerCase() === "agent de sécurité" || emp.role.toLowerCase() === "manager",
  "Salle-du-personnel": emp => emp.role.toLowerCase() === "manager" || emp.role.toLowerCase() === "nettoyage" || emp.role.toLowerCase() === "autres",
  "Salle-darchives": emp => emp.role.toLowerCase() !== "nettoyage",
  "conference": emp => true // tout le monde
};

// gestion du bouton "Assigner" sur les zones
document.querySelectorAll('.assign-btn').forEach(btn => {
  btn.addEventListener('click', function () {
    const zoneDiv = btn.closest('.zone');
    const zoneName = zoneDiv.classList[0];

    // filtrer selon restrictions
    const eligibles = employesGlobal.filter(emp => zoneRestrictions[zoneName] ? zoneRestrictions[zoneName](emp) : true);

    // afficher la liste dans la modale
    const assignModal = document.getElementById('assignModal');
    const assignList = document.getElementById('assignModalList');
    assignList.innerHTML = '';

    eligibles.forEach(emp => {
      const empDiv = document.createElement('div');
      empDiv.className = 'assign-item';
      empDiv.textContent = emp.nom + " (" + emp.role + ")";
      empDiv.addEventListener('click', function () {
        // retirer emp de employesGlobal
        employesGlobal = employesGlobal.filter(e => e.email !== emp.email);
        afficherEmployes(employesGlobal); // Mettre à jour la sidebar "Unassigned"

        // ajouter visuellement la zone
        const card = document.createElement('div');
        card.className = 'worker-card-zone';
        card.innerHTML = `<p>${emp.nom}</p><small>${emp.role}</small>
        <button class="unassign-btn">X</button>`;
        card.querySelector('.unassign-btn').onclick = function () {
          card.remove();
          employesGlobal.push(emp);
          afficherEmployes(employesGlobal);
        };
        zoneDiv.appendChild(card);

        assignModal.style.display = 'none';
      });
      assignList.appendChild(empDiv);
    });

    assignModal.style.display = 'flex';
  });
});

// bouton fermeture du modal d’assignation
document.getElementById('assignModalClose').onclick = function() {
  document.getElementById('assignModal').style.display = 'none';
};
