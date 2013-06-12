require.config({
    paths: {
        'jquery': '../../bower/jquery/jquery',
        'handlebars': '../../bower/handlebars/handlebars.runtime'
    },
    shim: {
        'handlebars': {
            exports: 'Handlebars'
        }
    }
});

require(['app/app']);
