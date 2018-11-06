Ext.define('a2m.Helper', {
    singleton: true,
    rutaServidor: '../doit/a2m/',

    usuario: null,
    messaging: null,

    inicio: function () {
        if (typeof (oGlobal) == 'undefined') return;

        try {
            // Va a refrescar la posición cada minuto
            Ext.create('Ext.util.Geolocation', {
                autoUpdate: true,
                frequency: 600000, // 5 minutos
                listeners: {
                    locationupdate: function (geo) {
                        a2m.Helper.grabaLocal('gps', {
                            fecha: new Date(),
                            longitud: geo.getLongitude(),
                            latitud: geo.getLatitude(),
                            usuario_id: oGlobal.pUsuario
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

        try {
            var msg = firebase.messaging();
            msg.usePublicVapidKey('BCuSqDX6UM5fTxVBaRIrCOJldhA0T4nBiq2Z4f4C0jDrcdbjUbK2q2N8IeRS9etRsOssHeYNfsL7o13JFfBvIIU');

            navigator.serviceWorker.register('./firebase-messaging-sw.js')
                .then((registration) => {
                    msg.useServiceWorker(registration);
                    if (DEBUG) console.log('registration:', registration);

                    // Request permission and get token.....
                    msg.requestPermission().then(function () {
                        if (DEBUG) console.log('Notification permission granted.');
                        // TODO(developer): Retrieve an Instance ID token for use with FCM.
                        // ...

                        // Get Instance ID token. Initially this makes a network call, once retrieved
                        // subsequent calls to getToken will return from cache.
                        msg.getToken().then(function (currentToken) {
                            if (DEBUG) console.log('currentToken:', currentToken);
                            if (currentToken) {
                                sendTokenToServer(currentToken);
                                updateUIForPushEnabled(currentToken);
                            } else {
                                // Show permission request.
                                if (DEBUG) console.log('No Instance ID token available. Request permission to generate one.');
                                // Show permission UI.
                                updateUIForPushPermissionRequired();
                                setTokenSentToServer(false);
                            }
                        }).catch(function (err) {
                            console.error('An error occurred while retrieving token. ', err);
                            showToken('Error retrieving Instance ID token. ', err);
                            setTokenSentToServer(false);
                        });

                    }).catch(function (err) {
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
                    // ...
                }).catch(function (err) {
                    console.error('Unable to retrieve refreshed token ', err);
                    showToken('Unable to retrieve refreshed token ', err);
                });
            });

            msg.onMessage(function (payload) {
                if (DEBUG) console.log('Message received. ', payload);
                // [START_EXCLUDE]
                // Update the UI to include the received message.
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
            }

            function isTokenSentToServer() {
                if (DEBUG) console.log('isTokenSentToServer');
                return window.localStorage.getItem('sentToServer') === '1';
            }

            a2m.Helper.messaging = msg;

        } catch (e) {
            console.error('notificaciones:', e);
            Ext.Msg.alert('Error al registrar Notificaciones Firebase'+ e.message);
        }
    },

    cargaFormulario: function (cAccion, fnCallback) {
        var cAppName = Ext.getApplication().getName();
        var cUrl = cAppName + "/app/" + cAccion.replace(/\./g, '/') + '.js';
        var cNombreClase = cAppName + '.' + cAccion;

        Ext.require(cNombreClase, function () {
            var objCreado = Ext.create(cNombreClase);
            if (typeof (fnCallback) == 'function')
                fnCallback(objCreado);
        });
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

    /**
     * Graba datos en la memoria local. La información se identifica por el TAG
     * que viene en el parámetro cIdData, estos TAG se van acumulando como arreglos
     * en el caso que no se pueda grabar. Si es posible gabar, el objeto 'salida' de
     * la memoria local es borrado y se vuelve a cero, hasta la siguiente grabación.
     */
    grabaLocal: function (cIdData, oJson) {
        var oSalida = Ext.decode(localStorage.getItem("salida")) || {};
        if (!oSalida[cIdData])
            oSalida[cIdData] = [];
        oSalida[cIdData].push(oJson);

        Ext.Ajax.request({
            url: a2m.Helper.rutaServidor + 'grabaRemotoProcesa.bsh',
            method: 'post',
            params: {
                prm_data: Ext.util.Base64.encode(Ext.JSON.encode(oSalida)),
                prm_dataSource: 'xgenJNDI'
            },
            success: function (response, opts) {
                if (DEBUG) console.log('GrabaLocal:', response);
                var resp = Ext.decode(response.responseText);
                if (resp.success) {
                    // Grabación exitosa, se elimina la información local
                    localStorage.removeItem("salida");
                } else {
                    // Como no se pudo enviar la información, se mantiene localmente
                    localStorage.setItem("salida", Ext.encode(oSalida));
                }
            },
            failure: function (response, opts) {
                console.error('GrabaLocal(failure:', response);
                // Como no se pudo enviar la información, se mantiene localmente
                localStorage.setItem("salida", Ext.encode(oSalida));
            }
        });
    },

    jsonCall: function (params, fnCallback) {
        Ext.Ajax.request({
            url: a2m.Helper.rutaServidor + 'jsonCall.bsh',
            data: params,
            method: 'post',
            success: function (response, opts) {
                var srcStr = response.responseText;
                var objResp = null;
                if (srcStr == null || srcStr == '')
                    objResp = null;
                else {
                    // Comienza con '{', es un JSON y se convierte a objeto
                    if (srcStr.match(/^[ \t]*[{]/) != null)
                        objResp = Ext.decode(srcStr);
                    else
                        objResp = srcStr;

                }
                if (typeof (fnCallback) == 'function')
                    fnCallback(objResp);
            },
            failure: function (response, opts) {
                console.error('server-side failure with status code ' + response.status);
                alert('server-side failure with status code ' + response.status + " " + e.message);
            }
        })
    },

    validaToken: function (cUsuario, token, oView) {
        var me = this;

        oGlobal = {};
        Ext.Ajax.request({
            url: me.rutaServidor + 'menuMovilRetoken.bsh',
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
                    Ext.Msg.alert('Conexión', obj.message, function () {
                        // Muestra el mensaje de error del token y levanta el ventana de login
                        Ext.create({
                            xtype: 'view.login.Login'
                        }).show();
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
                me.inicio();

                localStorage.setItem("usuario", Ext.encode(oGlobal));
                localStorage.setItem("menu", Ext.encode(obj.menu));
                localStorage.setItem("token", obj.token);
                // Hace la carga en forma diferida, para que la sesión tenga tiempo, sino aparece como deslogeado
                setTimeout(function () {
                    // Si está todo OK carga items del menu principal
                    me.creaMenuArbol(obj.menu, oView);
                    // Y apunta a la aplicación pro defecto.
                    // Maxito: desde aquí no hay otro modo porque no tenemos siempre el objeto VIEW en oView

                    // primero verifica que no venga una redireccionameinto en la ruta de incio
                    if (! /.+a2m\/#.+/.test(window.location) || /.+a2m\/#view.login.Login/.test(window.location))
                        location.href = '#view.dashboard.Dashboard';
                }, 1000);
            },
            failure: function (response, opts) {
                console.error(response);
            }
        });
    },

});
