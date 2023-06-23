import { BehaviorSubject } from "rxjs";

const overlaySubject = new BehaviorSubject(null);

export const overlayService = {
  init: overlaySubject.asObservable(),
  lay,
  clear,
};

function lay() {
  overlaySubject.next({ layer: true });
}

function clear() {
  overlaySubject.next(null);
}
