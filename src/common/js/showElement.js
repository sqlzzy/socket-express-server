export default function showElement(element) {
  if (element.classList.contains("hide")) {
    element.classList.remove("hide");
  }

  element.classList.add("show");
}
