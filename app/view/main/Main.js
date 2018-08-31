Ext.define('a2m.view.main.Main', {
    extend: 'Ext.navigation.View',

    requires: [
        'Ext.Button', 'Ext.list.Tree', 'Ext.navigation.View',
        'a2m.view.main.MainViewModel', 'a2m.view.main.MainController'
    ],

    controller: 'main',
    viewModel: 'main',

    navigationBar: false,
    userCls: 'main-container',

    items: [{
        xtype: 'maintoolbar',
        docked: 'top',
        // userCls: 'main-toolbar',
        ui: 'toolbar-principal',
        shadow: true
    }, {
        xtype: 'container',
        docked: 'left',
        userCls: 'main-nav-container',
        reference: 'navigation',
        layout: 'fit',
        items: [{
            xtype: 'treelist',
            reference: 'navigationTree',
            scrollable: true,
            ui: 'nav',
            bind: {
                store: '{stNavigationTree}',
            },
            expanderFirst: false,
            expanderOnly: false,
            listeners: {
                itemclick: 'onNavigationItemClick',
                selectionchange: 'onNavigationTreeSelectionChange'
            }
        }]
    }]
});
