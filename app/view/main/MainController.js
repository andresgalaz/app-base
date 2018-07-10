/**
 * This class is the controller for the main view for the application. It is specified as
 * the "controller" of the Main view class.
 */
Ext.define('a2m.view.main.MainController', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.main',

    onItemSelected: function (sender, record) {
        Ext.Msg.confirm('Confirm', 'Are you sure?', 'onConfirm', this);
    },

    onConfirm: function (choice) {
        a2m.Helper.someFn('Holas');
        
        if (choice === 'yes') {
            // Nada xy
        }
        if (choice === 'no') {
            this.onClickButton();
        }
    },

    onTabChange: function (sender) { //, newRecord, oldRecord, eOpts) {
        var panel = sender.getActiveItem();
        if (!panel || !panel.url || panel.bCargado === true)
            return;

        Ext.Ajax.request({
            url: a2m.Helper.rutaServidor + panel.url,
            method: 'post',
            success: function (response, opts) {
                var obj = Ext.decode(response.responseText);
                console.log(opts);
                panel.bCargado = true;
                panel.setHtml(null);
                panel.add(obj);
            },
            failure: function (response, opts) {
                panel.setHtml('server-side failure with status code ' + response.status);
            }
        })
    },

    onClickButton: function () {
        var a2mLogin = Ext.decode(localStorage.getItem("a2mLogin"));
        console.log(a2mLogin);
        // Remove the localStorage key/value
        localStorage.removeItem('a2mLogin');

        // Remove Main View
        this.getView().destroy();

        // Add the Login Window
        var p = Ext.create({
            xtype: 'login'
        });
        p.show();
    }
});