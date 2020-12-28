/**
 * 
 *  today douban movie calendar widget http client  
 * 
 */

const http = require('https');
const zlib = require('zlib');
const querystring = require('querystring');
const fs = require('fs');
const fileTools = require('../util/fileTools');


/**
 * get today douban movie calendar from datetime and then write it to json file.
 * @param {*} dateTime 
 */
function CalendarAPI(dateTime) {

    const params = {
        _sig: 'wrbnosUhjy0QYJGWQD7TRutXVgk=',
        date: dateTime,
        apikey: '0ab215a8b1977939201640fa14c66bab',
        alt: 'json',
        _ts: '1592712181'
    }

    const options = {
        hostname: 'frodo.douban.com',
        port: 443,
        path: '/api/v2/calendar/today?' + querystring.stringify(params),
        method: 'get',
        headers: {
            'HOST': 'frodo.douban.com',
            'User-Agent': 'api-client/0.1.3 com.douban.frodo/6.37.0',
            'Accept': '*/*',
            'Accept-Language': 'zh-cn',
            'Accept-Encoding': 'gzip, deflate, br',
            'Connection': 'keep-alive',
            'Cookied': 'bid=Qqsi1NclMBs'
        }
    }

    let month = dateTime.split('-')[1];

    const req = http.get(options, function (res) {
        const statusCode = res.statusCode;
        if (statusCode === 200) {
            // console.log(res.headers['content-type']);
            // console.log(res.headers['content-encoding']);
            let chunks = [];
            res.on('data', (chunk) => {
                chunks.push(chunk);
            });
            res.on('end', () => {
                let buffer = Buffer.concat(chunks);
                // async gzipDecompress
                zlib.gunzip(buffer, (err, decoded) => {
                    if (err) throw err;
                    // make json beautify
                    const data = JSON.stringify(JSON.parse(decoded), null, 4);
                    console.log(data);
                    const folderPath = './data/json/DoubanMovieBak/' + month;
                    console.log(folderPath);
                    const dirExistStatus = fileTools.dirExists(folderPath);
                    dirExistStatus.then(() => {
                        fs.writeFile(folderPath + '/movie-' + dateTime + '.json', data, (err) => {
                            if (err) {
                                throw err;
                            }
                            console.log('JSON data saved!');
                        })
                    });

                });
                // excute before gzipDecompress
                console.log('end...');
            });

        }
    });

    req.on('error', (e) => {
        console.error(`request encounters problem: ${e.message}`);
    });
}

module.exports.CalendarAPI = CalendarAPI;

