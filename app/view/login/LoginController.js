Ext.define('a2m.view.login.LoginController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.login',

    onLoginClick: function (sender) {
        var me = this,
            refs = me.getReferences(),
            form = refs.formpanel,
            vals = form.getValues;
        
        if (form.isValid()) {
            a2m.Helper.login(vals.usuario, vals.password, me.getView());
        }
        // Obtiene los valores de los cmapos del formulario de Login
        // var cUsuario = sender.up('formpanel').getFields('fldUsuario').getValue();
        // var cPassword = sender.up('formpanel').getFields('fldPassword').getValue();
        // Ejecuta login, si está ok crea paneles
        // a2m.Helper.login(cUsuario, cPassword, this.getView());
    }
});