function generateUuid(useDashes = false) {
  const template = useDashes
    ? "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx"
    : "xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx";
  const xAndYOnly = /[xy]/g;

  return template.replace(xAndYOnly, (character) => {
    const randomNo = Math.floor(Math.random() * 16);
    const newValue = character === "x" ? randomNo : (randomNo & 0x3) | 0x8;

    return newValue.toString(16);
  });
}

export default generateUuid;
