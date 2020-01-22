var express = require('express');
var router = express.Router();
var ytdl = require('youtube-dl');
var request = require('request');


// convert to human readable format
function bytesToSize(bytes) {
   var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
   if (bytes == 0) return '0 Byte';
   var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
   return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
};

router.post('/viddown', function(req, res, next) {
    var url = req.body.url,
        pattern = /^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube\.com|youtu.be))(\/(?:[\w\-]+\?v=|embed\/|v\/)?)([\w\-]+)(\S+)?$/;

    request.get(url, function (err, resp, body) {
        // check if it is valid url
        if(pattern.test(resp.request.uri.href)) {
            ytdl.getInfo(url,['--youtube-skip-dash-manifest'], function(err, info) {
                
                if(err) return res.send({error: 'The link you provided either not a valid url or it is not acceptable'});
                    //console.log(info);
                // push all video formats for download (skipping audio)
                info.formats.forEach(function(item) {
                    if(item.format_id === '18' && item.filesize) {
                       res.send({url:item.url}); 
                    }
                });
                
                //res.render('listvideo', {meta: {id: info.id, formats: formats}});
            })
        }
        else {
            res.send({error: 'The link you provided either not a valid url or it is not acceptable'});
        }
    });



})


module.exports = router;
