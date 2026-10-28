// The chart uses the same filtered users as the teacher grid.
let countryChart = null;

export function countByCountry(users) {
    return _.countBy(users, (user) => user.country || "Unknown");
}

export function renderStatisticsChart(users, allUsers) {
    const counts = countByCountry(users);
    const labels = Object.keys(counts).sort((a, b) => a.localeCompare(b));
    document.getElementById("countryChart").setAttribute("aria-label",
        labels.length ? labels.map((label) => `${label}: ${counts[label]} teachers`).join("; ") : "No teachers found");
    const percentage = allUsers.length ? (users.length / allUsers.length * 100).toFixed(2) : "0.00";
    document.getElementById("statsSummary").textContent = `${users.length} teachers (${percentage}% of all teachers)`;
    document.getElementById("chartEmpty").hidden = users.length > 0;
    document.getElementById("chartContainer").hidden = users.length === 0;

    if (countryChart) {
        countryChart.data.labels = labels;
        countryChart.data.datasets[0].data = labels.map((label) => counts[label]);
        countryChart.data.datasets[0].backgroundColor = labels.map((_, index) => `hsl(${index * 137.5 % 360}, 62%, 58%)`);
        countryChart.update();
        return;
    }
    countryChart = new Chart(document.getElementById("countryChart"), {
        type: "pie",
        data: {
            labels,
            datasets: [{
                label: "Teachers",
                data: labels.map((label) => counts[label]),
                backgroundColor: labels.map((_, index) => `hsl(${index * 137.5 % 360}, 62%, 58%)`),
            }],
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { position: "bottom" } },
        },
    });
}
