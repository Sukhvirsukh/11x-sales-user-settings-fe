

export function forgotPasswordRequest(email: string) {
    return fetch("/auth/forgot-password", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
    });
}