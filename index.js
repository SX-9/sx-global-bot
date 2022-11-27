const Discord = require('discord.js');
const client = new Discord.Client({
    intents: ['GUILDS', 'GUILD_MEMBERS', 'GUILD_MESSAGES']
});
const app = require('express')();
const swears = require('badwords/array');
const fs = require('fs');
const channels = require('./db.json');

let links = [ 'https://', 'http://', 'www.', '.com' ]
let bannedWords = swears.concat(links);

app.get('/', (req, res) => {
    res.send('Hello World!')
});

app.listen(3000, () => console.log('Starting...'))

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    client.user.setActivity(`mv!register | ${channels.length} Universes`, { type: 'LISTENING' });
});

client.on('message', msg => {
    if (msg.author.bot) return;
    let cache = client.channels.cache;
    let channel = msg.channel;
    let embed2 = new Discord.MessageEmbed()
        .setAuthor("System", msg.guild.iconURL())
        .setTimestamp(new Date())
        .setColor('GREEN')
        .setDescription(`${msg.guild.name} has joined us!`)
        .setFooter("Sent From " + msg.guild.name + " | Made By sx9.is-a.dev");
    if (msg.content.startsWith("mv!register")) {
        if (channels.includes(channel.id)) return channel.send("This channel is already registered!");
        if (!msg.member.hasPermission("ADMINISTRATOR")) return channel.send("You need to be an ADMINISTRATOR to register this channel!");
        channels.push(channel.id);
        fs.writeFileSync('./db.json', JSON.stringify(channels));
        channel.send("Current channel registered.");
        client.user.setActivity(`mv!register | ${channels.length} Universes`, { type: 'LISTENING' });
        channels.forEach(channel => {
            try {
                cache.get(channel).send(embed2);
            } catch {}
        });
        return;
    }
    let stopLoop = false;
    bannedWords.forEach((word) => {
        if (stopLoop) return;
        if (msg.content.toLowerCase().includes(word)) {
            try { msg.delete(); } catch { return; };
            channel.send("Banned Word Detected.");
            stopLoop = true;
        }
    });
    let embed1 = new Discord.MessageEmbed()
        .setColor('BLUE')
        .setAuthor(msg.author.username, msg.author.avatarURL())
        .setDescription(`${msg.content}`)
        .setTimestamp(new Date())
        .setFooter("Sent From " + msg.guild.name + " | Made By sx9.is-a.dev");
    channels.forEach(c1 => {
        if (stopLoop) return;
        if (channel.id === c1) {
            try { msg.delete(); } catch { return; };
            channels.forEach(c2 => {
                try {
                    if (msg.attachments.size > 0) {
                        msg.attachments.forEach(a => {
                            cache.get(c2).send(embed1.attachFiles(a.url));
                        });
                    } else {
                        cache.get(c2).send(embed1);
                    }
                } catch {
                    delete channels[c2];
                }
            });
        }
    });
});

client.login(process.env.token || "token");