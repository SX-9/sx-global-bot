const Discord = require('discord.js');
const client = new Discord.Client({ 
    intents: ['GUILDS', 'GUILD_MEMBERS', 'GUILD_MESSAGES', 'GUILD_MESSAGE_REACTIONS']
});
const config = require('./config.json');

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    client.user.setActivity('Global Servers', { type: 'LISTENING' });
});

client.on('message', msg => {
    if (msg.author.bot) return;
    let embed = new Discord.MessageEmbed()
        .setColor('BLUE')
        .setAuthor(msg.author.username, msg.author.avatarURL())
        .setDescription(`${msg.content}`)
        .setTimestamp(new Date());
    let cache = client.channels.cache;
    let channel = msg.channel;
    if (channel.id === config.channels.one) {
        msg.delete();
        channel.send(embed.setFooter('Sent From Here'));
        cache.get(config.channels.two).send(embed.setFooter('Sent From ' + channel.name));
        cache.get(config.channels.three).send(embed.setFooter('Sent From ' + channel.name));
    }
    if (channel.id === config.channels.two) {
        msg.delete();
        channel.send(embed.setFooter('Sent From Here'));
        cache.get(config.channels.one).send(embed.setFooter('Sent From ' + channel.name));
        cache.get(config.channels.three).send(embed.setFooter('Sent From ' + channel.name));
    }
    if (channel.id === config.channels.three) {
        msg.delete();
        channel.send(embed.setFooter('Sent From Here'));
        cache.get(config.channels.one).send(embed.setFooter('Sent From ' + channel.name));
        cache.get(config.channels.two).send(embed.setFooter('Sent From ' + channel.name));
    }
});

client.login(config.bot.token);