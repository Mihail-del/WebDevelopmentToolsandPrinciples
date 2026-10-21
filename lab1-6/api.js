const RANDOM_USER_URL = "https://randomuser.me/api/";

export async function fetchUsers(results = 50, page = 1, seed = "") {
    const url = new URL(RANDOM_USER_URL);
    url.searchParams.set("results", results);
    url.searchParams.set("page", page);
    if (seed) url.searchParams.set("seed", seed);

    const response = await fetch(url, { signal: AbortSignal.timeout(15000) });
    if (!response.ok) throw new Error(`Could not load teachers (HTTP ${response.status}).`);

    const data = await response.json();
    if (!Array.isArray(data.results) || data.results.length !== results) {
        throw new Error("The server returned an invalid teacher list.");
    }
    return data;
}
