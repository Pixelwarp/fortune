import { Message } from 'discord.js';
import Command from './command';

module.exports = new class extends Command {
  name = 'ping';

  execute(msg: Message) {
    msg.channel.send(`🏓 Pong`);
  }
};