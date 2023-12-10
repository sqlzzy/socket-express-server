export default function testValidName(name) {
  const regexp = /\S+/gim;

  return regexp.test(name);
}
