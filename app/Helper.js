Ext.define('a2m.Helper', {
    singleton: true,

    // rutaServidor: 'https://sistema-desa.hospitalaleman.com/compustrom/',
    rutaServidor: 'http://192.168.0.5:8080/webDesap_4.0/',

    usuario: null,

    inicio: function () {
        try {
            // Va a refrescar la posición cada minuto
            Ext.create('Ext.util.Geolocation', {
                autoUpdate: true,
                frequency: 600000,
                listeners: {
                    locationupdate: function (geo) {
                        // alert('New latitude: ' + geo.getLatitude());
                        a2m.Helper.grabaLocal('gps', {
                            fecha: new Date(),
                            longitud: geo.getLongitude(),
                            latitud: geo.getLatitude()
                        })
                        console.log('Refresh Geolocation', 'New latitude: ' + geo.getLatitude() + ' , Longitude: ' + geo.getLongitude());
                    },
                    locationerror: function (geo, bTimeout, bPermissionDenied, bLocationUnavailable, message) {
                        if (bTimeout) {
                            a2m.Helper.grabaLocal('gps', {
                                fecha: new Date(),
                                error: 'timeour'
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
            console.log('inicio:', e);

        }
    },

    creaPeneles: function (menu, oView) {
        // Ext.Viewport.destroy();
        if (oView)
            oView.destroy();
        // Crea panel principal
        var m = Ext.create({
            xtype: 'app-main'
        });
        // Construye item-tab
        for (i = 0; i < menu.length; i++) {
            m.add({
                title: menu[i].cNombreRecurso,
                url: a2m.Helper.rutaServidor + menu[i].cAccion,
                iconCls: menu[i].cIconCls,
                bind: {
                    html: '{cargandoForm}'
                }
            });
        }
        // Agrega panel principal al ViewPort
        Ext.Viewport.add(m);

        // var pnLogin = Ext.get('panelLogin');
        // if (pnLogin) {
        //     pnLogin.hide();
        //     pnLogin.destroy();
        // }
    },


    grabaLocal: function (cIdData, oJson) {
        var oSalida = Ext.decode(localStorage.getItem("salida")) || {};
        if (!oSalida[cIdData])
            oSalida[cIdData] = [];
        oSalida[cIdData].push(oJson);

        Ext.Ajax.request({
            url: a2m.Helper.rutaServidor + 'do/a2m/grabaRemotoProcesa.bsh',
            method: 'post',
            params: {
                prm_data: Ext.util.Base64.encode(Ext.JSON.encode(oSalida)),
                prm_dataSource: 'xgenJNDI'
            },
            success: function (response, opts) {
                console.log(response);
                // Grabación exitosa, se elimina la información local
                localStorage.removeItem("salida");
            },
            failure: function (response, opts) {
                console.log(response);
                // Como no se pudo enviar la información, se mantiene localmente
                localStorage.setItem("salida", Ext.encode(oSalida));
            }
        });
    },

    login: function (cUsuario, cPassword, oView) {

        a2m.Helper.usuario = null;

        Ext.Ajax.request({
            url: a2m.Helper.rutaServidor + 'do/a2m/menuMovilLogin.bsh',
            method: 'post',
            params: {
                prm_data: Ext.util.Base64.encode(Ext.JSON.encode({
                    u: cUsuario,
                    p: cPassword
                })),
                prm_dataSource: 'xgenJNDI'
                // TODO: Agregar Ext.os.name, Ext.os.deviceType y Ext.browser.identity
            },
            success: function (response, opts) {
                console.log('login:', response);
                var obj = Ext.decode(response.responseText);
                if (!obj.success) {
                    Ext.Msg.alert('Conexión', obj.message);
                    return;
                }
                a2m.Helper.usuario = cUsuario;
                localStorage.setItem("usuario", cUsuario);
                localStorage.setItem("menu", Ext.encode(obj.menu));
                localStorage.setItem("token", obj.token);
                // Si está todo OK cra paneles
                a2m.Helper.creaPeneles(obj.menu, oView);
            },
            failure: function (response, opts) {
                console.error(response);
            }
        });
    },

    validaToken: function (cUsuario, token, oView) {

        a2m.Helper.usuario = null;
        console.log({
            u: cUsuario,
            p: token
        });
        Ext.Ajax.request({
            url: a2m.Helper.rutaServidor + 'do/a2m/menuMovilRetoken.bsh',
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
                console.log('validaToken:', response);
                var obj = Ext.decode(response.responseText);
                if (!obj.success) {
                    Ext.Msg.alert('Conexión', obj.message, function () {
                        // Muestra el mensaje de error del token y levanta el ventana de login
                        Ext.create({
                            xtype: 'login'
                        }).show();
                    });
                    return;
                }
                localStorage.setItem("menu", Ext.encode(obj.menu));
                localStorage.setItem("token", obj.token);
                // Si está todo OK cra paneles
                a2m.Helper.creaPeneles(obj.menu, oView);
            },
            failure: function (response, opts) {
                console.error(response);
            }
        });
    }
});
