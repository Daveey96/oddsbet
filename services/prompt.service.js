import { BehaviorSubject } from "rxjs";

const promptSubject = new BehaviorSubject(null);

export const promptService = {
  init: promptSubject.asObservable(),
  prompt,
  clear,
};

function prompt(message, choices, clicked, empty = null) {
  promptSubject.next({ message, choices, clicked, empty });
}

function clear() {
  promptSubject.next(null);
}
