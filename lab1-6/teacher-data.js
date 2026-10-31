// Data normalization, validation and collection helpers use Lodash.
export const COURSES = [
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

export function getAge(birthDate) {
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
    const formattedRawUsers = _.map(rawUsers, (user) => {
        return {
            gender: user.gender ? _.upperFirst(user.gender) : null,
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

    const normalizedExtraUsers = _.map(extraUsers, (user) => {
        return {
            gender: user.gender ? _.upperFirst(user.gender) : null,
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
            course: _.find(COURSES, (course) => course.toLowerCase() === user.course?.toLowerCase()) || getRandomCourse(),
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
export function getUserErrors(user) {
    const errors = {};
    const textFields = ["full_name", "gender", "note", "state", "city", "country"];

    textFields.forEach((field) => {
        const value = user[field];
        if (!_.isString(value) || !_.trim(value)) {
            errors[field] = "This field is required.";
        } else if (!/^\p{Lu}/u.test(_.trim(value))) {
            errors[field] = "Start with a capital letter.";
        }
    });

    if (!_.isFinite(user.age) || user.age < 0) {
        errors.age = "Enter a valid birth date that is not in the future.";
    }
    if (!_.isString(user.email) || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user.email)) {
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
    const phone = _.isString(user.phone) ? user.phone.replace(/[\s()-]/g, "") : "";
    if (!_.isString(user.phone) || !/^\+?[\d\s()-]+$/.test(user.phone) || !phoneFormat.test(phone)) {
        errors.phone = `Enter a valid phone number for ${user.country || "the selected country"}.`;
    }

    return errors;
}

// Check user fields.
export function validateUser(user) {
    return _.isPlainObject(user) && _.isEmpty(getUserErrors(user));
}

// Filter users
export function filterUsers(users, filters = {}) {
    return _.filter(users, (user) => {
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
    const field = sortBy === "b_day" ? "b_date" : sortBy;
    const direction = _.toLower(order) === "desc" ? "desc" : "asc";

    function getSortValue(user) {
        const value = user[field] ?? (field === "b_date" ? user.b_day : null);
        if (value == null) return null;
        if (field === "b_date") {
            const timestamp = new Date(value).getTime();
            return _.isFinite(timestamp) ? timestamp : null;
        }
        return _.isNumber(value) ? value : _.deburr(_.toLower(value));
    }

    // Missing values stay at the end in either direction.
    return _.orderBy(users, [
        (user) => getSortValue(user) === null,
        getSortValue,
    ], ["asc", direction]);
}

// Find a user
export function findUser(users, query) {
    if (query === undefined || query === null) return null;

    const normalizedQuery = _.toLower(_.trim(query));
    if (!normalizedQuery) return null;

    return (
        _.find(users, (user) => {
            if (typeof query === "number" && user.age === query) return true;
            if (user.full_name && _.includes(_.toLower(user.full_name), normalizedQuery)) return true;
            if (user.note && _.includes(_.toLower(user.note), normalizedQuery)) return true;
            if (String(user.age) === normalizedQuery) return true;
            return false;
        }) || null
    );
}

// Count matching users
export function getPercentageByCondition(users, predicate) {
    if (!_.isArray(users) || users.length === 0) return 0;

    let matchingCount = 0;

    if (typeof predicate === "function") {
        matchingCount = _.filter(users, predicate).length;
    } else if (predicate !== undefined && predicate !== null) {
        matchingCount = _.filter(users, (user) => findUser([user], predicate)).length;
    }

    const percentage = (matchingCount / users.length) * 100;
    return Number(percentage.toFixed(2));
}

