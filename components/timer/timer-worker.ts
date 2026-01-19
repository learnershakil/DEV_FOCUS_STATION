/* eslint-disable no-restricted-globals */
self.onmessage = (e) => {
  const { command, interval } = e.data;

  if (command === "START") {
    if ((self as any).timerId) clearInterval((self as any).timerId);
    
    (self as any).timerId = setInterval(() => {
      self.postMessage({ type: "TICK" });
    }, interval);
  } else if (command === "STOP") {
    if ((self as any).timerId) clearInterval((self as any).timerId);
  }
};
