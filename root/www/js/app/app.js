define(['jquery'], function ($) {

    'use strict';

    /**
     * @param {Object}
     */
    var App = function(config) {
        this.config = config;
    };

    App.prototype.start = function() {

        /**
         * Set Handlebars defaults
         * @type {Number} DEBUG: 0, INFO: 1, WARN: 2, ERROR: 3
         */
        window.Handlebars.logger.level = this.config.handlebarsLogLevel;

        /**
         * Delete this
         */
        console.info('jQuery version: ', $.fn.jquery);

    };

    return App;

});
