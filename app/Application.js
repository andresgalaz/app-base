/**
 * The main application class. An instance of this class is created by app.js when it
 * calls Ext.application(). This is the ideal place to handle application launch and
 * initialization details.
 */
Ext.define('a2m.Application', {
    extend: 'Ext.app.Application',
    name: 'a2m',
    views: ['a2m.view.login.Login'],

    // defaultToken : 'view.dashboard.Dashboard',
    // defaultToken : '',

    profiles: [
        'Phone',
        'Tablet'
    ],

    // quickTips: false,
    // platformConfig: {
    //     desktop: {
    //         quickTips: true
    //     }
    // },

    launch: function () {
        // Inicializa Firebase
        var me = this,
            cUsuario = localStorage.getItem("usuario") ? Ext.decode(localStorage.getItem("usuario")).cUsuario : null,
            
            config = {
                apiKey: "AIzaSyBRQpzafvP0lj_8sZYdVoPAjqU2enT-ULw",
                authDomain: "peha-d34fc.firebaseapp.com",
                databaseURL: "https://peha-d34fc.firebaseio.com",
                projectId: "peha-d34fc",
                storageBucket: "peha-d34fc.appspot.com",
                messagingSenderId: "332329094674"
            };

        try {
            firebase.initializeApp(config);
        } catch (e) {
            console.log("Al inicializar firebase", e);
        }

        try {
            if (firebase.messaging.isSupported()) {
                const msg = firebase.messaging();
                msg.usePublicVapidKey('BCuSqDX6UM5fTxVBaRIrCOJldhA0T4nBiq2Z4f4C0jDrcdbjUbK2q2N8IeRS9etRsOssHeYNfsL7o13JFfBvIIU');
    
                navigator.serviceWorker.register('./firebase-messaging-sw.js')
                    .then((registration) => {
                        msg.useServiceWorker(registration);
                        if (DEBUG) console.log('registration:', registration);
                            // Request permission and get token.....
                            msg.requestPermission()
                                .then(function () {
                                if (DEBUG) console.log('Notification permission granted.');
                                // TODO(developer): Retrieve an Instance ID token for use with FCM.
                                // ...

                                // Get Instance ID token. Initially this makes a network call, once retrieved
                                // subsequent calls to getToken will return from cache.
                                msg.getToken()
                                    .then(function (currentToken) {
                                        if (DEBUG) console.log('currentToken:', currentToken);

                                        if (currentToken) {
                                            sendTokenToServer(currentToken);
                                        } else {
                                            // Show permission request.
                                            if (DEBUG) console.log('No Instance ID token available. Request permission to generate one.');
                                            setTokenSentToServer(false);
                                        }
                                }).catch(function (err) {
                                    console.error('An error occurred while retrieving token. ', err);
                                    showToken('Error retrieving Instance ID token. ', err);
                                    setTokenSentToServer(false);
                                });
                            })
                        .catch(function (err) {
                            console.error('Unable to get permission to notify.', err);
                        });
                    });
    
                // Callback fired if Instance ID token is updated.
                msg.onTokenRefresh(function () {
                    msg.getToken().then(function (refreshedToken) {
                        if (DEBUG) console.log('Token refreshed.', refreshedToken);
                        // Indicate that the new Instance ID token has not yet been sent to the
                        // app server.
                        setTokenSentToServer(false);
                        window.localStorage.setItem('sentToServer', '0');
                        // Send Instance ID token to app server.
                        sendTokenToServer(refreshedToken);
                        // registraToken(refreshedToken);
                        // ...
                    }).catch(function (err) {
                        console.error('Unable to retrieve refreshed token ', err);
                        showToken('Unable to retrieve refreshed token ', err);
                    });
                });
    
                msg.onMessage(function (payload) {
                    var servidor = window.location.origin + window.location.pathname;

                    if (DEBUG) console.log('Message received. ', payload);
                    // [START_EXCLUDE]
                    // Update the UI to include the received message.
                    payload.notification.icon = '/resources/pwa96.png';
                    payload.notification.click_action = payload.data.url ? servidor + '#/' + payload.data.url : null;
                    // appendMessage(payload);
                    // [END_EXCLUDE]
                });
    
                function showToken(currentToken) {
                    if (DEBUG) console.log('showToken:', currentToken);
                    // Show token in console and UI.
                    var tokenElement = document.querySelector('#token');
                    tokenElement.textContent = currentToken;
                }

                function setTokenSentToServer(sent) {
                    if (DEBUG) console.log('setTokenSentToServer:', sent);
                    window.localStorage.setItem('sentToServer', sent ? '1' : '0');
                }

                function sendTokenToServer(currentToken) {
                    if (DEBUG) console.log('sendTokenToServer:', currentToken);
                    if (!isTokenSentToServer()) {
                        if (DEBUG) console.log('Sending token to server...');
                        // TODO(developer): Send the current token to your server.
                        setTokenSentToServer(true);
                    } else {
                        if (DEBUG) console.log('Token already sent to server so won\'t send it again unless it changes');
                    }

                    window.localStorage.setItem("token_firebase", currentToken);
                }

                function isTokenSentToServer() {
                    if (DEBUG) console.log('isTokenSentToServer');
                    return window.localStorage.getItem('sentToServer') === '1';
                }
    
                a2m.Helper.messaging = msg;
    
            } else {
                console.error('firebase no soporta este explorador');
                // Ext.Msg.alert('Login', 'El navegador que está utilizando no soporta firebase.', Ext.emptyFn)
            }
        } catch (e) {
            console.error('notificaciones:', e);
            // Ext.Msg.alert('Error al registrar Notificaciones Firebase'+ e.message);
        }

        // Verifica que los datos existan y que este conectado
        var token = localStorage.getItem('token'),
            hash = window.location.hash;
        
        if (cUsuario != null && token != null) {
            me.validaToken(cUsuario, token, null);
        
        } else {
            // Si es un redireccionamiento del mail no hace login
            if (hash.indexOf('view.page') == -1)  
                me.redirectTo('view.login.Login');
        }
    },

    creaMenuArbol: function (menu, oView) {
        var main = Ext.getApplication().getMainView(),
            store = main.getViewModel().getStore('stNavigationTree');

        if (oView)
            oView.destroy();

        store.setRoot({
            expanded: true,
            children: menu
        })
    },

    inicioGeolocalizacion: function() {
        var oUsr = Ext.decode(localStorage.getItem("usuario"));
        
        try {
            Ext.create('Ext.util.Geolocation', {
                autoUpdate: true,
                frequency: 600000, // 5 minutos
                listeners: {
                    locationupdate: function (geo) {
                        a2m.Helper.grabaLocal('gps', {
                            fecha: new Date(),
                            longitud: geo.getLongitude(),
                            latitud: geo.getLatitude(),
                            usuario_id: oUsr.pUsuario
                        })
                        if (DEBUG) console.log('Refresh Geolocation', 'New latitude: ' + geo.getLatitude() + ' , Longitude: ' + geo.getLongitude());
                    },
                    locationerror: function (geo, bTimeout, bPermissionDenied, bLocationUnavailable, message) {
                        if (bTimeout) {
                            a2m.Helper.grabaLocal('gps', {
                                fecha: new Date(),
                                error: 'timeout'
                            })
                        } else {
                            a2m.Helper.grabaLocal('gps', {
                                fecha: new Date(),
                                error: message
                            })
                        }
                    }
                }
            });
        } catch (e) {
            console.error('inicio:', e);
        }
    },

    registraToken: function() {
        var oUsr = Ext.decode(localStorage.getItem("usuario")),
            token = localStorage.getItem("token_firebase");
        
        if (DEBUG) console.log('[registraToken] token:' + token + ' ,pusuario:' + oUsr.pUsuario);

        if (oUsr.pUsuario && token) {
            a2m.Helper.grabaLocal('token', {
                usuario_id: oUsr.pUsuario,
                token: token
            });
        } else {
            console.error('[registraToken] No se obtuvo usr y token');
        }
    },

    validaToken: function (cUsuario, token, oView) {
        var me = this;

        oGlobal = {};
        Ext.Ajax.request({
            url: a2m.Helper.rutaServidor + 'menuMovilRetoken.bsh',
            method: 'post',
            params: {
                prm_data: Ext.util.Base64.encode(Ext.JSON.encode({
                    u: cUsuario,
                    p: token
                })),
                prm_dataSource: 'xgenJNDI'
                // TODO: Agregar Ext.os.name, Ext.os.deviceType y Ext.browser.identity
            },
            success: function (response, opts) {
                var obj = Ext.decode(response.responseText);
                if (!obj.success) {
                    // Muestra el mensaje de error del token y redirige login
                    Ext.Msg.alert('Conexión', obj.message, function () {
                        me.redirectTo('view.login.Login');
                    });

                    return;
                }

                oGlobal = {
                    depura: obj.depura,
                    ambiente: obj.ambiente,
                    cUsuario: obj.cUsuario,
                    pUsuario: obj.pUsuario,
                    cNombre: obj.cNombre,
                    tpUsuario: obj.tpUsuario,
                    cEmail: obj.cEmail,
                    bPasswordCaducada: obj.caducaPassword,
                    perfiles: obj.perfiles
                };

                localStorage.setItem("usuario", Ext.encode(oGlobal));
                localStorage.setItem("menu", Ext.encode(obj.menu));
                localStorage.setItem("token", obj.token);
                
                me.inicioGeolocalizacion();
                me.registraToken();

                // Hace la carga en forma diferida, para que la sesión tenga tiempo, sino aparece como deslogeado
                setTimeout(function () {
                    // Si está todo OK carga items del menu principal
                    me.creaMenuArbol(obj.menu, oView);
                    // Y apunta a la aplicación pro defecto.
                    // Maxito: desde aquí no hay otro modo porque no tenemos siempre el objeto VIEW en oView

                    if (obj.caducaPassword) {
                        me.redirectTo('view.login.PasswordChange');
                    } else {
                        // primero verifica que no venga una redireccionameinto en la ruta de incio
                        if (! /.+a2m\/#.+/.test(window.location) || /.+a2m\/#view.login.Login/.test(window.location))
                            // location.href = '#view.dashboard.Dashboard';
                            me.redirectTo('view.dashboard.Dashboard');
                    }
                }, 1000);
            },
            failure: function (response, opts) {
                console.error(response);
            }
        });
    },

    onAppUpdate: function () {
        Ext.Msg.confirm('Actualización', 'Existe una nueva versión de la app PE Profesionales.<br><b>¿Desea recargar?</b>',
            function (choice) {
                if (choice === 'yes') {
                    window.location.reload(true);
                }
            }
        );
    }
});
