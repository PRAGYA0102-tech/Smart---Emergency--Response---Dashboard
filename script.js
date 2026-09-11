/* =====================================================
   SMART EMERGENCY RESPONSE DASHBOARD
===================================================== */


/* =====================================================
   INCIDENT DATA
===================================================== */

let incidents = [

    {
        id: 1,
        title: "Building Fire",
        location: "Sector 12",
        severity: "critical",
        status: "Active"
    },

    {
        id: 2,
        title: "Road Accident",
        location: "Main Highway",
        severity: "high",
        status: "Active"
    },

    {
        id: 3,
        title: "Water Leakage",
        location: "Green Park",
        severity: "low",
        status: "Active"
    },

    {
        id: 4,
        title: "Gas Leak",
        location: "Industrial Area",
        severity: "critical",
        status: "Active"
    }

];


/* =====================================================
   GET HTML ELEMENTS
===================================================== */

const incidentList =
    document.getElementById("incidentList");

const incidentCount =
    document.getElementById("incidentCount");

const criticalCount =
    document.getElementById("criticalCount");

const teamCount =
    document.getElementById("teamCount");

const resolvedCount =
    document.getElementById("resolvedCount");

const searchInput =
    document.getElementById("searchInput");

const filterSeverity =
    document.getElementById("filterSeverity");

const filterStatus =
    document.getElementById("filterStatus");

const sortSeverity =
    document.getElementById("sortSeverity");

const resultCount =
    document.getElementById("resultCount");

const incidentModal =
    document.getElementById("incidentModal");

const openIncidentForm =
    document.getElementById("openIncidentForm");

const closeIncidentForm =
    document.getElementById("closeIncidentForm");

const cancelIncident =
    document.getElementById("cancelIncident");

const incidentForm =
    document.getElementById("incidentForm");

const clearSearch =
    document.getElementById("clearSearch");

const currentTime =
    document.getElementById("currentTime");

const toast =
    document.getElementById("toast");

const toastMessage =
    document.getElementById("toastMessage");


/* =====================================================
   DISPLAY INCIDENTS
===================================================== */

function displayIncidents(incidentArray) {

    incidentList.innerHTML = "";


    /* ---------------------------------------------
       UPDATE RESULT COUNT
    --------------------------------------------- */

    resultCount.textContent =
        `Showing ${incidentArray.length} incident${incidentArray.length === 1 ? "" : "s"}`;


    /* ---------------------------------------------
       EMPTY STATE
    --------------------------------------------- */

    if (incidentArray.length === 0) {

        const emptyState =
            document.createElement("div");

        emptyState.className =
            "empty-state";

        emptyState.innerHTML = `

            <div class="empty-icon">
                🔍
            </div>

            <h3>
                No incidents found
            </h3>

            <p>
                Try changing your search or filter settings.
            </p>

        `;

        incidentList.appendChild(emptyState);

        return;
    }


    /* ---------------------------------------------
       CREATE INCIDENT CARDS
    --------------------------------------------- */

    incidentArray.forEach(function (incident) {

        const incidentCard =
            document.createElement("article");

        incidentCard.className =
            "incident-card";


        const severityClass =
            `severity-${incident.severity}`;


        const statusClass =
            incident.status === "Active"
                ? "status-active"
                : "status-resolved";


        incidentCard.innerHTML = `

            <div class="incident-card-top">

                <div>

                    <h3>
                        ${escapeHTML(incident.title)}
                    </h3>

                    <span class="incident-id">
                        Incident #${incident.id}
                    </span>

                </div>

                <span
                    class="severity-badge ${severityClass}"
                >
                    ${incident.severity}
                </span>

            </div>


            <div class="incident-details">

                <div class="detail-item">

                    <span>
                        Location
                    </span>

                    <strong>
                        📍 ${escapeHTML(incident.location)}
                    </strong>

                </div>


                <div class="detail-item">

                    <span>
                        Status
                    </span>

                    <strong class="${statusClass}">
                        ${incident.status}
                    </strong>

                </div>

            </div>


            <div class="incident-actions">

                <button
                    class="edit-button"
                    onclick="editIncident(${incident.id})"
                >
                    ✏️ Edit
                </button>

                <button
                    class="delete-button"
                    onclick="deleteIncident(${incident.id})"
                >
                    🗑️ Delete
                </button>

            </div>

        `;


        incidentList.appendChild(incidentCard);

    });

}


/* =====================================================
   UPDATE INCIDENT DISPLAY
===================================================== */

