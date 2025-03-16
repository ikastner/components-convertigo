document.addEventListener("DOMContentLoaded", function () {
    const events = [
        { title: "Projet", start: "2024-01-01", end: "2024-07-22", color: "#3498db" },
        { title: "Développement", start: "2024-03-07", end: "2024-03-14", color: "#2ecc71" },
        { title: "Recette", start: "2024-03-15", end: null, color: "#f1c40f" }, // Pas de date de fin (en cours)
    ];

    const timeline = document.getElementById("timeline");
    const scale = document.getElementById("timeline-scale");
    const tooltip = document.getElementById("tooltip");

    // Trouver les dates minimales et maximales dans les événements
    let startDate = new Date(Math.min(...events.map(event => new Date(event.start))));
    let endDate = new Date(Math.max(...events.map(event => event.end ? new Date(event.end) : new Date())));

    // Fonction pour ajuster la date au premier jour du mois
    function getFirstDayOfMonth(date) {
        return new Date(date.getFullYear(), date.getMonth(), 1);
    }

    // Ajuster startDate et endDate au premier jour du mois et dernier jour du mois respectivement
    startDate = getFirstDayOfMonth(startDate);
    endDate = new Date(endDate.getFullYear(), endDate.getMonth() + 1, 0); // Dernier jour du mois de la date de fin

    // Générer l'échelle de temps par mois et année
    const totalMonths = (endDate.getFullYear() - startDate.getFullYear()) * 12 + (endDate.getMonth() - startDate.getMonth()) + 1; // Total des mois entre startDate et endDate
    for (let i = 0; i < totalMonths; i++) {
        const dateSpan = document.createElement("span");
        const currentDate = new Date(startDate);
        currentDate.setMonth(startDate.getMonth() + i); // Déplace d'un mois à la fois
        dateSpan.textContent = `${currentDate.toLocaleString('fr-FR', { month: 'short', year: 'numeric' })}`;
        scale.appendChild(dateSpan);
    }

    // Gestion de l'affichage des événements
    let lastYPosition = 0; // Position verticale initiale
    const lineHeight = 60; // Hauteur d'un "bloc" d'événement (pour la ligne suivante)

    // Ajouter chaque événement à la timeline
    events.forEach(event => {
        const item = document.createElement("div");
        item.classList.add("timeline-item");
        item.textContent = event.title;
        item.style.background = event.color;

        const start = new Date(event.start);
        const end = event.end ? new Date(event.end) : new Date(); // Si end est null, prendre aujourd'hui

        // Calculer la position et la largeur des événements en fonction des mois
        const startMonthOffset = (start.getFullYear() - startDate.getFullYear()) * 12 + (start.getMonth() - startDate.getMonth()); // Décalage en mois
        const endMonthOffset = (end.getFullYear() - startDate.getFullYear()) * 12 + (end.getMonth() - startDate.getMonth()); // Décalage en mois

        // Calculer la largeur du bloc événement en fonction du mois
        const width = (endMonthOffset - startMonthOffset + 1) * (100 / totalMonths); // Convertir en pourcentage

        item.style.left = (startMonthOffset / totalMonths) * 100 + "%"; // Position en pourcentage
        item.style.width = width + "%";

        // Vérifier si l'événement chevauche un autre événement (déplacer à la ligne suivante)
        const existingItems = document.querySelectorAll('.timeline-item');
        let overlap = false;

        existingItems.forEach(existingItem => {
            const existingLeft = parseFloat(existingItem.style.left);
            const existingWidth = parseFloat(existingItem.style.width);
            const itemLeft = parseFloat(item.style.left);

            if (itemLeft < existingLeft + existingWidth && itemLeft + width > existingLeft) {
                overlap = true;
            }
        });

        if (overlap) {
            lastYPosition += lineHeight; // Si l'événement chevauche, passer à la ligne suivante
        }

        item.style.top = `${lastYPosition}px`;

        // Tooltip interactif
        item.dataset.title = event.title;
        item.dataset.desc = `Du ${event.start} au ${event.end ? event.end : "En cours"}`;

        item.addEventListener("mouseover", function (event) {
            tooltip.innerHTML = `<strong>${this.dataset.title}</strong><br>${this.dataset.desc}`;
            tooltip.style.display = "block";
            tooltip.style.left = event.pageX + 10 + "px";
            tooltip.style.top = event.pageY - 40 + "px";
        });

        item.addEventListener("mousemove", function (event) {
            tooltip.style.left = event.pageX + 10 + "px";
            tooltip.style.top = event.pageY - 40 + "px";
        });

        item.addEventListener("mouseout", function () {
            tooltip.style.display = "none";
        });

        timeline.appendChild(item);
    });
});
