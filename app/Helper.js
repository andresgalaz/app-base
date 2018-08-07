Ext.define('a2m.Helper', {
    singleton: true,

    // rutaServidor: 'https://sistema-desa.hospitalaleman.com/compustrom/',
    // rutaServidor: 'http://webapp2-desa.hospitalaleman.com:8081/compustrom/',
    // rutaServidor: 'http://192.168.0.5:8080/webDesap_4.0/',
    rutaServidor: '../',

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
            console.error('inicio:', e);
            alert('inicio:' + e.getMessage());
        }
    },

    cargaFormulario: function (cAccion, fnCallback) {
        var cAppName = Ext.getApplication().getName();
        var cUrl = cAppName + "/app/" + cAccion.replace(/\./g, '/') + '.js';
        var cNombreClase = cAppName + '.' + cAccion;

        if (a2m.Helper.depuraClase && a2m.Helper.depuraClase.indexOf(cNombreClase) >= 0) {
            try {
                objCreado = Ext.create(cNombreClase);
                if (typeof (fnCallback) == 'function')
                    fnCallback(objCreado);
            } catch (e) {
                console.error('Al crear formulario clase:' + cNombreClase, e);
                alert('Al crear formulario clase:' + cNombreClase + e.getMessage());

            }
            return;
        }

        Ext.require(cNombreClase, function () {
            var objCreado = Ext.create(cNombreClase);
            if (typeof (fnCallback) == 'function')
                fnCallback(objCreado);

        });

        /*
        Ext.Ajax.request({
            url: a2m.Helper.rutaServidor + cUrl,
            method: 'post',
            success: function (response, opts) {
                var srcStr = response.responseText;
                if (srcStr == null || srcStr == '')
                    return;

                var objCreado = null;
                // Comienza con '{', es un objeto plano
                if (srcStr.match(/^[ \t]*{/) != null) {
                    objCreado = Ext.decode(srcStr);
                } else {
                    try {
                        Ext.globalEval(srcStr);
                        objCreado = Ext.create(cNombreClase);
                    } catch (e) {
                        console.error('Al evaluar fuente o crear objeto por xtype:' + cAccion, e);
                        alert('Al evaluar fuente o crear objeto por xtype:' + cAccion+e.getMessage());

                    }
                }
                if (typeof (fnCallback) == 'function')
                    fnCallback(objCreado);
            },
            failure: function (response, opts) {
                console.error('server-side failure with status code ' + response.status);
                alert('server-side failure with status code ' + response.status+e.getMessage());
            }
        })
        */
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
                xtype: 'panel',
                title: menu[i].cNombreRecurso,
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
                console.log('GrabaLocal:', response);
                // Grabación exitosa, se elimina la información local
                localStorage.removeItem("salida");
            },
            failure: function (response, opts) {
                console.log('GrabaLocal(failure:', response);
                // Como no se pudo enviar la información, se mantiene localmente
                localStorage.setItem("salida", Ext.encode(oSalida));
            }
        });
    },

    jsonCall: function (params, fnCallback) {
        Ext.Ajax.request({
            url: a2m.Helper.rutaServidor + 'do/jsonCall',
            data : params,
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
                alert('server-side failure with status code ' + response.status+e.getMessage());
            }
        })
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
