const Discord = require('discord.js');
const client = new Discord.Client();
const Music = require('discord.js-musicbot-addon');
const ytdl = require("ytdl-core");
const config = require('./config.json');
const fs = require('fs');
const chalk = require('chalk');
const prefix = '--';
const music = new Music(client, {
  prefix: "--",
  maxQueueSize: "100",
  disableLoop: true,
  leaveHelp: "Tako bota izbacis iz voice channela..wowww",
  leaveAlt: ["lve","leev","un1c0rns"],
  helpCmd: 'pomoc',
  leaveCmd: 'izadji',
  ownerOverMember: true,
  botOwner: '154924680770355200',
  youtubeKey: 'AIzaSyBfe0mzty56yFBZkQYlVokOe8YLGtT1E9Y',
  playHelp: 'Sa ovom komandom pustas muziku.',
  skipHelp: 'Sa ovom komandom preskaces pesmu.',
  queueHelp: 'Komanda za redosled pesama.',
  pauseHelp: 'Sa ovom komandom pauziras pesmu.',
  resumeHelp: 'Komanda suprotna od pause.',
  volumeHelp: 'Komanda kojom se kontrolise jacina zvuka.',
  clearHelp: 'Sa ovom komandom brises redosled pesama.',
  disableSet: true,
  loopHelp: 'Sa ovom komandom ponavljas pesme.',
  searchHelp: 'Sa ovom komandom trazis pesme.',
  disableOwnerCmd: true,
  disableHelp: true

});

require('./util/eventLoader')(client);
client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
//Warnings
process.on('unhandledRejection', error => console.error(`Uncaught Promise Rejection:\n${error}`));
client.on('message', message => {
    const prefixRegex = new RegExp(`^(<@!?${client.user.id}>|\\${prefix})\\s*`);
    if (!prefixRegex.test(message.content)) return;

    const [, matchedPrefix] = message.content.match(prefixRegex);
    const args = message.content.slice(matchedPrefix.length).trim().split(/ +/);
    const command = args.shift();

    if (command === 'prefix') {
        message.channel.send(`Trenutni prefix je \`${prefix}\``);
    }
});
//Music

//sve i svasta
client.on('message', message => {
  let args = message.content.split(' ').slice(1);
  let argsresult = args.join(' ');
    if (message.author.bot) return;
  // if (message.content === prefix + 'ping') {
  //   message.channel.send('pong hahhhaha mnogo dobra komanda jel tako?!!?1');
  // }
  if(message.content.toLowerCase() === prefix + 'hello') {
    message.channel.send('HELLO FROM THE OTHER SIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIDE');
  }
  if(message.content.toLowerCase().startsWith(prefix + 'setgame') && message.author.id === ('154924680770355200')) {
    client.user.setGame(argsresult);
    message.channel.send("Uspesno postavljena igra")
  }
  // if(message.content.toLowerCase().startsWith(prefix + 'say')) {
  //   message.delete();
  //   message.channel.send(argsresult);
  // }
});
//test
client.on("ready", () => {
  // This event will run if the bot starts, and logs in, successfully.
  console.log(chalk.bgGreen(`Bot startovan, sa ${client.users.size} korisnika, u ${client.channels.size} kanala od ${client.guilds.size} guildova.`));
  // Example of changing the bot's playing game to something useful. `client.user` is what the
  // docs refer to as the "ClientUser".
  client.user.setGame(`na ${client.guilds.size} servera`);
});

client.on("guildCreate", guild => {
  // This event triggers when the bot joins a guild.
  console.log(`Usao sam u novi guild: ${guild.name} (id: ${guild.id}). Ovaj guild ima ${guild.memberCount} membera!`);
  client.user.setGame(`na ${client.guilds.size} servera`);
});

client.on("guildDelete", guild => {
  // this event triggers when the bot is removed from a guild.
  console.log(`Kick su me iz: ${guild.name} (id: ${guild.id})`);
  client.user.setGame(`na ${client.guilds.size} servera`);
});


