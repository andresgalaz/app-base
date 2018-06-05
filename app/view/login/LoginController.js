Ext.define('a2m.view.login.LoginController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.login',

    onLoginClick: function (sender) {
        // Obtiene los valores de los cmapos del formulario de Login
        var cUsuario = sender.up('formpanel').getFields('fldUsuario').getValue();
        var cPassword = sender.up('formpanel').getFields('fldPassword').getValue();
        console.log(cUsuario, cPassword);

        // Conecta al servidor

        // Guarda la información de conexión en el ambiente local
        localStorage.setItem("a2mLogin", Ext.encode({ usuario: cUsuario, password: cPassword, conectado: true }));

        // Remove Login Window
        this.getView().destroy();

        // Add the main view to the viewport
        Ext.Viewport.add(Ext.create({
            xtype: 'app-main'
        }));

    }
});
