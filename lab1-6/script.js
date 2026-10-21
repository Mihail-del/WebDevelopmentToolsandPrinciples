import { fetchUsers } from "./api.js";

const COURSES = [
    "Mathematics",
    "Physics",
    "English",
    "Computer Science",
    "Dancing",
    "Chess",
    "Biology",
    "Chemistry",
    "Law",
    "Art",
    "Medicine",
    "Statistics",
];

const getRandomCourse = () => {
    const randomIndex = Math.floor(Math.random() * COURSES.length);
    return COURSES[randomIndex];
};

function getAge(birthDate) {
    if (!birthDate) return null;
    const birth = new Date(birthDate);
    if (Number.isNaN(birth.getTime())) return null;
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    if (today.getMonth() < birth.getMonth() ||
        (today.getMonth() === birth.getMonth() && today.getDate() < birth.getDate())) {
        age--;
    }
    return age;
}

// Merge users
export function formatAndMergeUsers(rawUsers = [], extraUsers = []) {
    const formattedRawUsers = rawUsers.map((user) => {
        return {
            gender: user.gender ? user.gender.charAt(0).toUpperCase() + user.gender.slice(1) : null,
            title: user.name?.title || null,
            full_name: `${user.name?.first || ""} ${user.name?.last || ""}`.trim(),
            city: user.location?.city || null,
            state: user.location?.state || null,
            country: user.location?.country || null,
            postcode: user.location?.postcode ?? null,
            coordinates: user.location?.coordinates || null,
            timezone: user.location?.timezone || null,
            email: user.email || null,
            b_date: user.dob?.date || null,
            age: user.dob?.age ?? getAge(user.dob?.date),
            phone: user.phone || null,
            picture_large: user.picture?.large || null,
            picture_thumbnail: user.picture?.thumbnail || null,

            id: user.login?.uuid || ((user.id?.name && user.id?.value)
                ? `${user.id.name}${user.id.value}`
                : `user-${crypto.randomUUID()}`),
            favorite: false,
            course: getRandomCourse(),
            bg_color: "#ffffff",
            note: null,
        };
    });

    const normalizedExtraUsers = extraUsers.map((user) => {
        return {
            gender: user.gender ? user.gender.charAt(0).toUpperCase() + user.gender.slice(1) : null,
            title: user.title || null,
            full_name: user.full_name || "",
            city: user.city || null,
            state: user.state || null,
            country: user.country || null,
            postcode: user.postcode ?? null,
            coordinates: user.coordinates || null,
            timezone: user.timezone || null,
            email: user.email || null,
            b_date: user.b_day || user.b_date || null,
            age: user.age ?? getAge(user.b_day || user.b_date),
            phone: user.phone || null,
            picture_large: user.picture_large || null,
            picture_thumbnail: user.picture_thumbnail || null,

            id: user.id || `user-${Math.random()}`,
            favorite: user.favorite ?? false,
            course: COURSES.find((course) => course.toLowerCase() === user.course?.toLowerCase()) || getRandomCourse(),
            bg_color: user.bg_color || "#ffffff",
            note: user.note || null,
        };
    });

    const userMap = new Map();

    [...formattedRawUsers, ...normalizedExtraUsers].forEach((user) => {
        const key = user.id;

        if (!userMap.has(key)) {
            userMap.set(key, { ...user });
        } else {
            const existing = userMap.get(key);
            userMap.set(key, {
                ...existing,
                city: user.city || existing.city,
                state: user.state || existing.state,
                country: user.country || existing.country,
                email: user.email || existing.email,
                phone: user.phone || existing.phone,
                b_date: user.b_date || existing.b_date,
                age: user.age ?? existing.age,
                picture_large: user.picture_large || existing.picture_large,
                picture_thumbnail: user.picture_thumbnail || existing.picture_thumbnail,
                note: user.note || existing.note,
                favorite: existing.favorite || user.favorite,
                course: existing.course || user.course,
                bg_color: user.bg_color || existing.bg_color,
            });
        }
    });

    return Array.from(userMap.values());
}

