import { BehaviorSubject } from "rxjs";

const promptSubject = new BehaviorSubject(null);

export const promptService = {
  init: promptSubject.asObservable(),
  prompt,
  clear,
};

function prompt(message, choices, clicked, type) {
  promptSubject.next({ message, choices, clicked, type });
}

function clear() {
  promptSubject.next(null);
}
