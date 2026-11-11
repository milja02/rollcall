const SAFE_METHODS = ["GET", "HEAD", "OPTIONS"];

export class ApiError extends Error{
    constructor(status, data) {
        super(errorMessage({ data, message: "Request failed." }));
        this.status = status;
        this.data = data;
    }
}

export function readCookie(name){
    const match = document.cookie.split("; ").find((row)=>row.startsWith(`${name}=`));
    return match ? decodeURIComponent(match.split("=")[1]) : null;
}

async function ensureCsrfCookie(){
    if(!readCookie("csrftoken")){
        await fetch("/api/auth/csrf/", {credentials: "same-origin"});
    }
}

export async function api(path, {method = "GET", body} = {}){
    const unsafe =!SAFE_METHODS.includes(method);
    if (unsafe) await ensureCsrfCookie();

    const response = await fetch(`/api${path}`, {
        method,
        credentials: "same-origin",
        headers: {
        Accept: "application/json",
        ...(body ? { "Content-Type": "application/json" } : {}),
        ...(unsafe ? { "X-CSRFToken": readCookie("csrftoken") } : {}),
        },
        body: body ? JSON.stringify(body) : undefined
    });

    if (response.status === 204) return null;
    const data = await response.json().catch(() => null);
    if (!response.ok) throw new ApiError(response.status, data);
    return data;
}

export function errorMessage(error) {
    const data = error?.data;
    if (typeof data?.detail === "string") return data.detail;
    if (data && typeof data === "object") {
    return Object.entries(data)
    .map(([field, value]) => `${field}: ${[].concat(value).join(" ")}`)
    .join(" ");
    }
    return error?.message ?? "Something went wrong.";
}