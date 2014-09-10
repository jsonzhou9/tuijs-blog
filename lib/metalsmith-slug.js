/**
 * metalsmith plugins for File Name
 * by Jason
 * http://www.2fz1.com/
 */

var pinyin = require('pinyin');

function normalize(pinyinResult){
    if(pinyinResult && pinyinResult.length)
    {
        var resArr = [];
        for(var i=0;i<pinyinResult.length;i++){
            if(pinyinResult[i]){
                resArr.push(pinyinResult[i][0]); //多音词只取第一个
            }
        }
        return resArr.join("-");
    }
    return '';
}

function plugin() {
    return function (files, metalsmith, done) {
        var posts = metalsmith.data.posts;
        for(var post in posts)
        {
            if(posts[post] && !posts[post].slug){
                posts[post].slug = posts[post].title;
            }

            if(posts[post] && posts[post].slug) {
                var slug = pinyin(posts[post].slug,{style:pinyin.STYLE_NORMAL});
                posts[post].slug = normalize(slug);
            }
        }

        done();
    }
}

module.exports = plugin;