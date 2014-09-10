/**
 * tuijs-blog
 * by Jason
 * http://www.2fz1.com/
 * */
var config = require('./config').config;
var Metalsmith = require('metalsmith');
var Handlebars = require('handlebars');
var _ = require('underscore');
var moment = require('moment');
	moment.locale('zh-cn');
var path = require('path');
var fs = require("fs");

/**
 * plugins
 * */
var index = require('./lib/metalsmith-index'),
    tag = require('./lib/metalsmith-tag'),
    slug = require('./lib/metalsmith-slug'),
    drafts = require('metalsmith-drafts'),
    templates = require('metalsmith-templates'),
    markdown = require('metalsmith-markdown'),
    permalinks = require('metalsmith-permalinks'),
    branch = require('metalsmith-branch'),
    more = require('metalsmith-more'),
    collections = require('metalsmith-collections'),
	mtime = require('metalsmith-mtime'),
    cleanCSS = require('metalsmith-clean-css');

/**
 * Handlebars helper
 * Sub template
 * */
Handlebars.registerHelper('uc', function (str) {
    return encodeURIComponent(str);
});

Handlebars.registerHelper('include', function (name, context) {
    var templateString = fs.readFileSync(path.join(__dirname, config.templates, name), "utf8");
	var subTemplate =  Handlebars.compile(templateString);
	var subTemplateContext = _.extend({},this,context.hash,config);
	return new Handlebars.SafeString(subTemplate(subTemplateContext));
});
 
/**
 * config options & build
 * */
Metalsmith(__dirname)
    .metadata(config)
    .source('source')
    .destination('publish')
    .use(cleanCSS({
        files: '**/*.css',
        cleanCSS: {
            noRebase: true
        }
    }))
    .use(drafts())
	.use(mtime())
    .use(collections({
        posts: {
            pattern: 'post/*',
            sortBy: 'date',
            reverse: true
        }
    }))
    .use(slug())
    .use(more({
		ext: 'md'
	}))
    .use(index({
        website_url: config.website_url
    }))
    .use(tag({
        website_url: config.website_url
    }))
    .use(markdown({
		keys: ['less'],
		langPrefix: 'hljs ',
        highlight: function (code,lang) {
            return require('highlight.js').highlightAuto(code).value;
        }
    }))
    .use(branch('post/*')
        .use(formatDate)
        .use(permalinks({
            pattern: 'post/:slug'
        }))
    )
    .use(templates({
        engine: 'handlebars',
        directory: config.templates
    }))
    .build(function(err) {
        if (err) throw err;
    });

console.log("构建完成！");

/**
 * other helper
 */
function formatDate(files, metalsmith, done) {
	for (file in files) {
        files[file].date = moment(files[file].date).format('LL');
		files[file].mtime = moment(files[file].mtime).format('LLLL');
    }
	done();
}