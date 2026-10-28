import { fetchUsers, saveTeacher } from "./api.js";
import { showTeacherMap, removeTeacherMap } from "./teacher-map.js";
import { renderStatisticsChart } from "./statistics-chart.js";
import { getDaysUntilBirthday } from "./birthday.js";

import {
    formatAndMergeUsers, getAge, getUserErrors, filterUsers, sortUsers,
    findUser,
} from "./teacher-data.js";

export {
    formatAndMergeUsers, validateUser, filterUsers, sortUsers,
    findUser, getPercentageByCondition,
} from "./teacher-data.js";

// Page content

let allUsers = [];
let displayedUsers = [...allUsers];
const requestSeed = crypto.randomUUID();
let nextPage = 6; // The first 50 users cover five pages of 10.
let initialLoaded = false;
let isLoadingUsers = false;

// DOM Selectors
const teachersGrid = document.getElementById("teachersGrid");
const showMoreTeachers = document.getElementById("showMoreTeachers");
const loadStatus = document.getElementById("loadStatus");
const retryLoad = document.getElementById("retryLoad");
const favoritesContainer = document.getElementById("favoritesTrack");
const favoritesPrev = document.getElementById("favoritesPrev");
const favoritesNext = document.getElementById("favoritesNext");
const teacherInfoBody = document.getElementById("teacherInfoBody");
const addTeacherModal = document.getElementById("addTeacherModal");
const teacherInfoModal = document.getElementById("teacherInfoModal");
const searchInput = document.querySelector(".search-form__input");
const searchForm = document.querySelector(".search-form");
const teacherSort = document.getElementById("teacherSort");
const teacherSortOrder = document.getElementById("teacherSortOrder");

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

    const favorites = _.filter(allUsers, (u) => u.favorite);

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

// Fill the country list.
function renderCountryFilter() {
    const selectedCountry = filterCountry.value;
    const countries = _.sortBy(_.uniq(_.compact(_.map(allUsers, "country"))));
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
        if (ageVal === "18-31") filtered = _.filter(filtered, (u) => u.age >= 18 && u.age <= 31);
        else if (ageVal === "32-45") filtered = _.filter(filtered, (u) => u.age >= 32 && u.age <= 45);
        else if (ageVal === "46+") filtered = _.filter(filtered, (u) => u.age >= 46);
    }

    // Filter by Photo availability
    if (filterPhoto && filterPhoto.checked) {
        filtered = _.filter(filtered, (u) => u.picture_large || u.picture_thumbnail);
    }

    const query = searchInput?.value.trim();
    if (query) filtered = _.filter(filtered, (user) => findUser([user], query));
    if (teacherSort.value) filtered = sortUsers(filtered, teacherSort.value, teacherSortOrder.value);

    displayedUsers = filtered;
    renderTeachersGrid();
    renderStatisticsChart(displayedUsers, allUsers);
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

    const teacher = target.closest(".teacher-card[data-user-index]");
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

    const birthdayDays = getDaysUntilBirthday(user.b_date);
    const birthdayMessage = birthdayDays === null ? "Birthday is not available." :
        birthdayDays === 0 ? "Birthday is today!" :
        `${birthdayDays} ${birthdayDays === 1 ? "day" : "days"} until next birthday.`;

    removeTeacherMap();
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
            <p class="info-card__meta" id="birthdayCountdown">${birthdayMessage}</p>
            ${user.email ? `<p class="info-card__meta"><a href="mailto:${escapeHTML(user.email)}" class="info-card__link">${escapeHTML(user.email)}</a></p>` : ""}
            ${user.phone ? `<p class="info-card__meta">${escapeHTML(user.phone)}</p>` : ""}
        </div>
        <div class="info-card__desc">
            ${user.note ? `<p>${escapeHTML(user.note)}</p>` : "<p>No additional notes.</p>"}
        </div>
        <div class="teacher-map" id="teacherMap" aria-label="Teacher location"></div>
    `;

    teacherInfoBody.dataset.userIndex = allUsers.indexOf(user);
    teacherInfoModal.classList.add("is-active");
    showTeacherMap(user.coordinates);
}

function closeModals() {
    removeTeacherMap();
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
let isSavingTeacher = false;
const teacherSaveStatus = document.getElementById("teacherSaveStatus");
const submitTeacher = addTeacherForm.querySelector('[type="submit"]');

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
addTeacherForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (isSavingTeacher) return;
    teacherSaveStatus.textContent = "";
    teacherFormSubmitted = true;
    const newUser = readTeacherForm();
    const errors = getUserErrors(newUser);
    showTeacherErrors(errors);

    if (Object.keys(errors).length) {
        addTeacherForm.querySelector('[aria-invalid="true"]').focus();
        return;
    }

    isSavingTeacher = true;
    submitTeacher.disabled = true;
    submitTeacher.textContent = "Saving...";
    addTeacherForm.setAttribute("aria-busy", "true");
    try {
        const savedUser = await saveTeacher(newUser);
        allUsers.push(savedUser);
        refreshUsers();
        closeModals();
        addTeacherForm.reset();
        showTeacherErrors({});
        teacherFormSubmitted = false;
    } catch (error) {
        teacherSaveStatus.textContent = "Could not save teacher. Check that the local server is running and try again.";
        console.error(error);
    } finally {
        isSavingTeacher = false;
        submitTeacher.disabled = false;
        submitTeacher.textContent = "Add";
        addTeacherForm.setAttribute("aria-busy", "false");
    }
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
        const newUsers = formatAndMergeUsers(data.results);
        allUsers = _.unionBy(allUsers, newUsers, "id");
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
renderStatisticsChart(displayedUsers, allUsers);
renderFavorites();
loadUsers(true);
