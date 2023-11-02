export default function hideElement(element) {
  if (element.classList.contains("show")) {
    element.classList.remove("show");
  }

  element.classList.add("hide");
}
