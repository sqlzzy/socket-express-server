export function createError(text) {
    const spanError = document.createElement('span');
    spanError.textContent = text;
    spanError.style.color = 'red';
    spanError.style.marginLeft = '12px';
    spanError.setAttribute('id', 'error-message');

    return spanError;
}