// Get errors for each field.
function getUserErrors(user) {
    const errors = {};
    const textFields = ["full_name", "gender", "note", "state", "city", "country"];

    textFields.forEach((field) => {
        const value = user[field];
        if (typeof value !== "string" || !value.trim()) {
            errors[field] = "This field is required.";
        } else if (!/^\p{Lu}/u.test(value.trim())) {
            errors[field] = "Start with a capital letter.";
        }
    });

    if (typeof user.age !== "number" || !Number.isFinite(user.age) || user.age < 0) {
        errors.age = "Enter a valid birth date that is not in the future.";
    }
    if (typeof user.email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user.email)) {
        errors.email = "Enter a valid email, for example name@example.com.";
    }

    const phoneFormats = {
        Ukraine: /^(?:\+380\d{9}|0\d{9})$/,
        "United States": /^(?:\+?1)?\d{10}$/,
        Canada: /^(?:\+?1)?\d{10}$/,
        Germany: /^(?:\+49\d{7,13}|0\d{7,13})$/,
        France: /^(?:\+33\d{9}|0\d{9})$/,
        Norway: /^(?:\+47)?\d{8}$/,
        Finland: /^(?:\+358\d{5,12}|0\d{5,12})$/,
        Denmark: /^(?:\+45)?\d{8}$/,
        Ireland: /^(?:\+353\d{7,9}|0\d{7,9})$/,
        Spain: /^(?:\+34)?\d{9}$/,
    };
    const phoneFormat = phoneFormats[user.country] || /^\+?\d{7,15}$/;
    const phone = typeof user.phone === "string" ? user.phone.replace(/[\s()-]/g, "") : "";
    if (typeof user.phone !== "string" || !/^\+?[\d\s()-]+$/.test(user.phone) || !phoneFormat.test(phone)) {
        errors.phone = `Enter a valid phone number for ${user.country || "the selected country"}.`;
    }

    return errors;
}

// Check user fields.
export function validateUser(user) {
    return !!user && typeof user === "object" && Object.keys(getUserErrors(user)).length === 0;
}

// Filter users
export function filterUsers(users, filters = {}) {
    return users.filter((user) => {
        if (filters.country && user.country?.toLowerCase() !== filters.country.toLowerCase()) {
            return false;
        }
        if (filters.age !== undefined && user.age !== filters.age) {
            return false;
        }
        if (filters.gender && user.gender?.toLowerCase() !== filters.gender.toLowerCase()) {
            return false;
        }
        if (filters.favorite !== undefined && user.favorite !== filters.favorite) {
            return false;
        }
        return true;
    });
}

// Sort users
export function sortUsers(users, sortBy, order = "asc") {
    const multiplier = order.toLowerCase() === "desc" ? -1 : 1;

    return [...users].sort((a, b) => {
        const field = sortBy === "b_day" ? "b_date" : sortBy;
        const valA = a[field] ?? (field === "b_date" ? a.b_day : null);
        const valB = b[field] ?? (field === "b_date" ? b.b_day : null);

        if (valA === valB) return 0;
        if (valA === null || valA === undefined) return 1;
        if (valB === null || valB === undefined) return -1;

        if (sortBy === "b_date" || sortBy === "b_day") {
            return (new Date(valA).getTime() - new Date(valB).getTime()) * multiplier;
        }

        if (typeof valA === "number" && typeof valB === "number") {
            return (valA - valB) * multiplier;
        }

        return String(valA).localeCompare(String(valB)) * multiplier;
    });
}

