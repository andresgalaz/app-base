Ext.define('a2m.Helper', {
    singleton: true,

    // rutaServidor: 'https://sistema-desa.hospitalaleman.com/compustrom/',
    rutaServidor: 'http://webapp2-desa.hospitalaleman.com:8081/compustrom/',

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

    cargaFormulario: function (cAccion, fnCallback) {
        var cAppName = Ext.getApplication().getName();
        var cUrl = cAppName + "/app/" + cAccion.replace(/\./g, '/') + '.js';
        var cNombreClase = cAppName + '.' + cAccion;

        if (Ext.isDefined(cNombreClase)) {
            objCreado = Ext.create(cAppName + '.' + cAccion);
            if (typeof (fnCallback) == 'function')
                fnCallback(objCreado);
            return;
        }

        Ext.Ajax.request({
            url: a2m.Helper.rutaServidor + cUrl,
            method: 'post',
            success: function (response, opts) {
                var srcStr = response.responseText;
                if (srcStr == null || srcStr == '')
                    return;
                console.log('a2m.Helper.cargaFormulario', opts);
                var objCreado = null;
                // Comienza con '{', es un objeto plano
                if (srcStr.match(/^[ \t]*{/) != null) {
                    objCreado = Ext.decode(srcStr);
                } else {
                    try {
                        Ext.globalEval(srcStr);
                        objCreado = Ext.create(cAppName + '.' + cAccion);
                    } catch (e) {
                        console.error('Al evaluar fuente o crear objeto por xtype:' + cAccion, e);
                    }
                }
                if (typeof (fnCallback) == 'function')
                    fnCallback(objCreado);
            },
            failure: function (response, opts) {
                console.error('server-side failure with status code ' + response.status);
            }
        })
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
                // url: a2m.Helper.rutaServidor + menu[i].cAccion,
                url: menu[i].cAccion,
                iconCls: menu[i].cIconCls,
                bind: {
                    html: '{cargandoForm}'
                }
            });
        }
        // Agrega panel principal al ViewPort
        Ext.Viewport.add(m);
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

        oGlobal = {};
        Ext.Ajax.request({
            url: a2m.Helper.rutaServidor + 'do/a2m/menuMovilLogin.bsh',
            method: 'post',
            params: {
                prm_data: Ext.util.Base64.encode(Ext.JSON.encode({
                    u: cUsuario,
                    p: cPassword
                })),
                prm_dataSource: 'xgenJNDI'
            },
            success: function (response, opts) {
                console.log('login:', response);
                var obj = Ext.decode(response.responseText);
                if (!obj.success) {
                    Ext.Msg.alert('Conexión', obj.message);
                    return;
                }
                oGlobal = {
                    depura: obj.depura,
                    ambiente: obj.ambiente,
                    cUsuario: obj.cUsuario,
                    pUsuario: obj.pUsuario,
                    cNombre: obj.cNombre,
                    tpUsuario: obj.tpUsuario,
                    cEmail: obj.cEmail
                };
                localStorage.setItem("usuario", Ext.encode(oGlobal));
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

        oGlobal = {};
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
                oGlobal = {
                    depura: obj.depura,
                    ambiente: obj.ambiente,
                    cUsuario: obj.cUsuario,
                    pUsuario: obj.pUsuario,
                    cNombre: obj.cNombre,
                    tpUsuario: obj.tpUsuario,
                    cEmail: obj.cEmail
                };
                localStorage.setItem("usuario", Ext.encode(oGlobal));
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