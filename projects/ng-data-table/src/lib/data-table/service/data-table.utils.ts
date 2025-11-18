export const updateCLassList = (
  event: Partial<MouseEvent> & { currentTarget: EventTarget | null },
  callback: (item: Element) => void,
): void => {
  const target = event.currentTarget as HTMLElement;
  const selector = `div.${target.classList[0]}`.toString();
  const items = document.querySelectorAll(selector);
  items.forEach((item: Element) => {
    callback(item);
  });
};
