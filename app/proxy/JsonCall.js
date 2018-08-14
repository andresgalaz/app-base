Ext.define('a2m.proxy.JsonCall', {
    extend: 'Ext.data.proxy.Ajax',
    alias: 'proxy.jsoncall',

    url : '../do/jsonCall',
    type : 'ajax',
    reader : {
        type : 'json',
        rootProperty : 'records',
        totalProperty : 'count'
    },
    listeners: {
        exception: function(read, res, err, eOpts) {
            var me = this;

            if(!err.success) {
                var jsonRes = Ext.decode(res.responseText);

                if (jsonRes.message == 'No está conectado, o la sesión está vencida por tiempo') {
                    Ext.Msg.show({
                        title: 'HA - Sistema Programas Especiales',
                        message: 'No está conectado, o la sesión está vencida por tiempo.<br>Debe volver a loguearse para continuar',
                        buttons: Ext.Msg.OK,
                        icon: Ext.Msg.INFO,
                        fn: function(btn) {
                            if (btn === 'ok') {
                                me.pnLogin = Ext.create({
                                    xtype : 'view.login.Login',
                                    listeners: {
                                        close: 'onLoginOk'
                                    }
                                }).show();
                            }
                        }
                    });
                } else {
                    console.error('Error inesperado JsonCall:', res.responseText);
                    Ext.Msg.show({
                        title: 'Error Inesperado',
                        message: jsonRes.message,
                        buttons: Ext.Msg.OK,
                        icon: Ext.Msg.ERROR
                    });
                }
            }
        }
    }   
});
