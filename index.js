const Discord = require('discord.js');
const client = new Discord.Client({ 
    intents: ['GUILDS', 'GUILD_MEMBERS', 'GUILD_MESSAGES']
});
const fs = require('fs');
const channels = require('./db.json');

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    client.user.setActivity('mv!register', { type: 'LISTENING' });
});

client.on('message', msg => {
    if (msg.author.bot) return;
    if (msg.content.startsWith("mv!register")) {
        channels.push(msg.channel.id);
        fs.writeFileSync('./db.json', JSON.stringify(channels));
        msg.channel.send("Current channel registered.");
        return;
    }
    let embed = new Discord.MessageEmbed()
        .setColor('BLUE')
        .setAuthor(msg.author.username, msg.author.avatarURL())
        .setDescription(`${msg.content}`)
        .setTimestamp(new Date())
        .setFooter("Sent From " + msg.guild.name + " | Made By sx9.is-a.dev");
    let cache = client.channels.cache;
    let channel = msg.channel;
    channels.forEach(c1 => {
        if (channel.id === c1) {
            msg.delete();
            channels.forEach(c2 => {
                try {
                    cache.get(c2).send(embed);
                } catch {
                    delete channels[c2];
                }
            });
        }
    });
});

client.login(process.env.token || "MTAwMTQ0Mjk3NDMwOTMwMjM2Mg.G9H3Iv.6mUZ9cLeg6fsSv3aJ6uXW_gNuES-0mr7FWKoOY");