// Find a user
export function findUser(users, query) {
    if (query === undefined || query === null) return null;

    const normalizedQuery = String(query).trim().toLowerCase();
    if (!normalizedQuery) return null;

    return (
        users.find((user) => {
            if (typeof query === "number" && user.age === query) return true;
            if (user.full_name && user.full_name.toLowerCase().includes(normalizedQuery)) return true;
            if (user.note && user.note.toLowerCase().includes(normalizedQuery)) return true;
            if (String(user.age) === normalizedQuery) return true;
            return false;
        }) || null
    );
}

// Count matching users
export function getPercentageByCondition(users, predicate) {
    if (!Array.isArray(users) || users.length === 0) return 0;

    let matchingCount = 0;

    if (typeof predicate === "function") {
        matchingCount = users.filter(predicate).length;
    } else if (predicate !== undefined && predicate !== null) {
        matchingCount = users.filter((user) => findUser([user], predicate)).length;
    }

    const percentage = (matchingCount / users.length) * 100;
    return Number(percentage.toFixed(2));
}

// Page content

let allUsers = [];
let displayedUsers = [...allUsers];
const ROWS_PER_PAGE = 10;
let currentPage = 1;
const requestSeed = crypto.randomUUID();
let nextPage = 6; // The first 50 users cover five pages of 10.
let initialLoaded = false;
let isLoadingUsers = false;
let sortField = "";
let sortOrder = "asc";

// DOM Selectors
const teachersGrid = document.getElementById("teachersGrid");
const showMoreTeachers = document.getElementById("showMoreTeachers");
const loadStatus = document.getElementById("loadStatus");
const retryLoad = document.getElementById("retryLoad");
const statsTableBody = document.getElementById("statsTableBody");
const favoritesContainer = document.getElementById("favoritesTrack");
const favoritesPrev = document.getElementById("favoritesPrev");
const favoritesNext = document.getElementById("favoritesNext");
const teacherInfoBody = document.getElementById("teacherInfoBody");
const addTeacherModal = document.getElementById("addTeacherModal");
const teacherInfoModal = document.getElementById("teacherInfoModal");
const searchInput = document.querySelector(".search-form__input");
const searchForm = document.querySelector(".search-form");
const paginationNav = document.querySelector(".pagination");

// Filter Selectors
const filterAge = document.getElementById("filter-age");
const filterCountry = document.getElementById("filter-country");
const filterSex = document.getElementById("filter-sex");
const filterPhoto = document.getElementById("filter-photo") || document.querySelector(".filters__checkbox-label:nth-child(1) .filters__checkbox");
const filterFavorite = document.getElementById("filter-favorite") || document.querySelector(".filters__checkbox-label:nth-child(2) .filters__checkbox");

function getInitials(fullName) {
    const parts = fullName.trim().split(/\s+/);
    if (parts.length >= 2) return `${parts[0][0]}.${parts[parts.length - 1][0]}`;
    return fullName.substring(0, 2).toUpperCase();
}

function splitName(fullName) {
    const parts = fullName.trim().split(/\s+/);
    if (parts.length >= 2) return { first: parts.slice(0, -1).join(" "), last: parts[parts.length - 1] };
    return { first: fullName, last: "" };
}

function capitalize(str) {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, (character) => ({
        "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
    })[character]);
}

function updateCarouselButtons() {
    if (!favoritesContainer) return;
    favoritesPrev.disabled = favoritesContainer.scrollLeft <= 1;
    favoritesNext.disabled = favoritesContainer.scrollLeft + favoritesContainer.clientWidth >= favoritesContainer.scrollWidth - 1;
}

function scrollFavorites(direction) {
    const card = favoritesContainer.querySelector(".teacher-card");
    if (!card) return;
    const step = card.offsetWidth + parseFloat(getComputedStyle(favoritesContainer).gap);
    favoritesContainer.scrollBy({ left: direction * step });
}

favoritesContainer?.addEventListener("scroll", updateCarouselButtons);
window.addEventListener("resize", updateCarouselButtons);

