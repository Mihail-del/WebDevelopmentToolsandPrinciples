# Teachinder — Lab 4

## Run

Requires Node.js and npm.

```sh
cd lab1-6
npm ci
npm start
```

Open http://localhost:3000 in a browser. The same server serves the website
and accepts `POST /teachers`. Internet access is required for Random User API.

## Lab 4 tasks

- **1:** Load 50 teachers from Random User API using `fetch` and `async/await`.
- **2:** Normalize API users; filter, search and sort the loaded list. Statistics
  always reflect the current selection. The add form validates each field.
- **4:** “Next 10 teachers” requests another 10 users and appends them to the
  list. A session seed and page counter keep requests consistent. Active filters
  and sorting also apply to new users; clear them to see all loaded teachers.
- **5 (optional):** Submit validated form data to local `json-server`. Add the
  returned teacher to the page only after a successful POST. Show a message and
  retain form values on failure. Saved teachers are stored in `db.json`;
  the initial list on page reload comes from Random User API.

The initial request covers 50 users. Subsequent requests use `results=10`,
starting at page 6. Failed requests can be retried without advancing the page.
The numbered pagination in Statistics navigates already loaded rows.

`FE4U-Lab2-mock.js` remains as the original Lab 2 material; Lab 4 does not import it.
