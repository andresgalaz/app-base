Ext.define('a2m.view.login.AuthBase', {
    // extend: 'Ext.Panel',
    extend: 'Ext.Dialog',
    controller: 'login',
    requires: ['Ext.layout.VBox', 'a2m.view.login.LoginController'],
    baseCls: 'auth-locked',

    layout: {
        type: 'vbox',
        align: 'center',
        pack: 'center'
    }
});
