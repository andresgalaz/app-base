Ext.define('a2m.view.login.LoginController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.login',

    onLoginClick: function (sender) {
        // Obtiene los valores de los cmapos del formulario de Login
        var cUsuario = sender.up('formpanel').getFields('fldUsuario').getValue();
        var cPassword = sender.up('formpanel').getFields('fldPassword').getValue();
        console.log('onLoginClick:', cUsuario, cPassword);

        // Ejecuta login, si está ok crea paneles
        a2m.Helper.login(cUsuario, cPassword, this.getView());
    }
});