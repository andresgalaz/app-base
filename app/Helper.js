Ext.define('a2m.Helper', {
    singleton: true,
    rutaServidor: '../doit/a2m/',

    usuario: null,
    messaging: null,

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
});