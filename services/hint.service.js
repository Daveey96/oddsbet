import { BehaviorSubject } from "rxjs";

const hintSubject = new BehaviorSubject(null);

export const hintService = {
  init: hintSubject.asObservable(),
  hint,
  clear,
};

function hint(message, className) {
  hintSubject.next({ message, className });
}

function clear() {
  hintSubject.next(null);
}
