import { readdirSync } from 'fs';
import { resolve } from 'path';

const events = new Map();

const eventsDir = resolve('./handlers/events');
const files = readdirSync(eventsDir);

for (const file of files) {
  const event = require(`${eventsDir}/${file}`);
  if (!event.on) continue;

  events.set(event.on, event);
}
console.log(`Loaded ${events.size - 1} events.`);

module.exports = (bot) => {
  for (const event of events.values()) {
    bot.on(event.on, event.invoke.bind(event));
  }
};