function updateIncidentDisplay() {

    const searchText =
        searchInput.value
            .trim()
            .toLowerCase();


    const selectedSeverity =
        filterSeverity.value;


    const selectedStatus =
        filterStatus.value;


    const selectedSort =
        sortSeverity.value;


    /*
        Start with a copy of the incident array.
    */

    let filteredIncidents =
        [...incidents];


    /* ---------------------------------------------
       SEARCH
    --------------------------------------------- */

    if (searchText !== "") {

        filteredIncidents =
            filteredIncidents.filter(function (incident) {

                const title =
                    incident.title.toLowerCase();

                const location =
                    incident.location.toLowerCase();

                const severity =
                    incident.severity.toLowerCase();

                return (
                    title.includes(searchText) ||
                    location.includes(searchText) ||
                    severity.includes(searchText)
                );

            });

    }


    /* ---------------------------------------------
       SEVERITY FILTER
    --------------------------------------------- */

    if (selectedSeverity !== "all") {

        filteredIncidents =
            filteredIncidents.filter(function (incident) {

                return (
                    incident.severity ===
                    selectedSeverity
                );

            });

    }


    /* ---------------------------------------------
       STATUS FILTER
    --------------------------------------------- */

    if (selectedStatus !== "all") {

        filteredIncidents =
            filteredIncidents.filter(function (incident) {

                return (
                    incident.status ===
                    selectedStatus
                );

            });

    }


    /* ---------------------------------------------
       SORTING
    --------------------------------------------- */

    const severityOrder = {

        critical: 1,
        high: 2,
        medium: 3,
        low: 4

    };


    if (selectedSort === "critical-high") {

        filteredIncidents.sort(function (a, b) {

            return (
                severityOrder[a.severity] -
                severityOrder[b.severity]
            );

        });

    }


    if (selectedSort === "low-critical") {

        filteredIncidents.sort(function (a, b) {

            return (
                severityOrder[b.severity] -
                severityOrder[a.severity]
            );

        });

    }


    displayIncidents(filteredIncidents);

}


/* =====================================================
   UPDATE DASHBOARD STATISTICS
===================================================== */

function updateDashboard() {

    /* Total incidents */

    incidentCount.textContent =
        incidents.length;


    /* Critical incidents */

    const criticalIncidents =
        incidents.filter(function (incident) {

            return incident.severity === "critical";

        });

    criticalCount.textContent =
        criticalIncidents.length;


    /* Response teams */

    teamCount.textContent =
        3;


    /* Resolved incidents */

    const resolvedIncidents =
        incidents.filter(function (incident) {

            return incident.status === "Resolved";

        });

    resolvedCount.textContent =
        resolvedIncidents.length;

}


/* =====================================================
   ADD INCIDENT
===================================================== */

incidentForm.addEventListener(
    "submit",
    function (event) {

        event.preventDefault();


        const title =
            document.getElementById("incidentTitle")
                .value
                .trim();


        const location =
            document.getElementById("incidentLocation")
                .value
                .trim();


        const severity =
            document.getElementById("incidentSeverity")
                .value;


        const status =
            document.getElementById("incidentStatus")
                .value;


        /* Validate */

        if (
            title === "" ||
            location === ""
        ) {

            showToast(
                "Please fill in all required fields.",
                "⚠️"
            );

            return;
        }


        /* Generate unique ID */

        const newId =
            incidents.length > 0
                ? Math.max(
                    ...incidents.map(
                        incident => incident.id
                    )
                ) + 1
                : 1;


        /* Create incident */

        const newIncident = {

            id: newId,

            title: title,

            location: location,

            severity: severity,

            status: status

        };


        /* Add to array */

        incidents.push(newIncident);


        /* Update dashboard */

        updateIncidentDisplay();

        updateDashboard();


        /* Close form */

        closeModal();


        /* Reset form */

        incidentForm.reset();


        /* Show confirmation */

        showToast(
            "Incident reported successfully.",
            "✓"
        );

    }
);


/* =====================================================
   EDIT INCIDENT
===================================================== */

function editIncident(id) {

    const incident =
        incidents.find(function (item) {

            return item.id === id;

        });


    if (!incident) {
        return;
    }


    const newTitle =
        prompt(
            "Enter incident title:",
            incident.title
        );


    if (
        newTitle === null ||
        newTitle.trim() === ""
    ) {
        return;
    }


    const newLocation =
        prompt(
            "Enter incident location:",
            incident.location
        );


    if (
        newLocation === null ||
        newLocation.trim() === ""
    ) {
        return;
    }


    const newSeverity =
        prompt(
            "Enter severity: critical, high, medium or low",
            incident.severity
        );


    if (newSeverity === null) {
        return;
    }


    const severity =
        newSeverity
            .trim()
            .toLowerCase();


    const validSeverities = [
        "critical",
        "high",
        "medium",
        "low"
    ];


    if (
        !validSeverities.includes(severity)
    ) {

        showToast(
            "Invalid severity entered.",
            "⚠️"
        );

        return;
    }


    const newStatus =
        prompt(
            "Enter status: Active or Resolved",
            incident.status
        );


    if (newStatus === null) {
        return;
    }


    const status =
        newStatus
            .trim()
            .toLowerCase() === "resolved"
            ? "Resolved"
            : "Active";


    /* Update object */

    incident.title =
        newTitle.trim();

    incident.location =
        newLocation.trim();

    incident.severity =
        severity;

    incident.status =
        status;


    /* Refresh UI */

    updateIncidentDisplay();

    updateDashboard();


    showToast(
        "Incident updated successfully.",
        "✓"
    );

}


