const fs = require('fs');
const path = require('path');
const canvasTextLine = require('./util/canvasTextLineFeed');
const { createCanvas, loadImage } = require('canvas');
const fileTools = require('./util/fileTools');


const filePath = './data/json/DoubanMovieBak/01';

/**
 * sleep current task 
 * @param {*} ms 
 */
function wait(ms) {
    return new Promise(resolve => setTimeout(() => resolve(), ms));
};

function readJsonFiles(filePath) {

    let state = fs.statSync(filePath);
    if (state.isFile()) {
        fs.readFile(filePath, "utf-8", function (err, data) {
            let json = JSON.parse(data);
            nodeCanvasToImage(json);
        });
        // let jsonStr = fs.readFileSync(filePath, 'utf-8');
        // nodeCanvasToImage(JSON.parse(jsonStr));
    } else if (state.isDirectory()) {
        let files = fs.readdirSync(filePath);
        files.forEach(async (file, index) => {
            // await wait(2000 * index);
            // console.log(filePath);
            testReadFiles(path.join(filePath, file));
        });
    }
}

readJsonFiles(filePath);

function nodeCanvasToImage(json) {

    const picInfo = {};
    picInfo.content = json.comment.content;
    picInfo.poster = json.comment.poster;
    picInfo.title = json.subject.title;
    picInfo.card_subtitle = json.subject.card_subtitle;
    picInfo.today = picInfo.today || {};
    picInfo.today.date = json.today.date;
    picInfo.today.title = json.today.title;
    picInfo.score = json.subject.rating.value;
    //console.log(picInfo);

    const canvasWidth = 818;
    const canvasHeight = 1200;

    const canvas = createCanvas(canvasWidth, canvasHeight);
    const ctx = canvas.getContext('2d');

    // Fill background
    ctx.fillStyle = 'rgba(245, 245, 245, 1)';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    // Load image then create canvas, draw text and output png file.
    loadImage(picInfo.poster).then((image) => {

        const textLeftPx = canvasWidth / 2;
        
        ctx.fillStyle = 'rgba(40, 42, 44, 0.75)';
        ctx.font = '40px Microsoft Yahei';
        ctx.textAlign = 'center';
        ctx.fillText(picInfo.today.date, textLeftPx, 80);
        ctx.font = '30px Microsoft Yahei';
        ctx.fillText(picInfo.today.title, textLeftPx, 150);

        ctx.drawImage(image, 0, 200, canvasWidth, 459);

        ctx.font = '30px Microsoft Yahei';
        ctx.fillText("《" + picInfo.title + "》", textLeftPx, 730);

        const contentHeight = 800;
        const lineHeight = 40;
        const linePadding = 60;
        //ctx.fillText(picInfo.content + picInfo.content, 611, 740, 1022);
        const resultLines = canvasTextLine.breakLinesForCanvas(ctx, picInfo.content, canvasWidth - linePadding, '24px Microsoft Yahei');
        resultLines.forEach(function (line, index) {
            ctx.fillText(line, textLeftPx, contentHeight + lineHeight * index);
        });

        const subtitlePaddingHeight = 50;
        const card_subtitle_height = contentHeight + lineHeight * resultLines.length + subtitlePaddingHeight;
        ctx.font = '20px Microsoft Yahei';
        ctx.fillText(picInfo.card_subtitle.replace('\n', ' '), textLeftPx, card_subtitle_height);

        const scorePaddingHeight = 70;
        ctx.font = '20px Microsoft Yahei';
        ctx.fillText("豆瓣评分：" + picInfo.score.toFixed(1), textLeftPx, card_subtitle_height + scorePaddingHeight);

        // console.log('<img src="' + canvas.toDataURL() + '" />')
        const stream = canvas.createPNGStream();
        let month = picInfo.today.date.split('-')[1];
        const folderPath = './data/images/DoubanMoviePic/' + month;
        const dirExistStatus = fileTools.dirExists(folderPath);
        dirExistStatus.then(() => {
            const out = fs.createWriteStream(folderPath + '/' + picInfo.today.date + '.png');
            stream.pipe(out);
            out.on('finish', () => console.log('The PNG file was created.'));
            out.on('error', (err) => console.log('create write stream error!', err));
        });

    }).catch(err => {
        console.log('load image error!', err);
    });

}

