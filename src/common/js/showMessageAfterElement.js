export default function showMessageAfterElement(text, element) {
  const spanMessage = document.createElement("span");
  spanMessage.textContent = text;
  spanMessage.style.color = "#000000";
  spanMessage.style.marginTop = "12px";
  spanMessage.style.position = "absolute";
  spanMessage.style.bottom = "0";
  spanMessage.setAttribute("id", "info-message");

  element.insertAdjacentElement("afterend", spanMessage);
}
