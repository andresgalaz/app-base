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

        // Recupera la información de conexión de la información local
        var a2mLogin = Ext.decode(localStorage.getItem("a2mLogin"));
        console.log(a2mLogin);

        try {
            // Va a refrescar la posición cada minuto
            Ext.create('Ext.util.Geolocation', {
                autoUpdate: true,
                frequency: 60000,
                listeners: {
                    locationupdate: function (geo) {
                        // alert('New latitude: ' + geo.getLatitude());
                        Ext.Msg.alert('Refresh Geolocation', 'New latitude: ' + geo.getLatitude() + ' , Longitude: ' + geo.getLongitude());
                    },
                    locationerror: function (geo, bTimeout, bPermissionDenied, bLocationUnavailable, message) {
                        if (bTimeout) {
                            alert('Timeout occurred.');
                        } else {
                            alert('Error occurred:' + message);
                        }
                    }
                }
            });
        } catch (e) {
            alert(e.message);
        }

        // Verifica que los datos existan y que este conectado
        if (a2mLogin && a2mLogin.conectado === true) {
            Ext.Viewport.add(Ext.create({
                xtype: 'app-main'
            }));
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