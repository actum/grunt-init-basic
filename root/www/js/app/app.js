var $ = require('jquery');

/**
 * @param {Object}
 */
window.App = function(config) {
    this.config = config;
};

window.App.prototype.start = function() {

    /**
     * Delete this
     */
    $('p').after('<h2>App works!</h2>');

};

window.App.prototype.init = function(Klass, args) {
    var container = args[0];
    var argsCount = args.length;

    if (container.length) {
        if (argsCount === 1) {
            return new Klass(container);
        } else if (argsCount === 2) {
            return new Klass(container, args[1]);
        } else if (argsCount === 3) {
            return new Klass(container, args[1], args[2]);
        } else if (argsCount === 4) {
            return new Klass(container, args[1], args[2], args[3]);
        }
    }

    // function F() {
    //     return Klass.apply(this, args);
    // }

    // if (container.length) {
    //     F.prototype = Klass.prototype;
    //     return new F();
    // }
};

window.App.prototype.factory = function(Klass, args) {
    var containers = args[0];
    var containersCount = containers.length;
    var argsCount = args.length;
    var returnArray = [];

    if (containersCount) {
        for (var i = 0; i < containersCount; i++) {
            if (argsCount === 1) {
                returnArray.push(new Klass($(containers.get(i))));
            } else if (argsCount === 2) {
                returnArray.push(new Klass($(containers.get(i)), args[1]));
            } else if (argsCount === 3) {
                returnArray.push(new Klass($(containers.get(i)), args[1], args[2]));
            } else if (argsCount === 4) {
                returnArray.push(new Klass($(containers.get(i)), args[1], args[2], args[3]));
            }
        }
    }

    return returnArray;
};
