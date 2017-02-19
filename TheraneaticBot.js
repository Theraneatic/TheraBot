var Discord = require("discord.js");

var bot = new Discord.Client();

const now = require('performance-now')

var information = require('./information.json');

bot.on('ready', (g,m) => {
    console.log('Bot online. Developed by Theraneatic for personal use. V0.0.2.');
});

bot.on("message", function (message) {
  if (message.author.id === information.id) {
	  if (message.content === "x|perms") {
      message.channel.sendMessage("This is what you can do:\n" +
        JSON.stringify(message.channel.permissionsFor(message.author).serialize(), null, 4));
  }
    }
});

bot.on("message", function (message) {
  if (message.author.id === information.id) {
    if (message.content ==="x|ping") {
      var startTime = now();
      message.channel.sendMessage("Checking ping...")
        .then(message => {
            var endTime = now();
            return message.edit(`Pong! ${(endTime - startTime).toFixed(3)} milliseconds have passed.`);
        }).catch(console.error);
  }
}});

bot.on("message", function (message) {
    if (message.author.id == information.id) {
        if (message.content === "x|restart") {
            message.channel.sendMessage("Restarting...");
            bot.destroy();
            bot.login(information.token);
		    }
    }
});

bot.on("message", function (message) {
    if (message.author.id == information.id) {
        if (message.content === "x|shutdown") {
            message.channel.sendMessage("Shutting down...");
            bot.destroy();
	    	}
    }
});

bot.on("message", message => {
  if (message.author.id === information.id)
    if (message.content === "x|myinfo") {
        message.channel.sendMessage(`Here is your info:
        My ID: ${message.author.id}
        Joined: ${message.member.joinedAt}
        Join Timestamp: ${message.member.joinedTimestamp}
        Avatar: ${message.author.avatarURL}
        Account Creation Time: ${message.author.createdAt}
        Display Name: ${message.member.displayName}
        Highest Role: ${message.member.highestRole}`)
    }
});

bot.on ('message', message => {
  if (message.author.id === information.id) {
    if (message.content === 'x|coinflip') {
      let randnum = ((Boolean(Math.floor(Math.random()*10) > 5)));
        if (randnum === true) {
          message.channel.sendMessage('Heads!');
        }
        if (randnum === false) {
          message.channel.sendMessage('Tails!');
        }
      }
    }
});

bot.on ('message', message => {
      if (message.content === 'x|gennum') {
          if (message.author.id === information.id) {
              let numgen = ((Math.floor(Math.random()*10000)));
                  message.channel.sendMessage('The number you generated was ' + numgen + '!');
          }
      }
});

bot.on ('message', message => {
    if (message.author.id === information.id) {
        if (message.content === "x|help") {
            message.channel.sendMessage(`Here are my commands:
              x|coinflip: Flips a coin.
              x|gennum: Generates a random number.
              x|myinfo
              x|shutdown
              x|restart
              x|ping
              x|perms`)
        }
    }
});

bot.login(information.token)