// Render Top Teachers Grid
function renderTeachersGrid() {
    if (!teachersGrid) return;
    teachersGrid.innerHTML = "";
    const topTeachers = displayedUsers;

    if (!topTeachers.length) {
        teachersGrid.innerHTML = '<p class="empty-message">No teachers found.</p>';
    }

    topTeachers.forEach((user) => {
        const card = document.createElement("div");
        card.className = "teacher-card";
        card.dataset.userIndex = allUsers.indexOf(user);

        const { first, last } = splitName(user.full_name);

        let avatarHTML;
        if (user.picture_large || user.picture_thumbnail) {
            const src = user.picture_large || user.picture_thumbnail;
            avatarHTML = `
                <div class="teacher-card__avatar-wrap">
                    ${user.favorite ? '<span class="teacher-card__star">★</span>' : ""}
                    <img src="${src}" alt="${escapeHTML(user.full_name)}" class="teacher-card__avatar">
                </div>`;
        } else {
            avatarHTML = `
                <div class="teacher-card__avatar-wrap teacher-card__avatar-wrap--text">
                    ${user.favorite ? '<span class="teacher-card__star">★</span>' : ""}
                    <span>${escapeHTML(getInitials(user.full_name))}</span>
                </div>`;
        }

        card.innerHTML = `
            ${avatarHTML}
            <h3 class="teacher-card__name">${escapeHTML(first)}<br>${escapeHTML(last)}</h3>
            <p class="teacher-card__subject">${escapeHTML(user.course)}</p>
            <p class="teacher-card__country">${escapeHTML(user.country)}</p>
        `;
        if (/^#[0-9a-f]{6}$/i.test(user.bg_color)) {
            card.querySelector(".teacher-card__avatar-wrap").style.backgroundColor = user.bg_color;
        }

        teachersGrid.appendChild(card);
    });
}

// Show favorite teachers
function renderFavorites() {
    if (!favoritesContainer) return;
    favoritesContainer.innerHTML = "";

    const favorites = allUsers.filter((u) => u.favorite);

    if (favorites.length === 0) {
        favoritesContainer.innerHTML = '<p class="empty-message">No favorite teachers yet.</p>';
        updateCarouselButtons();
        return;
    }

    favorites.forEach((user) => {
        const card = document.createElement("div");
        card.className = "teacher-card";
        card.dataset.userIndex = allUsers.indexOf(user);

        const { first, last } = splitName(user.full_name);

        let avatarHTML;
        if (user.picture_large || user.picture_thumbnail) {
            const src = user.picture_large || user.picture_thumbnail;
            avatarHTML = `
                <div class="teacher-card__avatar-wrap">
                    <span class="teacher-card__star">★</span>
                    <img src="${src}" alt="${escapeHTML(user.full_name)}" class="teacher-card__avatar">
                </div>`;
        } else {
            avatarHTML = `
                <div class="teacher-card__avatar-wrap teacher-card__avatar-wrap--text">
                    <span class="teacher-card__star">★</span>
                    <span>${escapeHTML(getInitials(user.full_name))}</span>
                </div>`;
        }

        card.innerHTML = `
            ${avatarHTML}
            <h3 class="teacher-card__name">${escapeHTML(first)}<br>${escapeHTML(last)}</h3>
            <p class="teacher-card__subject">${escapeHTML(user.course)}</p>
            <p class="teacher-card__country">${escapeHTML(user.country)}</p>
        `;

        favoritesContainer.appendChild(card);
    });
    updateCarouselButtons();
}

