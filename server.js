const Discord = require("discord.js");
const client = new Discord.Client();
const config = require('./config.json');
const cowsay = require("cowsay");
const moment = require("moment");
require('moment-duration-format');

const actividad = moment.duration(client.uptime).format(" D [dias], H [hrs], m [mins], s[secs]");

let prefix = config.prefix;

client.on("ready", () => {
    console.log(`El Bot está listo en: ${client.user.tag}`);
    //client.user.setStatus('dnd');             // Establece el estado del BOT.

    client.user.setPresence( {
        activity: {
            name: "| _ayuda | Estoy aquí para ayudarte! ;)",
            type: "LISTENING"
        },
        status: "online"
    });

    console.log(client.user.presence.status); // Arroja por consola el estado del BOT.
    
 });

 // Saludos a nuevo miembro
 client.on("guildMemberAdd", member => {
     var canal = client.channels.find(channel => channel.id === ("701303886274887730"));
     canal.send("Bienvenido <@" + member.id + "> al servidor! \n\n Saludos!! :sans: ");

 });

// let prefix = config.prefix;
 
client.on("message", (message) => {
    
    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    if(command === 'status') {
        let color = {
        "online": "#00c903",
        "idle": "#ff9a00",
        "dnd": "#ff0000",
        "offline": "#d8d8d8"
    };
    let estados = {
        "online": "En Línea",
        "idle": "Ausente",
        "dnd": "No molestar/Ocupado",
        "offline": "Desconectado/invisible"
    };

    let user = message.mentions.users.first();
    if(!user) return message.reply(`¡Mencione a un usuario!`);

    const embed = new Discord.MessageEmbed()
        .setColor(color[user.presence.status])
        .addField(`Estado de ${user.username}`, `${estados[user.presence.status]}`)
  
    message.channel.send(embed);
    }   

   if(command === 'francofan') {
       const embedmsg = new Discord.MessageEmbed()
            .setTitle('Hey! El Tik Tok de Franco es:')
            .setColor(0xFF00CC)
            .setTimestamp()
            .setThumbnail('https://1000marcas.net/wp-content/uploads/2019/12/Tik-tok-emblema.jpg')
            .setFooter('Actualizado al 19-04-20')
            .setDescription('https://cutt.ly/ft6BsmK')
       message.channel.send(embedmsg);
   }

   if(command === 'help') {
       message.channel.send(`Uh, intenta probar "_ayuda" ${message.author}`); 
   }

   if (command === 'redes') {
        const embed = new Discord.MessageEmbed()
        // Establece el titulo del mensaje
            .setTitle('Estas son nuestras redes:')
        // Establece el color del mensaje
            .setColor(0xFF00CC)
        // Establece la descripcion del mensaje
            .addField("Instagram:",  "https://www.instagram.com/sanjorgedankmeme")
            .addField("YouTube:", "https://www.youtube.com/user/ZealotTormunds")
            
        // Envia el mensaje por el mismo canal donde fue pedido
        message.channel.send(embed);
   }

   if (command === 'ayuda') {
        const embed = new Discord.MessageEmbed()
            .setTitle('Comandos disponibles de Balo:')
            .setAuthor("fauo#8768", message.author.displayAvatarURL('fauo#8768'))
            .setColor(0xFF00CC)
            .setDescription('Todos estos comandos están en modo prueba aún. Cualquier error comunicarse con @fauo. \n\n Recuerda anteponer el prefix `_` para utilizar algún comando.')
            .setFooter("Última actualización el 19-04-20 [v1.0]", client.user.displayAvatarURL())
            .setThumbnail('https://pbs.twimg.com/profile_images/520489796792098818/We9vORJo_400x400.png')
            .setTimestamp()
            .addField('Comandos de moderación', '`ban`, `kick`, `status`')
            .addField('Comandos útiles', '`redes`, `ayuda`, `francofan`, `avatar`, `invitar`, `infosv`, `ping`, `saludame`' )
    
        message.channel.send(embed);
   }

    if (command === 'avatar') {
        let user = message.mentions.users.first();

        if(user) {
            const avatar = new Discord.MessageEmbed()
                .setImage(user.displayAvatarURL())
                .setFooter('Avatar de: ' + user.username, user.displayAvatarURL())
                .setColor('0xEDED1D')
            message.channel.send(avatar);

        } else {

            const avatar = new Discord.MessageEmbed()
                .setImage(message.author.displayAvatarURL())
                .setFooter('Avatar de: ' + message.author.username, message.author.displayAvatarURL())
                .setColor('0xEDED1D')
            message.channel.send(avatar);
        }
    }

    if(command === 'invitar') {

        message.channel.send(`Hey ${message.author}, aquí tienes el link para invitar más gente!`)
        var id = message.channel.id;
        message.guild.channels.cache.get(id).createInvite({
        maxAge: 0       //maxAge: 0 significa que el link sera permanente

        }).then(invite =>  
        message.channel.send(invite.url)
        );

    }

    if(command === 'infosv') {

        var server = message.guild;
        message.channel.send(`Hey ${message.author}, esta es la información del servidor`);

        const embedSv = new Discord.MessageEmbed()
            .addField('Nombre: ' , server.name)
            .addField('Dueño: ', server.owner.user.tag + ' (' + server.owner.user.id + ')')
            .addField('ID: ', server.id)
            .addField('Usuarios conectados: ' , server.memberCount, true)
            .addField('Región: ', server.region, true)
            .addField('Canales: ', server.channels.size, true)
            .addField('Información generada', server.joinedAt.toDateString(), true)
            .setThumbnail(message.guild.iconURL())
            .setTitle('INFORMACIÓN SERVIDOR:')
            .setColor(0xFF00CC)
            .setTimestamp()
            .setFooter('Actualizado al 20-04-2020')

        message.channel.send(embedSv);
    }

    if(command === 'ping') {
        let ping = Math.floor(message.client.ws.ping)
        message.channel.send('pong! [' + ping + ' ms]');
    }

    if(command === 'kick') {
        let user = message.mentions.users.first();
        let razon = args.slice(1).join(' ');

        var perms = message.member.hasPermission("KICK_MEMBERS");

        if(!perms) return message.channel.send("`Error` `|` No tienes Permisos para usar este comando.");
        if (message.mentions.users.size < 1) return message.reply('Debe mencionar a alguien.').catch(console.error);

        if (!razon) return message.channel.send('Escriba una razón, `_kick @username [razón]`');
        if (!message.guild.member(user).kickable) return message.reply('No puedo patear al usuario mencionado.');
     
        message.guild.member(user).kick(razon);
        message.channel.send(`**${user.username}**, fue pateado del servidor, razón: ${razon}.`);
    }

    if(command === 'saludame') {
        message.reply();
        message.channel.send('```\n' + cowsay.think({
            text: "Hey, qué tal todo?",
            eyes: 'oO',
            T : 'U '

        }) + '\n```');
    }
    
    if(command === 'botstats') {

        const embed_infobot = new Discord.MessageEmbed()
            .setTitle('Bot stats', client.user.avatar)
            .setColor("#0x00AE86")
            .setAuthor("fauo#8768", message.author.displayAvatarURL('fauo#8768'))
            .setDescription("= Estadísticas oficiales del bot =")
            .addField(`Dueño`, `fauo#8768`, true)
            .addField(`Version`, `1.0.0`, true)
            .addField(`Libreria`, `Discord ^12.0.2 (Js)`, true)

            .addField(`Memoria`, `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB`, true)
            .addField(`Uptime`, `${actividad}`, true)
            //.addField(`Servidores`, `${client.guilds.size}`, true)
            //.addField(`Usuarios`, `${client.users.size}`, true)
            //.addField(`Canales`, `${client.channels.size}`, true)
            //.addField(`Conexiones a voz`, `${client.voiceConnections.size}`, true)
            
            .setFooter("By. fauo#8768", client.user.avatarURL)
            .setThumbnail(message.author.avatarURL)

        message.channel.send(embed_infobot);
    }

});
 
 client.login("NzAxMjE3NTAyNTIwNDEwMjQy.XpuStg.pPGlN9NC2sAWaWLX-98PE6QdS0w");