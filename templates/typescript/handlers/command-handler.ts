import { readdirSync } from 'fs';
import { resolve } from 'path';

const commands = new Map();

const commandsDir = resolve('./commands');
const files = readdirSync(commandsDir).filter(file => file.endsWith('.js'));

for (const file of files) {
  const command = require(`${commandsDir}/${file}`);
  if (!command.name) continue;

  commands.set(command.name, command);
}
console.log(`Loaded ${commands.size - 1} commands.`);

export async function handle(msg) {
  try {
    const prefix = require('../fortune.json').prefix;
    const commandName = msg.content.slice(prefix.length);
  
    const command = commands.get(commandName);
    await command?.execute(msg);
  } catch (err) {
    msg.channel.send(`⚠ ${err?.message}`);
  }
}