// Render Statistics Table
function renderStatsTable() {
    if (!statsTableBody) return;
    statsTableBody.innerHTML = "";

    const totalPages = Math.max(1, Math.ceil(displayedUsers.length / ROWS_PER_PAGE));
    if (currentPage > totalPages) currentPage = totalPages;
    const start = (currentPage - 1) * ROWS_PER_PAGE;
    const pageUsers = displayedUsers.slice(start, start + ROWS_PER_PAGE);
    if (!pageUsers.length) {
        statsTableBody.innerHTML = '<tr><td colspan="6">No teachers found.</td></tr>';
    }
    document.getElementById("statsSummary").textContent = `${displayedUsers.length} teachers (${getPercentageByCondition(allUsers, (user) => displayedUsers.includes(user))}% of all teachers)`;

    pageUsers.forEach((user) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${escapeHTML(user.full_name)}</td>
            <td>${escapeHTML(user.course || "—")}</td>
            <td>${user.age ?? "—"}</td>
            <td>${escapeHTML(user.b_date?.slice(0, 10) || "—")}</td>
            <td>${escapeHTML(user.gender || "—")}</td>
            <td>${escapeHTML(user.country || "—")}</td>
        `;
        tr.style.cursor = "pointer";
        tr.dataset.userIndex = allUsers.indexOf(user);
        statsTableBody.appendChild(tr);
    });

    renderPagination(totalPages);
}

// Render Pagination Links
function renderPagination(totalPages) {
    if (!paginationNav) return;
    paginationNav.innerHTML = "";
    if (totalPages <= 1) return;

    for (let i = 1; i <= totalPages; i++) {
        const a = document.createElement("a");
        a.href = "#statistics";
        a.className = "pagination__link";
        a.textContent = String(i);
        if (i === currentPage) a.style.fontWeight = "bold";
        a.dataset.page = i;
        paginationNav.appendChild(a);
    }
}

// Fill the country list.
function renderCountryFilter() {
    const selectedCountry = filterCountry.value;
    const countries = [...new Set(allUsers.map((user) => user.country).filter(Boolean))];
    countries.sort((a, b) => a.localeCompare(b));
    filterCountry.innerHTML = '<option value="all">All</option>';

    countries.forEach((country) => {
        const option = document.createElement("option");
        option.value = country;
        option.textContent = country;
        filterCountry.appendChild(option);
    });
    filterCountry.value = countries.includes(selectedCountry) ? selectedCountry : "all";
}

// Refresh every section from the same source list.
function refreshUsers() {
    renderCountryFilter();
    applyFilters();
    renderFavorites();
}

// Apply Filters to the Displayed List
function applyFilters() {
    const filters = {};
    if (filterCountry.value !== "all") filters.country = filterCountry.value;
    if (filterSex && filterSex.value !== "all") filters.gender = filterSex.value;
    if (filterFavorite?.checked) filters.favorite = true;
    let filtered = filterUsers(allUsers, filters);

    // Filter by Age
    if (filterAge) {
        const ageVal = filterAge.value;
        if (ageVal === "18-31") filtered = filtered.filter((u) => u.age >= 18 && u.age <= 31);
        else if (ageVal === "32-45") filtered = filtered.filter((u) => u.age >= 32 && u.age <= 45);
        else if (ageVal === "46+") filtered = filtered.filter((u) => u.age >= 46);
    }

    // Filter by Photo availability
    if (filterPhoto && filterPhoto.checked) {
        filtered = filtered.filter((u) => u.picture_large || u.picture_thumbnail);
    }

    const query = searchInput?.value.trim();
    if (query) filtered = filtered.filter((user) => findUser([user], query));
    if (sortField) filtered = sortUsers(filtered, sortField, sortOrder);

    displayedUsers = filtered;
    currentPage = 1;
    renderTeachersGrid();
    renderStatsTable();
}

// Handle all filter changes.
document.querySelector(".filters").addEventListener("change", () => applyFilters());

// Handle clicks in one place.
document.addEventListener("click", (e) => {
    const target = e.target;

    if (target.closest("#openAddTeacherBtn, #openAddTeacherFooterBtn")) {
        addTeacherModal.classList.add("is-active");
        return;
    }
    if (target.closest(".modal__close") || target === addTeacherModal || target === teacherInfoModal) {
        closeModals();
        return;
    }

    const favBtn = target.closest("#toggleFavBtn");
    if (favBtn) {
        const user = allUsers[Number(teacherInfoBody.dataset.userIndex)];
        user.favorite = !user.favorite;
        favBtn.textContent = user.favorite ? "★" : "☆";
        favBtn.style.color = user.favorite ? "#f7ca18" : "#ccc";
        favBtn.setAttribute("aria-pressed", String(user.favorite));
        applyFilters();
        renderFavorites();
        return;
    }

    const teacher = target.closest(".teacher-card[data-user-index], tr[data-user-index]");
    if (teacher) {
        openTeacherInfo(allUsers[Number(teacher.dataset.userIndex)]);
        return;
    }
    if (target.closest("#showMoreTeachers")) {
        loadUsers();
        return;
    }
    if (target.closest("#favoritesPrev, #favoritesNext")) {
        scrollFavorites(target.closest("#favoritesPrev") ? -1 : 1);
        return;
    }

    const pageLink = target.closest(".pagination__link");
    if (pageLink) {
        e.preventDefault();
        currentPage = Number(pageLink.dataset.page);
        renderStatsTable();
        return;
    }

    const header = target.closest(".stats-table th[data-sort]");
    if (header) {
        const field = header.dataset.sort;
        sortOrder = sortField === field && sortOrder === "asc" ? "desc" : "asc";
        sortField = field;
        document.querySelectorAll(".stats-table th[data-sort]").forEach((item) => {
            const active = item === header;
            item.classList.toggle("is-sorted", active);
            item.setAttribute("aria-sort", active ? (sortOrder === "asc" ? "ascending" : "descending") : "none");
            item.querySelector(".sort-arrow").textContent = active ? (sortOrder === "asc" ? "↑" : "↓") : "";
        });
        applyFilters();
    }
});

// Open Teacher Details Modal
function openTeacherInfo(user) {
    if (!teacherInfoBody || !teacherInfoModal) return;

    let photoHTML;
    if (user.picture_large) {
        photoHTML = `
            <div class="info-card__photo-box">
                <img src="${user.picture_large}" alt="${escapeHTML(user.full_name)}" class="info-card__img">
            </div>`;
    } else {
        photoHTML = `
            <div class="info-card__photo-box" style="display:flex;align-items:center;justify-content:center;
                background:#f0f0f0;font-size:48px;font-weight:700;color:#f75c48;">
                ${escapeHTML(getInitials(user.full_name))}
            </div>`;
    }

    teacherInfoBody.innerHTML = `
        ${photoHTML}
        <div class="info-card__header">
            <div class="info-card__name-row">
                <h2 class="info-card__name">${escapeHTML(user.full_name)}</h2>
                <button class="info-card__star-btn" aria-label="Favorite" aria-pressed="${user.favorite}" id="toggleFavBtn" style="color: ${user.favorite ? '#f7ca18' : '#ccc'}">
                    ${user.favorite ? "★" : "☆"}
                </button>
            </div>
            <h4 class="info-card__subject">${escapeHTML(user.course)}</h4>
            <p class="info-card__meta">${escapeHTML([user.city, user.country].filter(Boolean).join(", ") || "—")}</p>
            <p class="info-card__meta">${user.age ?? "—"}, ${escapeHTML(user.gender || "—")}</p>
            ${user.email ? `<p class="info-card__meta"><a href="mailto:${escapeHTML(user.email)}" class="info-card__link">${escapeHTML(user.email)}</a></p>` : ""}
            ${user.phone ? `<p class="info-card__meta">${escapeHTML(user.phone)}</p>` : ""}
        </div>
        <div class="info-card__desc">
            ${user.note ? `<p>${escapeHTML(user.note)}</p>` : "<p>No additional notes.</p>"}
        </div>
    `;

    teacherInfoBody.dataset.userIndex = allUsers.indexOf(user);
    teacherInfoModal.classList.add("is-active");
}

function closeModals() {
    addTeacherModal?.classList.remove("is-active");
    teacherInfoModal?.classList.remove("is-active");
}

window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModals();
});

// Search Form Handling
searchForm?.addEventListener("submit", (e) => {
    e.preventDefault();
    applyFilters();
});

searchInput?.addEventListener("input", () => {
    if (searchInput.value.trim() === "") {
        applyFilters();
    }
});

const addTeacherForm = document.querySelector(".modal--form .form");
const teacherFields = {
    full_name: "name",
    country: "country",
    city: "city",
    state: "state",
    email: "email",
    phone: "phone",
    age: "b_date",
    note: "note",
};
let teacherFormSubmitted = false;

// Read the form values.
function readTeacherForm() {
    const fields = addTeacherForm.elements;
    const gender = capitalize(fields.sex.value);

    return {
        gender,
        title: gender === "Male" ? "Mr" : "Ms",
        full_name: fields.name.value.trim(),
        city: fields.city.value.trim(),
        state: fields.state.value.trim(),
        country: fields.country.value,
        postcode: null,
        coordinates: null,
        timezone: null,
        email: fields.email.value.trim(),
        b_date: fields.b_date.value || null,
        age: getAge(fields.b_date.value),
        phone: fields.phone.value.trim(),
        picture_large: null,
        picture_thumbnail: null,
        id: `user-${Date.now()}`,
        favorite: false,
        course: fields.course.value,
        bg_color: fields.bg_color.value,
        note: fields.note.value.trim() || "No additional notes.",
    };
}

// Show errors below the fields.
function showTeacherErrors(errors) {
    Object.entries(teacherFields).forEach(([key, name]) => {
        const field = addTeacherForm.elements[name];
        const error = document.getElementById(`${field.id}-error`);
        const message = errors[key] || "";
        field.setAttribute("aria-invalid", String(!!message));
        error.textContent = message;
        error.hidden = !message;
    });
}

// Check the fields again after editing.
addTeacherForm.addEventListener("input", () => {
    if (teacherFormSubmitted) {
        showTeacherErrors(getUserErrors(readTeacherForm()));
    }
});

// Add the teacher if all fields are valid.
addTeacherForm.addEventListener("submit", (e) => {
    e.preventDefault();
    teacherFormSubmitted = true;
    const newUser = readTeacherForm();
    const errors = getUserErrors(newUser);
    showTeacherErrors(errors);

    if (Object.keys(errors).length) {
        addTeacherForm.querySelector('[aria-invalid="true"]').focus();
        return;
    }

    allUsers.push(newUser);
    refreshUsers();
    closeModals();
    addTeacherForm.reset();
    teacherFormSubmitted = false;
});

// Keep the same seed and advance only after a successful request.
async function loadUsers(initial = false) {
    if (isLoadingUsers) return;
    isLoadingUsers = true;
    retryLoad.hidden = true;
    showMoreTeachers.disabled = true;
    loadStatus.textContent = "Loading teachers...";
    teachersGrid.setAttribute("aria-busy", "true");
    try {
        const data = await fetchUsers(initial ? 50 : 10, initial ? 1 : nextPage, requestSeed);
        const existingIds = new Set(allUsers.map((user) => user.id));
        const newUsers = formatAndMergeUsers(data.results);
        allUsers.push(...newUsers.filter((user) => !existingIds.has(user.id)));
        initialLoaded = true;
        nextPage = initial ? 6 : nextPage + 1;
        refreshUsers();
        loadStatus.textContent = "";
    } catch (error) {
        loadStatus.textContent = "Could not load teachers. Please try again.";
        retryLoad.hidden = false;
        console.error(error);
    } finally {
        isLoadingUsers = false;
        showMoreTeachers.disabled = false;
        showMoreTeachers.hidden = !initialLoaded;
        teachersGrid.setAttribute("aria-busy", "false");
    }
}

retryLoad.addEventListener("click", () => loadUsers(!initialLoaded));
renderStatsTable();
renderFavorites();
loadUsers(true);
