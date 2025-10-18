export function sendNotification(message: string) {
    localStorage.setItem("notification", message);
    window.location.reload();
}