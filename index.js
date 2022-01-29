const noblox = require("noblox.js")
const fs = require('fs');
const chalk = require('chalk')
let commandList = [];
const db = require('quick.db')
const prefix = '/'

fs.readdir('./commands/', async (err, files) => {
    if(err){
        return console.log(chalk.red('An error occured when checking the commands folder for commands to load: ' + err));
    }
    files.forEach(async (file) => {
        if(!file.endsWith('.js')) return;
        let commandFile = require(`./commands/${file}`);
        commandList.push({
            file: commandFile,
            name: file.split('.')[0],
            config: commandFile.config
        });
    });
    db.set('commandList',commandList)
});


const cookie = '_|WARNING:-DO-NOT-SHARE-THIS.--Sharing-this-will-allow-someone-to-log-in-as-you-and-to-steal-your-ROBUX-and-items.|_945340EDAC37A7FC9963A8F37B9868F4F2AC30E5E197B0DA366920158EA82BB518FE65FDEB18D777D4BD8BFDABD5644EA7853CCF87CFD5732ECE53176EF1DBD9B8DD0C86B3F7F687C392D8C3F291410817F47A264DE73C2D8022736072BE0CF72866013D2AEB3923CCC181BEB059D6E0376097C3B6BEA1B4411EF3907084F3F07EECDFF5DC9525B3187916D29B2C597744F33C560DD1E9A339B190B71803E7BFB8F1051325D116E77CE03706233576CE0E0F213AD2C54FD33C9CFEDB8C93B3438B3459CC5D44A061ED1A4894BA50A039E5D61CE8DAEFD14D1443FA1DA8D1CA0608BF1EAB8D3D761AD36D7247DBA7B2081BDE629FF348A298504FA33DCC2CBAF3834213D7DA2CDB0E530FD1FAF8EE2B941F6943C131FAE2D8349F89F4934C1193FE5FC75E78D1524CAA76687D258910865EED98D88A213BED835DA388887B049E1F058EE45A95528FEBF6793CC9E5CFCCD758C8D9'
async function nobloxCrap () {

    const currentUser = await noblox.setCookie(cookie) 
    console.log(`Logged in as ${currentUser.UserName} [${currentUser.UserID}]`)
    let raw
    noblox.onNewMessage().on("data", async function(data) {
        let id = data
        raw = await noblox.getChatMessages(data, 1)
        const message = raw[0]
        if(!message.content.startsWith(prefix)) return;
        const args = message.content.slice(prefix.length).split(' ');
        const commandName = args[0].toLowerCase();
        args.shift();
        const command = commandList.find((cmd) => cmd.name === commandName || cmd.config.aliases.includes(commandName));
        if(!command) return;

        command.file.run(id, message, args);
       })

}

nobloxCrap()

module.exports = {
    reply: async (text, id) => {
        await noblox.sendChatMessage(id,text)
 
    }
 }

