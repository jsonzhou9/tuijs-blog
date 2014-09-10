/**
 * metalsmith plugins for tag list page
 * by Jason
 * http://www.2fz1.com/
 */

var defaultOpations = {
    website_url:'/',
    perPage:10, //每页记录数
    pageTemplate:'tag_list.html' //翻页页面模板
};

function plugin(options){
    options = options || {};

    return function(files, metalsmith, done){
        var website_url = options.website_url,
            posts = metalsmith.data.posts,
            perPage = options.perPage || defaultOpations.perPage,
            pageTemplate = options.pageTemplate || defaultOpations.pageTemplate;
        var tags = {};

        //creat tags list
        for (var post in posts) {
            if(!posts[post] || !posts[post].tags){
                continue;
            }
            for (var tag in posts[post].tags) {
                var tagItem = posts[post].tags[tag];
                if (! tags[tagItem]) {
                    tags[tagItem] = [];
                }
                tags[tagItem].push(posts[post]);
            }
        }

        //creat tags page
        for(var tag in tags){
            var numPages = Math.ceil(tags[tag].length / perPage);
            var pagination = [];

            for (var i = 1; i <= numPages; i++) {
                pagination.push({
                    num: i,
                    url: (1 == i) ? website_url+'tag/' + tag + '/' : website_url+'tag/' + tag + '/' + i
                });

                var tagPage;
                if(i == 1){
                    tagPage = 'tag/' + tag + '/index.md';
                }else{
                    tagPage = 'tag/' + tag + '/' + i + '/index.md';
                }

                var prePageUrl = false;
                if(i>1){
                    if(i-1 == 1){
                        prePageUrl = website_url+'tag/' + tag + '/';
                    }else{
                        prePageUrl = website_url+'tag/' + tag + '/' + (i-1);
                    }
                }

                files[tagPage] = {
                    template: pageTemplate,
                    mode: '0644',
                    contents: '',
                    title: tag,
                    posts: tags[tag].slice((i-1) * perPage, ((i-1) * perPage) + perPage),
                    currentPage: i,
                    numPages: numPages,
                    pagination: pagination,
					next: i<numPages ? website_url+'tag/' + tag + '/' + (i+1) : false,
					pre: prePageUrl
                }
            }
        }

        done();
    }
}

module.exports = plugin;