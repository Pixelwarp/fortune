export default class EventHandler {
    on = '';
  
    invoke(...args) {
      throw new TypeError('Event not implemented.')
    }
  }