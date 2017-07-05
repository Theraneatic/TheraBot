require('events').EventEmitter.prototype._maxListeners = 100;
var Discord = require("discord.js");
var bot = new Discord.Client();
const now = require('performance-now');
var information = require('./information.json');
const prettyBytes = require("pretty-bytes");
var prefix = "x|";
var version = "0.0.2";
function msToTime(duration) {
    var milliseconds = parseInt((bot.uptime%1000)/100), seconds = parseInt((bot.uptime/1000)%60), minutes = parseInt((bot.uptime/(1000*60))%60), hours = parseInt((bot.uptime/(1000*60*60))%24), days = parseInt((bot.uptime/(1000*60*60*24))%31);
    days = (days < 10) ? "0" + days : days;
    hours = (hours < 10) ? "0" + hours : hours;
    minutes = (minutes < 10) ? "0" + minutes : minutes;
    seconds = (seconds < 10) ? "0" + seconds : seconds;
    return days + ":" + hours + ":" + minutes + ":" + seconds + "." + milliseconds;
}
bot.on('ready', (g,m) => {
  console.log("Bot online. Ready at " + bot.readyAt + ". Version " + version + ". Prefix " + prefix + "." + "Developed by: Theraneatic.");
  bot.user.setStatus("online");
  bot.user.setGame(prefix + "help");
});
bot.on("disconnect", () => {
  console.log("Bot was disconnected from Discord on " + new Date() + "!");
});
bot.on("reconnecting", () => {
  console.log("Bot reconnected to Discord on " + new Date() + "!");
});
process.on("unhandledRejection", err => {
  console.log("Unhandled Promise Rejection Warning. \n" + err.stack);
});
bot.on("message", message => {
  if (message.author.id !== information.id) return;
  if (message.content.startsWith(prefix + "eval")) {
    if (message.author.bot) return;
    if (message.author.id === information.id) {
      let content = message.content.split(" ").slice(1).join(' ');
      let result = new Promise((resolve, reject) => resolve(eval(content)));
      return result.then(check => {
        if (typeof check !== 'string') check = require('util').inspect(check, {
          depth: 0
        });
        if (check.includes(bot.token)) check = check.replace(bot.token, "Error: Output contained bot token.");
        return message.channel.sendCode("js", "Input: " + content + "\n" + "Output: " + check);
      }).catch(error => {
        console.error(error);
        message.channel.sendCode("js", "Error: Output has been logged to console.");
      });
    }
  } else if (message.content === prefix + "ping") {
    var start = now();
    message.channel.sendMessage("Checking Ping...").then(message => {
      var end = now();
      message.edit(`Pong! The message took ${(end - start).toFixed(2)} milliseconds to be processed and returned. The bot's ping is currently ${(bot.ping).toFixed(0)}.`);
    });
  } else if (message.content === prefix + "restart") {
    var sres = now();
    bot.destroy();
    bot.login(information.token).then(smessage => {
      var eres = now();
      message.channel.sendMessage(`Restart completed. Time taken to complete: ${(eres - sres).tofixed(0)}`);
    });
  } else if (message.content === prefix + "help") {
    message.channel.sendMessage(" ", {
      embed: {
        color: 3447003,
        author: {
          name: 'Help',
          icon_url: bot.user.avatarURL
        },
        title: 'Help Message',
        description: 'List of commands for the bot.',
        fields: [{
            name: 'help',
            value: 'Returns this message'
          },
          {
            name: 'eval',
            value: 'Evaluate a message as JavaScript code.'
          },
          {
            name: 'restart',
            value: 'Restarts the bot.'
          },
          {
            name: 'shutdown',
            value: 'Shuts down the bot.'
          },
          {
            name: "ping",
            value: "Returns how long the command took to execute."
          },
          {
            name: "avatar",
            value: "Returns a mentioned user's avatar."
          },
          {
            name: "calc",
            value: "Multiplication, addition, division, and subtraction."
          },
          {
            name: "info",
            value: "General information about the bot."
          }
        ],
        timestamp: new Date(),
        footer: {
          icon_url: bot.user.avatarURL,
          text: 'Command List'
        }
      }
    });
  } else if (message.content === prefix + "info") {
      message.channel.sendMessage(" ", {
        embed: {
          color: 3447003,
          author: {
            name: 'Bot Information',
            icon_url: bot.user.avatarURL
          },
          title: 'Memory Usage',
          description: `Using ${prettyBytes(process.memoryUsage().rss)}`,
          fields: [{
            name: "Total Members",
            value: `You are in servers with a total of ${bot.users.size} users!`
          },
          {
            name: "Total Guilds",
            value: `You are in ${bot.guilds.size} guilds!`
          },
          {
            name: "Ready Time",
            value: `${bot.readyAt}`
          },
          {
            name: "Uptime",
            value: msToTime()
          },
        ],
          timestamp: new Date(),
          footer: {
            icon_url: bot.user.avatarURL,
            text: 'Information Details'
          }
        }
      });
    } else if (message.content.startsWith(prefix + "avatar")) {
      var user = message.mentions.users.first();
      var avatarLink = bot.users.get(user.id).avatarURL;
      message.channel.sendMessage("Avatar:" + avatarLink + ".");
    } else if (message.content === prefix + "shutdown") {
      message.channel.sendMessage("Shutting down...");
      bot.destroy();
    } else if (message.content.startsWith(prefix + 'calc')) {
          var args = message.content.split(' ').slice(1);
          let symbol = args[1];
          let num1 = args[0];
          let num2 = args[2];
            if (symbol === '*') {
              message.channel.sendMessage(num1 * num2);
            } else if (symbol === '/') {
              message.channel.sendMessage(num1 / num2);
            } else if (symbol === '+') {
              message.channel.sendMessage(num1 + num2);
            } else if (symbol === '-') {
              message.channel.sendMessage(num1 - num2);
            }
      }
});
bot.login(information.token);
//some features tested with the aid of whitigoh#7962
