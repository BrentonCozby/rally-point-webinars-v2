import { readdirSync } from 'fs'
import { resolve } from 'path'
import { DefinePlugin, NoEmitOnErrorsPlugin } from 'webpack'
import merge from 'webpack-merge'
import HtmlPlugin from 'html-webpack-plugin'
import CopyPlugin from 'copy-webpack-plugin'

import { Dir } from '../config.js'
import devConfig from './dev.js'
import prodConfig from './prod.js'

const TARGET = process.env.npm_lifecycle_event
const env = (TARGET === 'dev') ? 'dev' : 'prod'

let plugins = [
    new HtmlPlugin({
        filename: 'index.html',
        template: resolve(Dir.pages, 'index.pug')
    }),
    new HtmlPlugin({
        filename: 'about.html',
        template: resolve(Dir.pages, 'about.pug')
    }),
    new HtmlPlugin({
        filename: 'services.html',
        template: resolve(Dir.pages, 'services.pug')
    }),
    new HtmlPlugin({
        filename: 'industries.html',
        template: resolve(Dir.pages, 'industries.pug')
    }),
    new HtmlPlugin({
        filename: 'contact.html',
        template: resolve(Dir.pages, 'contact.pug')
    }),
    new HtmlPlugin({
        filename: 'thinking.html',
        template: resolve(Dir.pages, 'thinking.pug')
    }),
    new HtmlPlugin({
        filename: '404.html',
        template: resolve(Dir.pages, '404.pug')
    }),
    new DefinePlugin({
        'process.env': {
           'NODE_ENV': JSON.stringify(process.env.NODE_ENV)
        }
    }),
    new CopyPlugin([
        {from: resolve(Dir.client, 'crossdomain.xml')},
        {from: resolve(Dir.client, '.htaccess')},
        {from: resolve(Dir.client, 'humans.txt')},
        {from: resolve(Dir.client, 'robots.txt')},
        {
            from: Dir.images,
            to: resolve(Dir.dist, 'images'),
            flatten: true
        },
        {
            from: resolve(Dir.client, 'mail', 'contact_me.php'),
            to: resolve(Dir.dist, 'mail')
        }
    ])
]

function hasCut(filename) {
    return filename.split('-')[0] === 'cut'
}

function readFiles(dirname) {
    const filenames = readdirSync(dirname)
    filenames.forEach(function(filename) {
        if(hasCut(filename)) return

        plugins.push(new HtmlPlugin({
            filename: filename,
            template: resolve(dirname, filename)
        }))
    })
}

function addArticlesToPlugins(folders) {
    folders.map(folder => {
        readFiles(resolve(Dir.articles, folder))
    })
}

// Add articles to the plugins array with html-webpack-plugin
const articlesFolders = ['the-big-picture', 'Content', 'event-execution', 'Marketing', 'Sales']
addArticlesToPlugins(articlesFolders)

let common = {
    output: {
        path: Dir.dist,
        publicPath: ''
    },
    module: {
        rules: [
            {
                test: /\.(woff|woff2|eot|ttf)$/,
                use: {
                    loader: 'url-loader',
                    options: {
                        limit: 100000,
                        name: '[name].[ext]',
                        outputPath: 'fonts/'
                    }
                }
            }, {
                test: /\.(pug)$/,
                use: ['pug-loader']
            }
        ]
    },
    plugins: plugins,
    resolve: {
        modules: [
            Dir.src,
            'node_modules'
        ]
    }
}

let config;

if(env === 'dev') {
    config = merge(common, devConfig)
}

if(env === 'prod') {
    config = merge(common, prodConfig)
}

export default config
