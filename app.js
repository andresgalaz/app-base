/*
 * This file launches the application by asking Ext JS to create
 * and launch() the Application class.
 */
Ext.application({
    extend: 'a2m.Application',

    name: 'a2m',

    requires: [
        // This will automatically load all classes in the a2m namespace
        // so that application classes do not need to require each other.
        'a2m.*'
    ],

    // The name of the initial view to create.
    // mainView: 'a2m.view.main.Main'
});
