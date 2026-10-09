import { randomUserMock, additionalUsers } from "./FE4U-Lab2-mock.js";

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
export function formatAndMergeUsers(rawUsers, extraUsers) {
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
            age: user.dob?.age ?? null,
            phone: user.phone || null,
            picture_large: user.picture?.large || null,
            picture_thumbnail: user.picture?.thumbnail || null,

            id: (user.id?.name && user.id?.value)
                ? `${user.id.name}${user.id.value}`
                : (user.login?.uuid || `user-${Math.random()}`),
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
        const key = user.full_name.toLowerCase().trim() || user.email?.toLowerCase().trim() || user.id;

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

// Check user fields
export function validateUser(user) {
    if (!user || typeof user !== "object") return false;

    const isCapitalizedString = (val) =>
        typeof val === "string" && /^\p{Lu}/u.test(val.trim());

    const textFields = ["full_name", "gender", "note", "state", "city", "country"];
    if (!textFields.every((field) => isCapitalizedString(user[field]))) return false;
    if (typeof user.age !== "number" || !Number.isFinite(user.age) || user.age < 0) return false;
    if (typeof user.email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user.email)) return false;
    if (typeof user.phone !== "string" || !/^\+?[\d\s()-]+$/.test(user.phone)) return false;

    const phone = user.phone.replace(/[\s()-]/g, "");
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
    if (!phoneFormat.test(phone)) return false;

    return true;
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

let allUsers = formatAndMergeUsers(randomUserMock, additionalUsers);
let displayedUsers = [...allUsers];
const ROWS_PER_PAGE = 10;
let currentPage = 1;
let visibleTeachers = 10;
let sortField = "";
let sortOrder = "asc";

// DOM Selectors
const teachersGrid = document.getElementById("teachersGrid");
const showMoreTeachers = document.getElementById("showMoreTeachers");
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
const filterRegion = document.getElementById("filter-region");
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

favoritesPrev?.addEventListener("click", () => scrollFavorites(-1));
favoritesNext?.addEventListener("click", () => scrollFavorites(1));
favoritesContainer?.addEventListener("scroll", updateCarouselButtons);
window.addEventListener("resize", updateCarouselButtons);

// Render Top Teachers Grid
function renderTeachersGrid() {
    if (!teachersGrid) return;
    teachersGrid.innerHTML = "";
    const topTeachers = displayedUsers.slice(0, visibleTeachers);
    showMoreTeachers.hidden = visibleTeachers >= displayedUsers.length;

    if (!topTeachers.length) {
        teachersGrid.innerHTML = '<p class="empty-message">No teachers found.</p>';
    }

    topTeachers.forEach((user, idx) => {
        const card = document.createElement("div");
        card.className = "teacher-card";
        card.setAttribute("data-user-index", idx);

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

        card.addEventListener("click", () => openTeacherInfo(user));
        teachersGrid.appendChild(card);
    });
}

showMoreTeachers.addEventListener("click", () => {
    visibleTeachers += 10;
    renderTeachersGrid();
});

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

        card.addEventListener("click", () => openTeacherInfo(user));
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
        statsTableBody.innerHTML = '<tr><td colspan="5">No teachers found.</td></tr>';
    }
    document.getElementById("statsSummary").textContent = `${displayedUsers.length} teachers (${getPercentageByCondition(allUsers, (user) => displayedUsers.includes(user))}% of all teachers)`;

    pageUsers.forEach((user) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${escapeHTML(user.full_name)}</td>
            <td>${escapeHTML(user.course || "—")}</td>
            <td>${user.age ?? "—"}</td>
            <td>${escapeHTML(user.gender || "—")}</td>
            <td>${escapeHTML(user.country || "—")}</td>
        `;
        tr.style.cursor = "pointer";
        tr.addEventListener("click", () => openTeacherInfo(user));
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
        a.addEventListener("click", (e) => {
            e.preventDefault();
            currentPage = i;
            renderStatsTable();
        });
        paginationNav.appendChild(a);
    }
}

// Apply Filters to the Displayed List
function applyFilters(resetVisible = true) {
    const filters = {};
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

    // Filter by Region
    if (filterRegion) {
        const regionVal = filterRegion.value;
        const europeanCountries = ["germany", "ireland", "finland", "turkey", "switzerland", "norway", "spain", "denmark", "france", "netherlands", "uk", "ukraine"];
        const asianCountries = ["iran", "india", "china", "japan"];
        const americanCountries = ["united states", "canada", "brazil", "usa"];

        if (regionVal === "Europe") filtered = filtered.filter((u) => europeanCountries.includes(u.country?.toLowerCase()));
        else if (regionVal === "Asia") filtered = filtered.filter((u) => asianCountries.includes(u.country?.toLowerCase()));
        else if (regionVal === "Americas") filtered = filtered.filter((u) => americanCountries.includes(u.country?.toLowerCase()));
    }

    // Filter by Photo availability
    if (filterPhoto && filterPhoto.checked) {
        filtered = filtered.filter((u) => u.picture_large || u.picture_thumbnail);
    }

    const query = searchInput?.value.trim();
    if (query) filtered = filtered.filter((user) => findUser([user], query));
    if (sortField) filtered = sortUsers(filtered, sortField, sortOrder);

    displayedUsers = filtered;
    if (resetVisible !== false) visibleTeachers = 10;
    currentPage = 1;
    renderTeachersGrid();
    renderStatsTable();
}

// Event Listeners for Filter Inputs
[filterAge, filterRegion, filterSex].forEach((el) => el?.addEventListener("change", applyFilters));
filterPhoto?.addEventListener("change", applyFilters);
filterFavorite?.addEventListener("change", applyFilters);

document.querySelectorAll(".stats-table th[data-sort]").forEach((header) => {
    header.querySelector("button").addEventListener("click", () => {
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
    });
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

    const favBtn = document.getElementById("toggleFavBtn");
    favBtn?.addEventListener("click", () => {
        user.favorite = !user.favorite;
        favBtn.textContent = user.favorite ? "★" : "☆";
        favBtn.style.color = user.favorite ? "#f7ca18" : "#ccc";
        favBtn.setAttribute("aria-pressed", String(user.favorite));

        // Update the cards.
        applyFilters(false);
        renderFavorites();
    });

    teacherInfoModal.classList.add("is-active");
}

function closeModals() {
    addTeacherModal?.classList.remove("is-active");
    teacherInfoModal?.classList.remove("is-active");
}

document.getElementById("openAddTeacherBtn")?.addEventListener("click", () => addTeacherModal?.classList.add("is-active"));
document.getElementById("openAddTeacherFooterBtn")?.addEventListener("click", () => addTeacherModal?.classList.add("is-active"));
document.getElementById("closeAddTeacherModalBtn")?.addEventListener("click", closeModals);
document.getElementById("closeTeacherInfoModalBtn")?.addEventListener("click", closeModals);

window.addEventListener("click", (e) => {
    if (e.target === addTeacherModal || e.target === teacherInfoModal) closeModals();
});
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

// Add Teacher Form Submission
document.querySelector(".modal--form .form")?.addEventListener("submit", (e) => {
    e.preventDefault();
    const form = e.target;

    const nameInput = form.querySelector('input[placeholder="Enter name"]');
    const specialitySelect = form.querySelectorAll(".form__select")[0];
    const countrySelect = form.querySelectorAll(".form__select")[1];
    const cityInput = form.querySelectorAll('.form__row input[type="text"]')[0];
    const stateInput = form.elements.state;
    const emailInput = form.querySelector('input[type="email"]');
    const phoneInput = form.querySelector('input[type="tel"]');
    const dobInput = form.querySelector('input[type="date"]');
    const sexRadio = form.querySelector('input[name="sex"]:checked');
    const colorInput = form.querySelector(".form__color-input");
    const textarea = form.querySelector(".form__textarea");

    const birthDate = dobInput?.value || null;
    const computedAge = getAge(birthDate);

    const newUser = {
        gender: sexRadio?.value ? capitalize(sexRadio.value) : "Male",
        title: sexRadio?.value === "male" ? "Mr" : "Ms",
        full_name: nameInput?.value.trim() || "",
        city: cityInput?.value.trim() || null,
        state: stateInput.value.trim(),
        country: countrySelect?.value || null,
        postcode: null,
        coordinates: null,
        timezone: null,
        email: emailInput?.value.trim() || null,
        b_date: birthDate,
        age: computedAge,
        phone: phoneInput?.value.trim() || null,
        picture_large: null,
        picture_thumbnail: null,
        id: `user-${Date.now()}`,
        favorite: false,
        course: specialitySelect?.value || getRandomCourse(),
        bg_color: colorInput?.value || "#ffffff",
        note: textarea?.value.trim() || "No additional notes.",
    };

    const error = document.getElementById("addTeacherError");
    if (!validateUser(newUser)) {
        error.textContent = "Start name, state, city and notes with a capital letter. Check the email, birth date and phone format for the selected country.";
        return;
    }
    error.textContent = "";
    allUsers.push(newUser);
    applyFilters();
    renderFavorites();
    closeModals();
    form.reset();
});

// Initial Render
renderTeachersGrid();
renderStatsTable();
renderFavorites();
