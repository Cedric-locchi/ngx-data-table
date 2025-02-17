
export const updateCLassList = (event: any, callback: Function) => {
  const selector = `div.${event.currentTarget.classList[0]}`.toString();
  const items = document.querySelectorAll(selector);
  items.forEach((item: Element) => {
    callback(item);
  });
}