client.on("message", async message => {
  // This event will run on every single message received, from any channel or DM.

  // It's good practice to ignore other bots. This also makes your bot ignore itself
  // and not get into a spam loop (we call that "botception").
  if(message.author.bot) return;

  // Also good practice to ignore any message that does not start with our prefix,
  // which is set in the configuration file.
  if(message.content.indexOf(config.prefix) !== 0) return;

  // Here we separate our "command" name, and our "arguments" for the command.
  // e.g. if we have the message "+say Is this the real life?" , we'll get the following:
  // command = say
  // args = ["Is", "this", "the", "real", "life?"]
  const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();

  // Let's go with a few common example commands! Feel free to delete or change those.

  if(command === "ping") {
    // Calculates ping between sending a message and editing it, giving a nice round-trip latency.
    // The second ping is an average latency between the bot and the websocket server (one-way, not round-trip)
    const m = await message.channel.send("Ping?");
    m.edit(`Pong! Ping: ${m.createdTimestamp - message.createdTimestamp}ms. API: ${Math.round(client.ping)}ms`);
  }

  if(command === "say") {
    // makes the bot say something and delete the message. As an example, it's open to anyone to use.
    // To get the "message" itself we join the `args` back into a string with spaces:
    const sayMessage = args.join(" ");
    // Then we delete the command message (sneaky, right?). The catch just ignores the error with a cute smiley thing.
    message.delete().catch(O_o=>{});
    // And we get the bot to say the thing:
    message.channel.send(sayMessage);
  }

  if(command === "kick") {
    // This command must be limited to mods and admins. In this example we just hardcode the role names.
    // Please read on Array.some() to understand this bit:
    // https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Array/some?
    if(!message.member.roles.some(r=>["• Head Staff", "• Staff"].includes(r.name)) )
      return message.reply("nemas dozvolu da uradis ovo!");

    // Let's first check if we have a member and if we can kick them!
    // message.mentions.members is a collection of people that have been mentioned, as GuildMembers.
    let member = message.mentions.members.first();
    if(!member)
      return message.reply("molim te pinguj validnog korisnika ovog Discord servera");
    if(!member.kickable)
      return message.reply("ne mogu da kickujem ovog korisnika! Da li imaju visi role? Da li imam permisije za kick?");

    // slice(1) removes the first part, which here should be the user mention!
    let reason = args.slice(1).join(' ');
    if(!reason)
      return message.reply("molim te stavi razlog za kick!");

    // Now, time for a swift kick in the nuts!
    await member.kick(reason)
      .catch(error => message.reply(`Ups ${message.author} nisam mogao da kickujem zbog : ${error}`));
    message.reply(`${member.user.tag} je dobio kick od ${message.author.tag} zbog: ${reason}`);

  }

  if(command === "ban") {
    // Most of this command is identical to kick, except that here we'll only let admins do it.
    // In the real world mods could ban too, but this is just an example, right? ;)
    if(!message.member.roles.some(r=>["• Head Staff"].includes(r.name)) )
      return message.reply("nemas dozvolu da uradis ovo!");

    let member = message.mentions.members.first();
    if(!member)
      return message.reply("pinguj validnog korisnika ovog Discord servera");
    if(!member.bannable)
      return message.reply("ne mogu da banujem ovog korisnika! Da li imaju visi role? Da li imam ban permisije?");

    let reason = args.slice(1).join(' ');
    if(!reason)
      return message.reply("molim te stavi razlog za ban!");

    await member.ban(reason)
      .catch(error => message.reply(`Ups ${message.author} Nisam mogao ban zbog : ${error}`));
    message.reply(`${member.user.tag} je dobio ban od ${message.author.tag} zbog: ${reason}`);
  }

  if(command === "purge") {
    if(!message.member.roles.some(r=>["• Staff"].includes(r.name)) )
      return message.reply("nemas dozvolu da uradis ovo!");
    // This command removes all messages from all users in the channel, up to 100.

    // get the delete count, as an actual number.
    const deleteCount = parseInt(args[0], 10);

    // Ooooh nice, combined conditions. <3
    if(!deleteCount || deleteCount < 2 || deleteCount > 100)
      return message.reply("potreban mi je broj izmedju 2 i 100 kao broj za brisanje poruka");

    // So we get our messages, and delete them. Simple enough, right?
    const fetched = await message.channel.fetchMessages({count: deleteCount});
    message.channel.bulkDelete(fetched)
      .catch(error => message.reply(`ne mogu da obrisem poruke zbog: ${error}`));
  }
});
client.login(config.token);
