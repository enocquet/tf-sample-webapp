// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import { Subject } from 'rxjs';

export default class Notifier {
  constructor() {
    this.send = this.send.bind(this);
    this.subscribe = this.subscribe.bind(this);

    this.subject = new Subject();
  }

  send(data) {
    this.subject.next(data);
  }

  subscribe(callback) {
    return this.event.subscribe((data) => {
      callback(data);
    });
  }

  get event() {
    return this.subject.asObservable();
  }
}
