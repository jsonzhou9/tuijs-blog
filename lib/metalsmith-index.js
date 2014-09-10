/**
 * metalsmith plugins for index page
 * by Jason
 * http://www.2fz1.com/
 */
 
var _ = require('underscore');
var defaultOpations = {
    website_url:'/',
    perPage:10, //每页记录数
    pageTemplate:'index.html' //翻页页面模板
};

function plugin(options){
    options = options || {};

    return function(files, metalsmith, done){
		var website_url = options.website_url,
            index = files['index.md'],
			posts = metalsmith.data.posts,
			perPage = options.perPage || defaultOpations.perPage,
			pageTemplate = options.pageTemplate || defaultOpations.pageTemplate,
			numPages = Math.ceil(posts.length / perPage),
			pagination = [];

        index.posts = posts.slice(0,perPage);
        index.currentPage = 1;
        index.numPages = numPages;
        index.pagination = pagination;
		index.next = 1<numPages ? website_url+'index/2' : false;
		index.pre = false;

        for (var i = 1; i <= numPages; i++) {
            pagination.push({
                num: i,
                url: (1 == i) ? website_url : website_url+'index/' + i
            });

            if (i > 1) {
                var prePageUrl = false;
                if(i-1 == 1){
                    prePageUrl = website_url;
                }else{
                    prePageUrl = website_url+'index/'+(i-1);
                }

                files['index/' + i + '/index.md'] = {
                    template: pageTemplate,
                    mode: '0644',
                    contents: '',
                    title: '',
                    posts: posts.slice((i-1) * perPage, ((i-1) * perPage) + perPage),
                    currentPage: i,
                    numPages: numPages,
                    pagination: pagination,
					next: i<numPages ? website_url+'index/' + (i+1) : false,
					pre: prePageUrl
                }
            }
        }
        done();
    };
}

module.exports = plugin;