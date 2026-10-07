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

// ============================================================================
// TASK 1: Format and Merge User Objects
// ============================================================================
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
            age: user.age ?? (user.b_day ? Math.floor((Date.now() - new Date(user.b_day).getTime()) / (365.25 * 24 * 60 * 60 * 1000)) : null),
            phone: user.phone || null,
            picture_large: user.picture_large || null,
            picture_thumbnail: user.picture_thumbnail || null,

            id: user.id || `user-${Math.random()}`,
            favorite: user.favorite ?? false,
            course: user.course || getRandomCourse(),
            bg_color: user.bg_color || "#ffffff",
            note: user.note || null,
        };
    });

    const userMap = new Map();

    [...formattedRawUsers, ...normalizedExtraUsers].forEach((user) => {
        const key = user.full_name.toLowerCase().trim() || user.email?.toLowerCase().trim();

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
                note: user.note || existing.note,
                favorite: existing.favorite || user.favorite,
                course: existing.course || user.course,
                bg_color: user.bg_color || existing.bg_color,
            });
        }
    });

    return Array.from(userMap.values());
}

// ============================================================================
// TASK 2: Validate User Object
// ============================================================================
export function validateUser(user) {
    if (!user || typeof user !== "object") return false;

    const isCapitalizedString = (val) =>
        typeof val === "string" && val.length > 0 && /^[A-ZА-ЯЁІЇЄ]/.test(val.trim());

    if (!isCapitalizedString(user.full_name)) return false;
    if (!isCapitalizedString(user.gender)) return false;
    if (user.note && !isCapitalizedString(user.note)) return false;
    if (user.state && !isCapitalizedString(user.state)) return false;
    if (user.city && !isCapitalizedString(user.city)) return false;
    if (user.country && !isCapitalizedString(user.country)) return false;

    if (typeof user.age !== "number" || isNaN(user.age) || user.age <= 0) return false;

    if (typeof user.email !== "string" || !user.email.includes("@")) return false;

    if (typeof user.phone !== "string" || user.phone.trim().length === 0) return false;

    return true;
}

// ============================================================================
// TASK 3: Filter Users by Multiple Parameters (Logical AND)
// ============================================================================
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

