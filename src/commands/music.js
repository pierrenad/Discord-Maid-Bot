const ytdl = require('ytdl-core');
const search = require('youtube-search');
const Discord = require('discord.js');
const servers = require('../bot').servers;

function play(connection, msg) {
    var server = servers[msg.guild.id];
    const stream = ytdl(server.queue[0], { filter: 'audioonly' });
    server.dispatcher = connection.play(stream);

    server.queue.shift();

    server.dispatcher.on("finish", () => {
        if (server.queue[0])
            play(connection, msg);
        // else
        //     connection.disconnect;
    })
}

module.exports = async (msg, args, command) => {
    if (msg.channel.id !== process.env.CHANNEL_MUSIQUE) return;
    if (!msg.member.voice.channel) {
        await msg.channel.send('Faut être dans un channel vocal mon chou 🙄');
        return;
    }
    if (msg.member.voice.channel.id === process.env.CHANNEL_AFK) {
        await msg.channel.send('T\'est pas dans un channel vocal approprié 😘');
        return;
    }

    if (!servers[msg.guild.id]) {
        servers[msg.guild.id] = {
            queue: []
        }
    }

    switch (command) {
        case 'play':
            if (!args.length) return;

            var opts = {
                maxresults: 10,
                key: process.env.YT_API_KEY,
                type: 'video'
            };
            var result = await search(args.join(' '), opts);
            var resp = '';
            var numberOfChoices = 10;
            for (var i = 0; i < numberOfChoices; i++) {
                resp += `**[${parseInt(i) + 1}]** \'${result.results[i].title}\'\n`;
            }
            resp += `\nChoisi le numéro (1-${numberOfChoices})`;

            msg.channel.send(resp);

            const filter = m => !isNaN(m.content) && m.content < result.results.length + 1 && m.content > 0;
            const collector = msg.channel.createMessageCollector(filter);
            collector.result = result.results;

            var theResult;
            collector.once('collect', async function (m) {
                theResult = await result.results[parseInt(m.content) - 1];

                var server = servers[msg.guild.id];
                server.queue.push(theResult.link);

                let embed = new Discord.MessageEmbed()
                    .setColor("#73ffdc")
                    .setDescription(theResult.title)
                    .setTitle("Added to the queue");
                msg.channel.send(embed);

                if (msg.member.voice.channel.members.has(process.env.BOT_ID)) {
                    if (server.queue.length === 1) {
                        msg.member.voice.channel.join().then(connection => {
                            play(connection, msg);
                        })
                    }
                    else return;
                }
                else {
                    msg.member.voice.channel.join().then(connection => {
                        play(connection, msg);
                    })
                }
            })
            break;
        case 'skip':
            var server = servers[msg.guild.id];
            if (server.dispatcher)
                server.dispatcher.end(); // will end and go back to play (event) if there is something in the queue
            break;
        case 'pause':
            var server = servers[msg.guild.id];
            if (server.dispatcher) {
                server.dispatcher.pause();
            }
            break;
        case 'resume':
            var server = servers[msg.guild.id];
            if (server.dispatcher) {
                server.dispatcher.resume();
            }
            break;
        case 'leave':
            var server = servers[msg.guild.id];
            // if(msg.member.voice.channel.members.has(process.env.BOT_ID)) {
            if (msg.guild.voice.connection) {
                msg.guild.voice.connection.disconnect();
            }
            break;
        default:
    }
}