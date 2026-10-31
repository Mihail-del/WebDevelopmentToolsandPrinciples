// Create a fresh map whenever a teacher card opens.
let teacherMap = null;

export function getCoordinates(coordinates) {
    if (!coordinates) return null;
    const { latitude, longitude } = coordinates;
    if (latitude == null || longitude == null ||
        String(latitude).trim() === "" || String(longitude).trim() === "") return null;
    const lat = Number(latitude);
    const lng = Number(longitude);
    if (!Number.isFinite(lat) || !Number.isFinite(lng) ||
        Math.abs(lat) > 90 || Math.abs(lng) > 180) return null;
    return [lat, lng];
}

export function removeTeacherMap() {
    if (teacherMap) {
        teacherMap.remove();
        teacherMap = null;
    }
}

export function showTeacherMap(coordinates) {
    removeTeacherMap();
    const container = document.getElementById("teacherMap");
    const position = getCoordinates(coordinates);
    if (!position) {
        container.textContent = "Location coordinates are not available.";
        return;
    }
    teacherMap = L.map(container).setView(position, 10);
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(teacherMap);
    L.marker(position).addTo(teacherMap);
}
