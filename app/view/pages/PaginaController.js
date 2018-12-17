Ext.define('a2m.view.pages.PaginaController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.pagina',

    enviarTicket: function(ticket_id) {
        if (DEBUG) console.log('[enviarTicket] ticket_id:' + ticket_id);
        
        Ext.Ajax.request({
            url: a2m.Helper.rutaServidor + 'ticket.bsh',
            method: 'post',
            params: {
                prm_ticket: ticket_id,
                prm_dataSource: 'xgenJNDI'
            },
            success: function (response, opts) {
                var obj = Ext.decode(response.responseText);

                if (obj.success) {
                    var rta = obj.records[0];

                    if (rta.EXITO == 1) {
                        Ext.Msg.alert('Solicitud Derivación', rta.MENSAJE);
                    } else {
                        Ext.Msg.alert('Atención!', rta.MENSAJE);
                    }
                } else {
                    console.error('Error inesperado, respuesta: ' + obj.message);
                }
            },
            failure: function (response, opts) {
                console.error('server-side failure with status code ' + response.status);
                alert('Error del servidor. Verifique señal e intente nuevamente');
            }
        });
    },

    onCancelaTraslado: function(ticket_id) {
        if (DEBUG) console.log('[onCancelaTraslado] ticket_id:' + ticket_id);
        this.enviarTicket(ticket_id);
    },

    onRespuestaSolicitud: function(ticket_id) {
        this.enviarTicket(ticket_id);
    }
});