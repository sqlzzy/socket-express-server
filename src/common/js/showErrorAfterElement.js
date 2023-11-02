export default function showErrorAfterElement(text, element) {
  const spanError = document.createElement("span");
  spanError.textContent = text;
  spanError.style.color = "#ff0000cc";
  spanError.style.marginTop = "12px";
  spanError.style.position = "absolute";
  spanError.style.bottom = "0";
  spanError.setAttribute("id", "error-message");

  element.insertAdjacentElement("afterend", spanError);
}
