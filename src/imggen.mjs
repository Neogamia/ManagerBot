import fs from 'fs';
import { createCanvas, loadImage } from "canvas";

const img1 = './assets/clouds-7.png';
export function welcomeImg(member, guild) {
    loadImage(img1).then( async img => {
        fs.readFile('./assets/words.txt', 'utf-8', async (err, data) => {
            if(err) {
                console.error(err);
                return;
            }
            const canvas = createCanvas(img.width, img.height);
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);
            const lines = data.split('\n').filter(line => line.trim() !== '');

            ctx.font = '60px';
            ctx.fillText(`Welcome ${member.displayName}\nto ${guild.name}\nCurrent member count is ${guild.memberCount}\n\nYour word is ${lines[Math.floor(Math.random() * lines.length)]}`, 15, 85);
            const out = fs.createWriteStream(`./assets/${member.username}-welcome.png`);
            const stream = canvas.createPNGStream();
            stream.pipe(out);
        });
    });
};

export function byeImg(member, guild) {
    loadImage(img1).then(async img => {
        const canvas = createCanvas(img.width, img.height);
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);

        ctx.font = '60px';
        ctx.fillText(`Bye ${member.displayName}\nyou will be missed 👋\n\nOld member count: ${guild.memberCount + 1}\nNew member count: ${guild.memberCount}`, 15, 85);
        const out = fs.createWriteStream(`./assets/${member.username}-bye.png`);
        const stream = canvas.createPNGStream();
        stream.pipe(out);
    })
};

export function banImg(ban, guild) {
    loadImage(img1).then(async img => {
        const canvas = createCanvas(img.width, img.height);
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);

        ctx.font = '60px';
        ctx.fillText(`Member ${member.displayName}\nWas banned\n\nOld member count: ${guild.memberCount + 1}\nNew member count: ${guild.memberCount}`, 15, 85);
        const out = fs.createWriteStream(`./assets/${member.username}-bye.png`);
        const stream = canvas.createPNGStream();
        stream.pipe(out);
    })
};