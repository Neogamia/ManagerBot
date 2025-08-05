import { Client, Colors, Embed, EmbedBuilder, Events, GatewayIntentBits, TimestampStyles } from "discord.js";
import dotenv from "dotenv";
import { execute, readfromdb } from "./db/sqlite.mjs";
import { byeImg, welcomeImg } from "./imggen.mjs";
import fs from 'fs';
import { channel } from "diagnostics_channel";
dotenv.config();

const client = new Client({ 
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMembers] 
});

client.once(Events.ClientReady, async (readyClient) => {
    console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

client.on('messageCreate', async (msg) => {
    let args = msg.content.split(' ', 2);
    if(msg.content.startsWith('add')) {
        if(!execute('SELECT * FROM users WHERE username LIKE "thanongaming"')) {
            msg.channel.send('exists in db');
        } else {
            msg.channel.send('dosnt exist in db')
        }
        //if(execute('SELECT * FROM users WHERE id ="' +  msg.author.id + '"')) {
            execute("INSERT INTO users (displayname, username, id, money, xp, level) VALUES ('" + msg.author.displayName + "','" + msg.author.username + "','"+ msg.author.id + "', '100', '0', '1')");
            msg.channel.send('Created new user in db')
        //} else {
            //msg.channel.send('User with this id already exists')
        //}
    };
    if(msg.content == 'delete') {
        execute('DELETE FROM users WHERE id =' + msg.author.id);
        msg.channel.send('deleted user with id ' + msg.author.id + ' from db');
    }
    
    if(msg.content == '!welcome') {
        welcomeImg(msg.author, msg.guild);
        setTimeout(() => {
        msg.channel.send({content: `⏩ Member ${msg.author} joined`, files: [`./assets/${msg.author.username}-welcome.png`]}).then(function (msg)  {
            msg.react('🎉');
            msg.react('✨');
            msg.react('🔥');
        });
        }, 1500);
    };

    if(msg.content == '!bye') {
        byeImg(msg.author, msg.guild);
        setTimeout(() => {
            //const channel = member.guild.channels.fetch('1401130590937419866');
            msg.channel.send({content: `⏪ Member ${msg.author} left`, files: [`./assets/${msg.author.username}-bye.png`]}).then(function (msg)  {
                msg.react('👋');
            });
        }, 1500);
    };

    if(msg.content.startsWith('!assets')) {
        fs.readdir('./assets', (err, files) => {
            if(err) {
                msg.channel.send(`Error reading directory: `, err);
                return;
            }
            if(args[1] == null) {
                const filelist = [];
                files.forEach(file => {
                    filelist.push(file);
                });
                msg.channel.send(filelist.toString().replaceAll(',', '\n'));
            } else {
                const funny = ['snowball', 'babe', 'frank', 'diddy', 'gooner']
                if(msg.member.roles.cache.find(r => r.name === 'Admin') || msg.member.id == '960946185768685618') {
                    msg.channel.send({files: [`./assets/${args[1]}`]});
                } else {
                    msg.channel.send(`Sorry ${funny[Math.floor(Math.random()*funny.length)]} you don't have permission for that`)
                }
            }
        });
    };

    if(msg.content == '!managerfiles') {
        fs.readdir('../manager', (err, files) => {
            if(err) {
                msg.channel.send(`Error reading directory: `, err);
                return;
            }
            
            const filelist = [];
            files.forEach(file => {
                filelist.push(file);
                fs.readdir('./' + file, (err, files) => {
                    if(err) {
                        return;
                    }
                    
                    const filelist = [];
                    files.forEach(file => {
                        filelist.push(file);
                        fs.readdir('/' + file, (err, files) => {
                            if(err) {
                                return;
                            }
                            
                            const filelist = [];
                            files.forEach(file => {
                                filelist.push(file);
                            });
                            msg.channel.send(filelist.toString().replaceAll(',', '\n'));
                        });
                    });
                    msg.channel.send(filelist.toString().replaceAll(',', '\n'));
                });
            });
            msg.channel.send(filelist.toString().replaceAll(',', '\n'));
        });
    };

    if(msg.content.startsWith('!help')) {
        const embed = new EmbedBuilder()
            .setTitle('List of all commands')
            .setColor('DarkPurple')
            .addFields(
                {name: 'General commands', value: '!assets - gives a list of all files in the assets directory\n!add - adds yourself to the db (wip might be removed)\n!delete - deletes yourself from db (wip might be removed)\n!welcome - Sends the welcome image (test commad)\n!bye - Sends the bye image (test commad)\n!info <optional:Patria/DHDS (DrHouseDatingSim)> - gives general info about neogamia and if game name is given info about mentioned game'},
                {name: 'Admin', value: '!assets <name> - sends the assets to the chat'}
            );
        msg.channel.send({embeds: [embed]})
    };

    if(msg.content == '!rolesetup') {
        msg.channel.send('# Selectable Roles\n\nSex:\nMale - :man:\nFemale - :woman:\n\nGender:\nMale - ♂\nFemale - :female_sign:\nNon-binary - :flag_de: \nOther - :man_shrugging:').then(function (msg) {
            msg.react('👨');
            msg.react('👩');
            msg.react('♂');
            msg.react('♀')
            msg.react('🇩🇪');
            msg.react('🤷‍♂️');
        });
    };

    if(msg.content == '!info') {
        if(args[1] == null) {
            msg.channel.send('# Neogamia\nThe project started on May 19th 2025 when Thanon chatted with Steve on Twitter about his cool idea of making an Fantasy MMORPG, which later they named Patria');
        }
        if(args[1] == 'Patria') {
            msg.channel.send('# Patria\nOn June 7nd 2025 Thanon the head developer and Steve the head designer started working on Patria, the game was first started in unity but later they used C++ and DirectX')
        }
    };
    //console.log(readfromdb('SELECT displayname FROM users WHERE id=' + msg.author.id));
});

client.on('guildMemberAdd', async (member) => {
    welcomeImg(member, member.guild);
    setTimeout(() => {
        //const channel = member.guild.channels.fetch('1401130590937419866');
        member.guild.systemChannel.send({files: [`./assets/${member.username}-welcome.png`]}).then(function (msg)  {
            msg.react('🎉');
            msg.react('✨');
            msg.react('🔥');
        });
    }, 1500);
});

client.on('guildMemberRemove', async (member) => {
    byeImg(member, member.guild);
    setTimeout(() => {
        member.guild.systemChannel.send({files: [`./assets/${member.username}-bye.png`]}).then(function (msg)  {
            msg.react('👋');
        });
    }, 1500);
});

client.on('messageDelete', async (msg) => {
    //loggingChannel.send('test');
    msg.guild.channels.fetch('1402229749597736990').then((channel) => {
        const embed = new EmbedBuilder()
            .setColor(Colors.Red)
            .setTitle(`Message with id ${msg.id} was deleted`)
            .addFields(
                {name: 'author', value: msg.author.toString(), inline: true},
                {name: 'message content', value: msg.content.toString(), inline: true}
            )
            .setTimestamp()
            .setFooter({ text: 'Manager by Neogamia'});
        channel.send({embeds: [embed]});
    });
});

client.on('messageDeleteBulk', async (msg) => {
    //loggingChannel.send('test');
    msg.guild.channels.fetch('1402229749597736990').then((channel) => {
        const embed = new EmbedBuilder()
            .setColor(Colors.Red)
            .setTitle(`Message with id ${msg.id} was deleted`)
            .addFields(
                {name: 'author', value: msg.author.toString(), inline: true},
                {name: 'message content', value: msg.content.toString(), inline: true}
            )
            .setTimestamp()
            .setFooter({ text: 'Manager by Neogamia'});
        channel.send({embeds: [embed]})
    })
});

client.on('messageReactionAdd', async (reaction) => {
    if(reaction.emoji == '🇩🇪') {
        console.log('Super');
    }
})

client.on('voiceStateUpdate', async (channel) => {
    channel.guild.fetch('1402229749597736990').then((channel) => {
        const embed = new EmbedBuilder()
            .setColor(Colors.Red)
            .setTitle(`User $} was deleted`)
            .addFields(
                {name: 'author', value: msg.author.toString(), inline: true},
                {name: 'message content', value: msg.content.toString(), inline: true}
            )
            .setTimestamp()
            .setFooter({ text: 'Manager by Neogamia'});
        channel.send({embeds: [embed]})
    });
});

client.login(process.env.discordbot_token);