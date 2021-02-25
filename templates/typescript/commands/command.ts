import { Message } from 'discord.js';

export default class Command {
  name = '';

  execute(msg: Message) {
    throw new TypeError('Command not implemented.');
  }
}