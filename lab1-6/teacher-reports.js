// Both reports use all loaded teachers, regardless of the page filters.
let teacherReport = null;
let reportReady = false;
let pendingReport = null;

export function buildTeacherReport(users, view) {
    const metadata = {
        id: { type: "string", caption: "Teacher ID" },
        full_name: { type: "string", caption: "Name" },
        course: { type: "string", caption: "Speciality" },
        age: { type: "number", caption: "Age" },
        b_date: { type: "string", caption: "Date of birth" },
        gender: { type: "string", caption: "Gender" },
        country: { type: "string", caption: "Country" },
        city: { type: "string", caption: "City" },
        email: { type: "string", caption: "Email" },
        phone: { type: "string", caption: "Phone" },
        favorite: { type: "string", caption: "Favorite" },
    };
    const records = _.map(users, (user) => ({
        id: String(user.id),
        full_name: user.full_name,
        course: user.course || "Unknown",
        age: user.age ?? null,
        b_date: user.b_date?.slice(0, 10) || "Unknown",
        gender: user.gender || "Unknown",
        country: user.country || "Unknown",
        city: user.city || "Unknown",
        email: user.email || "",
        phone: user.phone || "",
        favorite: user.favorite ? "Yes" : "No",
    }));
    const isFlat = view === "flat";
    const flatFields = ["full_name", "course", "age", "b_date", "gender", "country", "city", "email", "phone", "favorite", "id"];
    return {
        dataSource: { data: [metadata, ...records] },
        slice: isFlat ? {
            rows: _.map(flatFields.filter((field) => field !== "age"), (field) => ({ uniqueName: field })),
            measures: [{ uniqueName: "age", aggregation: "sum", format: "integers" }],
            flatOrder: flatFields,
        } : {
            rows: [{ uniqueName: "country", sort: "asc" }],
            measures: [{ uniqueName: "id", aggregation: "count", caption: "Teachers", format: "integers" }],
        },
        options: {
            grid: {
                type: isFlat ? "flat" : "classic",
                title: isFlat ? "All loaded teachers" : "Teachers by country",
                showHeaders: false,
                showTotals: "off",
                showGrandTotals: isFlat ? "off" : "on",
            },
            showAggregationLabels: false,
            configuratorButton: false,
        },
        formats: [{ name: "integers", decimalPlaces: 0, maxDecimalPlaces: 0 }],
    };
}

export function renderTeacherReport(users, view) {
    const container = document.getElementById("teacherReport");
    document.getElementById("reportSummary").textContent = `${users.length} loaded teachers. Page filters apply to the diagram only.`;
    document.getElementById("reportEmpty").hidden = users.length > 0;
    container.hidden = users.length === 0;
    if (!users.length) return;

    const report = buildTeacherReport(users, view);
    if (teacherReport) {
        if (reportReady) {
            reportReady = false;
            teacherReport.setReport(report);
        } else {
            pendingReport = report;
        }
    } else {
        teacherReport = new WebDataRocks({
            container: "#teacherReport",
            width: "100%",
            height: 440,
            toolbar: false,
            report,
            reportcomplete: () => {
                reportReady = true;
                // Keep the latest request if the user switches views during loading.
                if (pendingReport) {
                    const latestReport = pendingReport;
                    pendingReport = null;
                    reportReady = false;
                    teacherReport.setReport(latestReport);
                }
            },
        });
    }
}
