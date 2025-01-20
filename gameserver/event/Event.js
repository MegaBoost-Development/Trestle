class Event {

  static PRIORITY = {
    LOWEST,
    LOW,
    MEDIUM,
    HIGH,
    HIGHEST,
    MONITOR
  };
  #cancelled;
  #cancelledReasons;
  #priority;

  constructor(priority = PRIORITY.MEDIUM) {
    this.#cancelled = false;
    this.#cancelledReasons = [];
    this.#priority = priority;
  }

  isCancelled() {
    return this.#cancelled;
  }

  cancel(reason) {
    this.#cancelled = true;
    this.#cancelledReasons.push(reason);
  }

  uncancel() {
    this.#cancelled = false;
  }


}

module.exports = Event;
