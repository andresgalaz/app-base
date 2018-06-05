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
        if (choice === 'yes') {
            //
        }
        if (choice === 'no') {
            this.onClickButton();
        }
    },

    onTabChange: function (sender) { //, newRecord, oldRecord, eOpts) {
        var panel = sender.getActiveItem();
        console.log('onTabChange:', panel, panel.url);
        var RUTA_GLOBAL = 'https://desa.snapcar.com.ar/wappTest/'
        Ext.Ajax.request({
            url: RUTA_GLOBAL + panel.url,
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
        // Remove the localStorage key/value
        localStorage.removeItem('TutorialLoggedIn');

        // Remove Main View
        this.getView().destroy();

        // Add the Login Window
        var p = Ext.create({
            xtype: 'login'
        });
        p.show();
    }
});