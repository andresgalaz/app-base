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
        var token = localStorage.getItem("token");
        console.log("token:", token);
        // Verifica que los datos existan y que este conectado
        if (token) {
SEGUIR DESDE AQUI: si hay token pedir menu
si falla usar la memoria local
            var arrItem = Ext.decode(localStorage.getItem("a2mItems"));
            // Crea panel principal
            var m = Ext.create({
                xtype: 'app-main'
            });
            // Construye item-tab
            for (i = 0; i < arrItem.length; i++) {
                m.add({
                    title: arrItem[i].cNombreRecurso,
                    url: RUTA_GLOBAL + arrItem[i].cAccion,
                    iconCls: arrItem[i].cIconCls,
                    bind: {
                        html: '{cargandoForm}'
                    }
                });
            }

            Ext.Viewport.add(m);
        } else {
            var p = Ext.create({
                xtype: 'login'
            });
            p.show();
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