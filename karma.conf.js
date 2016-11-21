var webpack = require('webpack'),
    path = require('path'),
    join = path.join.bind(path, __dirname),
    files = [join('test/index.js')],
    lifecycle = process.env['npm_lifecycle_event'],
    config = require('./internal.webpack.config'),

    isDist = /dist/.test(lifecycle);

console.log('isDist', isDist, lifecycle);
var demoCfg;
if (isDist) {
    demoCfg = config('karma-dist', true, false, false);
    demoCfg.resolve.alias['react-addons-test-utils'] = join('test/react-addons-test-utils');
//    demoCfg.resolve.alias['react-dom-internal'] = join('node_modules/react-dom');
    demoCfg.resolve.alias['subschema'] = demoCfg.resolve.alias['Subschema'] = join('test/subschema');
    demoCfg.externals['_Subschema'] = 'Subschema';
  /*  demoCfg.externals = {
        '_Subschema': 'Subschema'
    };*/
    files.unshift(
        join('node_modules/react/dist/react-with-addons.js'),
        join('node_modules/react-dom/dist/react-dom.js'),
        {pattern: 'dist/subschema-noreact.js', included: true, served: true},
        {pattern: 'dist/subschema-noreact.js.map', included: false, served: true}
    );
} else {
    files.unshift({pattern: join('./test/with-bootstrap.js'), included: true, served: true});
    demoCfg = config('karma', false, false, false);
    demoCfg.resolve.alias['subschema'] = join('src/dist.js');
    demoCfg.resolve.alias['Subschema'] = join('src/dist.js');

 //   demoCfg.resolve.alias['react/lib'] = join('node_modules/react/lib');
 //   demoCfg.resolve.alias['react'] = join('node_modules/react/lib/React.js');
}
demoCfg.plugins.unshift(new webpack.DefinePlugin({'process.env.NODE_ENV':'"development"'}));

demoCfg.output.pathinfo = true;
delete demoCfg.entry;

demoCfg.devtool = 'inline-source-map';



module.exports = function (config) {
    config.set({
        browserNoActivityTimeout: 20000,
        browsers: ['Chrome'], //run in Chrome
        singleRun: true, //just run once by default
        frameworks: ['mocha'], //use the mocha test framework
        files: files,
        preprocessors: {
            [join('test', '*')]: ['webpack', 'sourcemap'], //preprocess with webpack and our sourcemap loader
            'dist/*': ['sourcemap']
        },
        reporters: ['dots'], //report results in this format

        webpack: demoCfg,

        webpackMiddleware: {
            stats: {
                colors: true
            }
        }
    });

};