/* =====================================================
   DELETE INCIDENT
===================================================== */

function deleteIncident(id) {

    const index =
        incidents.findIndex(function (incident) {

            return incident.id === id;

        });


    if (index === -1) {
        return;
    }


    const incident =
        incidents[index];


    const confirmed =
        confirm(
            `Delete "${incident.title}"?`
        );


    if (!confirmed) {
        return;
    }


    incidents.splice(
        index,
        1
    );


    updateIncidentDisplay();

    updateDashboard();


    showToast(
        "Incident deleted.",
        "✓"
    );

}


/* =====================================================
   SEARCH
===================================================== */

searchInput.addEventListener(
    "input",
    updateIncidentDisplay
);


/* =====================================================
   SEVERITY FILTER
===================================================== */

filterSeverity.addEventListener(
    "change",
    updateIncidentDisplay
);


/* =====================================================
   STATUS FILTER
===================================================== */

filterStatus.addEventListener(
    "change",
    updateIncidentDisplay
);


/* =====================================================
   SORT
===================================================== */

sortSeverity.addEventListener(
    "change",
    updateIncidentDisplay
);


/* =====================================================
   CLEAR SEARCH
===================================================== */

clearSearch.addEventListener(
    "click",
    function () {

        searchInput.value = "";

        updateIncidentDisplay();

        searchInput.focus();

    }
);


/* =====================================================
   OPEN MODAL
===================================================== */

openIncidentForm.addEventListener(
    "click",
    openModal
);


/* =====================================================
   CLOSE MODAL
===================================================== */

closeIncidentForm.addEventListener(
    "click",
    closeModal
);


cancelIncident.addEventListener(
    "click",
    closeModal
);


/* =====================================================
   CLICK OUTSIDE MODAL
===================================================== */

incidentModal.addEventListener(
    "click",
    function (event) {

        if (
            event.target === incidentModal
        ) {

            closeModal();

        }

    }
);


/* =====================================================
   ESC KEY CLOSES MODAL
===================================================== */

document.addEventListener(
    "keydown",
    function (event) {

        if (
            event.key === "Escape" &&
            incidentModal.classList.contains("active")
        ) {

            closeModal();

        }

    }
);


/* =====================================================
   MODAL FUNCTIONS
===================================================== */

function openModal() {

    incidentModal.classList.add(
        "active"
    );

    document.body.style.overflow =
        "hidden";

}


function closeModal() {

    incidentModal.classList.remove(
        "active"
    );

    document.body.style.overflow =
        "";

}


/* =====================================================
   TOAST NOTIFICATION
===================================================== */

let toastTimer;


function showToast(
    message,
    icon = "✓"
) {

    document.getElementById("toastIcon")
        .textContent = icon;

    toastMessage.textContent =
        message;

    toast.classList.add("show");


    clearTimeout(toastTimer);


    toastTimer =
        setTimeout(function () {

            toast.classList.remove("show");

        }, 3000);

}


/* =====================================================
   LIVE CLOCK
===================================================== */

function updateClock() {

    const now =
        new Date();


    const hours =
        String(
            now.getHours()
        ).padStart(2, "0");


    const minutes =
        String(
            now.getMinutes()
        ).padStart(2, "0");


    const seconds =
        String(
            now.getSeconds()
        ).padStart(2, "0");


    currentTime.textContent =
        `${hours}:${minutes}:${seconds}`;

}


setInterval(
    updateClock,
    1000
);

updateClock();


/* =====================================================
   HTML ESCAPE
===================================================== */

function escapeHTML(value) {

    return String(value)

        .replace(
            /&/g,
            "&amp;"
        )

        .replace(
            /</g,
            "&lt;"
        )

        .replace(
            />/g,
            "&gt;"
        )

        .replace(
            /"/g,
            "&quot;"
        )

        .replace(
            /'/g,
            "&#039;"
        );

}


/* =====================================================
   INITIAL LOAD
===================================================== */

updateIncidentDisplay();

updateDashboard();