class ApiClient {
    constructor(baseURL = "/api/v1") {
        this.baseURL = baseURL;
    }

    async request(path, options = {}) {
        const res = await fetch(this.baseURL + path, {
            headers: {
                "Content-Type": "application/json",
                ...(options.headers || {})
            },
            ...options
        });

        if (!res.ok) {
            throw new Error(await res.text());
        }

        return res.json();
    }

    counter = {
        get: () => this.request("/counter"),
        add: () => this.request("/counter", { method: "POST" })
    };
}

export const api = new ApiClient();
