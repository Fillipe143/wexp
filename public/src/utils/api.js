class ApiClient {
    constructor(baseURL = "/api/v1") {
        this.baseURL = baseURL;
    }

    async request(path, options = {}) {
        const url = this.baseURL + path;

        const res = await fetch(url, {
            headers: {
                "Content-Type": "application/json",
                ...(options.headers || {})
            },
            ...options
        });

        if (!res.ok) {
            const errorText = await res.text();
            throw new Error(errorText || "API Error");
        }

        return res.json();
    }

    games = {
        featured: () => this.request("/games/featured"),

        search: (q) =>
            this.request(`/games/search?q=${encodeURIComponent(q)}`),

        get: (id) =>
            this.request(`/games/${id}`),

        achievements: (id) =>
            this.request(`/games/${id}/achievements`)
    };
}

export const api = new ApiClient();
