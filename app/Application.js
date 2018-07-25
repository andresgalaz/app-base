/**
 * The main application class. An instance of this class is created by app.js when it
 * calls Ext.application(). This is the ideal place to handle application launch and
 * initialization details.
 */
Ext.define('a2m.Application', {
    extend: 'Ext.app.Application',

    name: 'a2m',

    quickTips: false,
    platformConfig: {
        desktop: {
            quickTips: true
        }
    },

    launch: function () {

        a2m.Helper.inicio();

        // Recupera la información de conexión de la información local
        var cUsuario = null;
        try {
            cUsuario = Ext.decode(localStorage.getItem("usuario")).cUsuario;
        } catch (e) {
            console.error("usuario no es un objeto", e);
        }
        var token = localStorage.getItem("token");
        // Verifica que los datos existan y que este conectado
        if (cUsuario != null && token != null) {
            a2m.Helper.validaToken(cUsuario, token, null);
        } else {
            // arma ventana de Login
            Ext.create({
                xtype: 'login'
            }).show();
        }

    },

    onAppUpdate: function () {
        Ext.Msg.confirm('Application Update', 'This application has an update, reload?',
            function (choice) {
                if (choice === 'yes') {
                    window.location.reload();
                }
            }
        );
    }
});