// ============================================================================
// TASK 4: Sort Users by a Given Parameter (asc / desc)
// ============================================================================
export function sortUsers(users, sortBy, order = "asc") {
    const multiplier = order.toLowerCase() === "desc" ? -1 : 1;

    return [...users].sort((a, b) => {
        let valA = a[sortBy] ?? a[sortBy === "b_date" ? "b_day" : sortBy];
        let valB = b[sortBy] ?? b[sortBy === "b_date" ? "b_day" : sortBy];

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

// ============================================================================
// TASK 5: Find User by Search Query
// ============================================================================
export function findUser(users, query) {
    if (query === undefined || query === null) return null;

    const normalizedQuery = String(query).trim().toLowerCase();

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

// ============================================================================
// TASK 6: Calculate Percentage Matching Condition
// ============================================================================
export function getPercentageByCondition(users, predicate) {
    if (!Array.isArray(users) || users.length === 0) return 0;

    let matchingCount = 0;

    if (typeof predicate === "function") {
        matchingCount = users.filter(predicate).length;
    } else {
        const q = String(predicate).toLowerCase();
        matchingCount = users.filter((u) => {
            return (
                String(u.age) === q ||
                u.full_name?.toLowerCase().includes(q) ||
                u.note?.toLowerCase().includes(q)
            );
        }).length;
    }

    const percentage = (matchingCount / users.length) * 100;
    return Number(percentage.toFixed(2));
}

// ============================================================================
// DOM RENDERING & APP LOGIC
// ============================================================================

let allUsers = formatAndMergeUsers(randomUserMock, additionalUsers);
let displayedUsers = [...allUsers];
const ROWS_PER_PAGE = 10;
let currentPage = 1;

const teachersGrid = document.getElementById("teachersGrid");
const statsTableBody = document.getElementById("statsTableBody");
const teacherInfoBody = document.getElementById("teacherInfoBody");
const addTeacherModal = document.getElementById("addTeacherModal");
const teacherInfoModal = document.getElementById("teacherInfoModal");
const searchInput = document.querySelector(".search-form__input");
const searchForm = document.querySelector(".search-form");
const paginationNav = document.querySelector(".pagination");

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

function renderTeachersGrid() {
    if (!teachersGrid) return;
    teachersGrid.innerHTML = "";
    const topTeachers = displayedUsers.slice(0, 10);

    topTeachers.forEach((user, idx) => {
        const card = document.createElement("div");
        card.className = "teacher-card";
        card.setAttribute("data-user-index", idx);

        const { first, last } = splitName(user.full_name);

        let avatarHTML;
        if (user.picture_large || user.picture_thumbnail) {
            const src = user.picture_thumbnail || user.picture_large;
            avatarHTML = `
                <div class="teacher-card__avatar-wrap">
                    ${user.favorite ? '<span class="teacher-card__star">★</span>' : ""}
                    <img src="${src}" alt="${user.full_name}" class="teacher-card__avatar">
                </div>`;
        } else {
            avatarHTML = `
                <div class="teacher-card__avatar-wrap teacher-card__avatar-wrap--text">
                    ${user.favorite ? '<span class="teacher-card__star">★</span>' : ""}
                    <span>${getInitials(user.full_name)}</span>
                </div>`;
        }

        card.innerHTML = `
            ${avatarHTML}
            <h3 class="teacher-card__name">${first}<br>${last}</h3>
            <p class="teacher-card__subject">${user.course || ""}</p>
            <p class="teacher-card__country">${user.country || ""}</p>
        `;

        card.addEventListener("click", () => openTeacherInfo(user));
        teachersGrid.appendChild(card);
    });
}

function renderStatsTable() {
    if (!statsTableBody) return;
    statsTableBody.innerHTML = "";

    const totalPages = Math.max(1, Math.ceil(displayedUsers.length / ROWS_PER_PAGE));
    if (currentPage > totalPages) currentPage = totalPages;
    const start = (currentPage - 1) * ROWS_PER_PAGE;
    const pageUsers = displayedUsers.slice(start, start + ROWS_PER_PAGE);

    pageUsers.forEach((user) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${user.full_name}</td>
            <td>${user.course || "—"}</td>
            <td>${user.age ?? "—"}</td>
            <td>${user.gender || "—"}</td>
            <td>${user.country || "—"}</td>
        `;
        tr.style.cursor = "pointer";
        tr.addEventListener("click", () => openTeacherInfo(user));
        statsTableBody.appendChild(tr);
    });

    renderPagination(totalPages);
}

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

function openTeacherInfo(user) {
    if (!teacherInfoBody || !teacherInfoModal) return;

    let photoHTML;
    if (user.picture_large) {
        photoHTML = `
            <div class="info-card__photo-box">
                <img src="${user.picture_large}" alt="${user.full_name}" class="info-card__img">
            </div>`;
    } else {
        photoHTML = `
            <div class="info-card__photo-box" style="display:flex;align-items:center;justify-content:center;
                background:#f0f0f0;font-size:48px;font-weight:700;color:#f75c48;">
                ${getInitials(user.full_name)}
            </div>`;
    }

    teacherInfoBody.innerHTML = `
        ${photoHTML}
        <div class="info-card__header">
            <div class="info-card__name-row">
                <h2 class="info-card__name">${user.full_name}</h2>
                <button class="info-card__star-btn" aria-label="Favorite" id="toggleFavBtn">
                    ${user.favorite ? "★" : "☆"}
                </button>
            </div>
            <h4 class="info-card__subject">${user.course || ""}</h4>
            <p class="info-card__meta">${[user.city, user.country].filter(Boolean).join(", ") || "—"}</p>
            <p class="info-card__meta">${user.age ?? "—"}, ${user.gender || "—"}</p>
            ${user.email ? `<p class="info-card__meta"><a href="mailto:${user.email}" class="info-card__link">${user.email}</a></p>` : ""}
            ${user.phone ? `<p class="info-card__meta">${user.phone}</p>` : ""}
        </div>
        <div class="info-card__desc">
            ${user.note ? `<p>${user.note}</p>` : "<p>No additional notes.</p>"}
        </div>
    `;

    const favBtn = document.getElementById("toggleFavBtn");
    favBtn?.addEventListener("click", () => {
        user.favorite = !user.favorite;
        favBtn.textContent = user.favorite ? "★" : "☆";
        renderTeachersGrid();
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

// Search
searchForm?.addEventListener("submit", (e) => {
    e.preventDefault();
    const query = searchInput?.value.trim();
    if (!query) {
        displayedUsers = [...allUsers];
    } else {
        displayedUsers = allUsers.filter((user) => {
            const q = query.toLowerCase();
            return (
                user.full_name?.toLowerCase().includes(q) ||
                user.note?.toLowerCase().includes(q) ||
                String(user.age) === q
            );
        });
    }
    currentPage = 1;
    renderTeachersGrid();
    renderStatsTable();
});

searchInput?.addEventListener("input", () => {
    if (searchInput.value.trim() === "") {
        displayedUsers = [...allUsers];
        currentPage = 1;
        renderTeachersGrid();
        renderStatsTable();
    }
});

// Add Teacher Form
document.querySelector(".modal--form .form")?.addEventListener("submit", (e) => {
    e.preventDefault();
    const form = e.target;

    const nameInput = form.querySelector('input[placeholder="Enter name"]');
    const specialitySelect = form.querySelectorAll(".form__select")[0];
    const countrySelect = form.querySelectorAll(".form__select")[1];
    const cityInput = form.querySelectorAll('.form__row input[type="text"]')[0];
    const emailInput = form.querySelector('input[type="email"]');
    const phoneInput = form.querySelector('input[type="tel"]');
    const dobInput = form.querySelector('input[type="date"]');
    const sexRadio = form.querySelector('input[name="sex"]:checked');
    const colorInput = form.querySelector(".form__color-input");
    const textarea = form.querySelector(".form__textarea");

    const birthDate = dobInput?.value || null;
    let computedAge = null;
    if (birthDate) {
        const diff = Date.now() - new Date(birthDate).getTime();
        computedAge = Math.floor(diff / (365.25 * 24 * 60 * 60 * 1000));
    }

    const newUser = {
        gender: sexRadio?.value ? capitalize(sexRadio.value) : "Male",
        title: sexRadio?.value === "male" ? "Mr" : "Ms",
        full_name: nameInput?.value.trim() || "",
        city: cityInput?.value.trim() || null,
        state: null,
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
        note: textarea?.value.trim() || null,
    };

    allUsers.push(newUser);
    displayedUsers = [...allUsers];
    currentPage = 1;

    renderTeachersGrid();
    renderStatsTable();
    closeModals();
    form.reset();
});

// Initial load
renderTeachersGrid();
renderStatsTable();