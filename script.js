/* =====================================================
   SMART EMERGENCY RESPONSE DASHBOARD
===================================================== */


/* =====================================================
   Accident DATA
===================================================== */

let Accident = JSON.parse(
    localStorage.getItem("accidents")
) || [

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
   SAVE Accident DATA
===================================================== */

function saveAccidents() {

    localStorage.setItem(
        "accidents",
        JSON.stringify(Accident)
    );

}


/* =====================================================
   GET HTML ELEMENTS
===================================================== */

const accidentList =
    document.getElementById("accidentList");

const accidentCount =
    document.getElementById("accidentCount");

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

const accidentModal =
    document.getElementById("accidentModal");

const openAccidentForm =
    document.getElementById("openAccidentForm");

const closeAccidentForm =
    document.getElementById("closeAccidentForm");

const cancelAccident =
    document.getElementById("cancelAccident");

const accidentForm =
    document.getElementById("accidentForm");

const clearSearch =
    document.getElementById("clearSearch");

const currentTime =
    document.getElementById("currentTime");

const toast =
    document.getElementById("toast");

const toastMessage =
    document.getElementById("toastMessage");


/* =====================================================
   DISPLAY Accident
===================================================== */

function displayAccidents(accidentArray) {

    accidentList.innerHTML = "";


    /* ---------------------------------------------
       UPDATE RESULT COUNT
    --------------------------------------------- */

    resultCount.textContent =
        `Showing ${accidentArray.length} Accident${accidentArray.length === 1 ? "" : "s"}`;


    /* ---------------------------------------------
       EMPTY STATE
    --------------------------------------------- */

    if (accidentArray.length === 0) {

        const emptyState =
            document.createElement("div");

        emptyState.className =
            "empty-state";

        emptyState.innerHTML = `

            <div class="empty-icon">
                🔍
            </div>

            <h3>
                No Accident found
            </h3>

            <p>
                Try changing your search or filter settings.
            </p>

        `;

        accidentList.appendChild(emptyState);

        return;
    }


    /* ---------------------------------------------
       CREATE Accident CARDS
    --------------------------------------------- */

    accidentArray.forEach(function (Accident) {

        const accidentCard =
            document.createElement("article");

        accidentCard.className =
            "Accident-card";


        const severityClass =
            `severity-${Accident.severity}`;


        const statusClass =
            Accident.status === "Active"
                ? "status-active"
                : "status-resolved";


        accidentCard.innerHTML = `

            <div class="Accident-card-top">

                <div>

                    <h3>
                        ${escapeHTML(Accident.title)}
                    </h3>

                    <span class="Accident-id">
                        Accident #${Accident.id}
                    </span>

                </div>

                <span
                    class="severity-badge ${severityClass}"
                >
                    ${Accident.severity}
                </span>

            </div>


            <div class="Accident-details">

                <div class="detail-item">

                    <span>
                        Location
                    </span>

                    <strong>
                        📍 ${escapeHTML(Accident.location)}
                    </strong>

                </div>


                <div class="detail-item">

                    <span>
                        Status
                    </span>

                    <strong class="${statusClass}">
                        ${Accident.status}
                    </strong>

                </div>

            </div>


            <div class="Accident-actions">

                <button
                    class="edit-button"
                    onclick="editAccident(${Accident.id})"
                >
                    ✏️ Edit
                </button>

                <button
                    class="delete-button"
                    onclick="deleteAccident(${Accident.id})"
                >
                    🗑️ Delete
                </button>

            </div>

        `;


        accidentList.appendChild(accidentCard);

    });

}


/* =====================================================
   UPDATE Accident DISPLAY
===================================================== */

function updateAccidentDisplay() {

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
        Start with a copy of the Accident array.
    */

    let filteredAccidents =
        [...Accident];


    /* ---------------------------------------------
       SEARCH
    --------------------------------------------- */

    if (searchText !== "") {

        filteredAccidents =
            filteredAccidents.filter(function (Accident) {

                const title =
                    Accident.title.toLowerCase();

                const location =
                    Accident.location.toLowerCase();

                const severity =
                    Accident.severity.toLowerCase();

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

        filteredAccidents =
            filteredAccidents.filter(function (Accident) {

                return (
                    Accident.severity ===
                    selectedSeverity
                );

            });

    }


    /* ---------------------------------------------
       STATUS FILTER
    --------------------------------------------- */

    if (selectedStatus !== "all") {

        filteredAccidents =
            filteredAccidents.filter(function (Accident) {

                return (
                    Accident.status ===
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

        filteredAccidents.sort(function (a, b) {

            return (
                severityOrder[a.severity] -
                severityOrder[b.severity]
            );

        });

    }


    if (selectedSort === "low-critical") {

        filteredAccidents.sort(function (a, b) {

            return (
                severityOrder[b.severity] -
                severityOrder[a.severity]
            );

        });

    }


    displayAccidents(filteredAccidents);

}


/* =====================================================
   UPDATE DASHBOARD STATISTICS
===================================================== */

function updateDashboard() {

    /* Total Accident */

    accidentCount.textContent =
        Accident.length;


    /* Critical Accident */

    const criticalAccidents =
        Accident.filter(function (Accident) {

            return Accident.severity === "critical";

        });

    criticalCount.textContent =
        criticalAccidents.length;


    /* Response teams */

    teamCount.textContent =
        3;


    /* Resolved Accident */

    const resolvedAccidents =
        Accident.filter(function (Accident) {

            return Accident.status === "Resolved";

        });

    resolvedCount.textContent =
        resolvedAccidents.length;

}


/* =====================================================
   ADD Accident
===================================================== */

accidentForm.addEventListener(
    "submit",
    function (event) {

        event.preventDefault();


        const title =
            document.getElementById("accidentTitle")
                .value
                .trim();


        const location =
            document.getElementById("accidentLocation")
                .value
                .trim();


        const severity =
            document.getElementById("accidentSeverity")
                .value;


        const status =
            document.getElementById("accidentStatus")
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
            Accident.length > 0
                ? Math.max(
                    ...Accident.map(
                        Accident => Accident.id
                    )
                ) + 1
                : 1;


        /* Create Accident */

        const newAccident = {

            id: newId,

            title: title,

            location: location,

            severity: severity,

            status: status

        };


        /* Add to array */

        Accident.push(newAccident);


        /* Save to localStorage */

        saveAccidents();


        /* Update dashboard */

        updateAccidentDisplay();

        updateDashboard();


        /* Close form */

        closeModal();


        /* Reset form */

        accidentForm.reset();


        /* Show confirmation */

        showToast(
            "Accident reported successfully.",
            "✓"
        );

    }
);


/* =====================================================
   EDIT Accident
===================================================== */

function editAccident(id) {

    const accident =
        Accident.find(function (item) {

            return item.id === id;

        });


    if (!accident) {
        return;
    }


    const newTitle =
        prompt(
            "Enter Accident title:",
            accident.title
        );


    if (
        newTitle === null ||
        newTitle.trim() === ""
    ) {
        return;
    }


    const newLocation =
        prompt(
            "Enter Accident location:",
            accident.location
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
            accident.severity
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
            accident.status
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

    accident.title =
        newTitle.trim();

    accident.location =
        newLocation.trim();

    accident.severity =
        severity;

    accident.status =
        status;


    /* Save changes */

    saveAccidents();


    /* Refresh UI */

    updateAccidentDisplay();

    updateDashboard();


    showToast(
        "Accident updated successfully.",
        "✓"
    );

}


/* =====================================================
   DELETE Accident
===================================================== */

function deleteAccident(id) {

    const index =
        Accident.findIndex(function (Accident) {

            return Accident.id === id;

        });


    if (index === -1) {
        return;
    }


    const accident =
        Accident[index];


    const confirmed =
        confirm(
            `Delete "${accident.title}"?`
        );


    if (!confirmed) {
        return;
    }


    Accident.splice(
        index,
        1
    );


    /* Save changes */

    saveAccidents();


    updateAccidentDisplay();

    updateDashboard();


    showToast(
        "Accident deleted.",
        "✓"
    );

}


/* =====================================================
   SEARCH
===================================================== */

searchInput.addEventListener(
    "input",
    updateAccidentDisplay
);


/* =====================================================
   SEVERITY FILTER
===================================================== */

filterSeverity.addEventListener(
    "change",
    updateAccidentDisplay
);


/* =====================================================
   STATUS FILTER
===================================================== */

filterStatus.addEventListener(
    "change",
    updateAccidentDisplay
);


/* =====================================================
   SORT
===================================================== */

sortSeverity.addEventListener(
    "change",
    updateAccidentDisplay
);


/* =====================================================
   CLEAR SEARCH
===================================================== */

clearSearch.addEventListener(
    "click",
    function () {

        searchInput.value = "";

        updateAccidentDisplay();

        searchInput.focus();

    }
);


/* =====================================================
   OPEN MODAL
===================================================== */

openAccidentForm.addEventListener(
    "click",
    openModal
);


/* =====================================================
   CLOSE MODAL
===================================================== */

closeAccidentForm.addEventListener(
    "click",
    closeModal
);


cancelAccident.addEventListener(
    "click",
    closeModal
);


/* =====================================================
   CLICK OUTSIDE MODAL
===================================================== */

accidentModal.addEventListener(
    "click",
    function (event) {

        if (
            event.target === accidentModal
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
            accidentModal.classList.contains("active")
        ) {

            closeModal();

        }

    }
);


/* =====================================================
   MODAL FUNCTIONS
===================================================== */

function openModal() {

    accidentModal.classList.add(
        "active"
    );

    document.body.style.overflow =
        "hidden";

}


function closeModal() {

    accidentModal.classList.remove(
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

updateAccidentDisplay();

updateDashboard();