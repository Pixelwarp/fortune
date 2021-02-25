import EventHandler from './event-handler';
import { handle } from '../command-handler';

module.exports = new class extends EventHandler {
  on = 'message';

  invoke(msg) {
    return handle(msg);
  }
}