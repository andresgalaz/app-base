Ext.define('a2m.view.main.Toolbar', {
    extend: 'Ext.Toolbar',
    xtype: 'maintoolbar',

    requires: [
        'Ext.Button',
        'Ext.Img',
        'Ext.SegmentedButton'
    ],

    items: [
        {
            // This component is moved to the floating nav container by the phone profile
            xtype: 'component',
            reference: 'logo',
            userCls: 'main-logo',
            html: '<b>App PE</b> Profesionales'
        }, 
        {
            ui: 'header',
            iconCls: 'x-fa fa-bars',
            margin: '0 0 0 10',
            listeners: {
                tap: 'onToggleNavigationSize'
            }
        }, '->', 
        {
            ui: 'header',
            iconCls: 'x-fa fa-envelope',
            href: 'view.mensajes.Inbox',
            margin: '0 7 0 0',
            handler: 'toolbarButtonClick'
        }, 
        {
            ui: 'header',
            iconCls: 'x-fa fa-th-large',
            href: 'view.dashboard.Dashboard',
            margin: '0 7 0 0',
            handler: 'toolbarButtonClick'
        }, 
        // {
        //     xtype: 'image',
        //     userCls: 'main-user-image small-image circular',
        //     alt: 'Current user image',
        //     src: '<shared>/images/user-profile/2.png'
        // }
    ]
});
