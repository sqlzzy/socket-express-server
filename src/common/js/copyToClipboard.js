export function copyToClipboard(text, button) {
    button.addEventListener('click', () => {
        navigator.clipboard.writeText(text);
    });
}