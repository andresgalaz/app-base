Ext.define('a2m.Helper', {
    singleton: true,
    rutaServidor: 'https://sistema-desa.hospitalaleman.com/compustrom/',
    usuario: null,
    inicio: function () {
        try {
            // Va a refrescar la posición cada minuto
            Ext.create('Ext.util.Geolocation', {
                autoUpdate: true,
                frequency: 60000,
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
        // if (Ext.os.deviceType != 'Desktop') {
        //     RUTA_GLOBAL = 'https://desa.snapcar.com.ar/wappTest/'
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
        })
    }
});