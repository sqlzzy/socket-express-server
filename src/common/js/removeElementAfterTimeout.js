export default function removeElementAfterTimeout(element, time) {
  setTimeout(() => {
    element.remove();
  }, time);
}
