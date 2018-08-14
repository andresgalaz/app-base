Ext.define('a2m.view.login.LoginController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.login',

    init: function(){
        this.rutaServidor = 'http://webapp2-desa.hospitalaleman.com:8081/compustrom/';
    },

    login: function (cUsuario, cPassword, oView) {
        var me = this,
            view = me.getView();

        oGlobal = {};
        Ext.Ajax.request({
            url: me.rutaServidor + 'do/a2m/menuMovilLogin.bsh',
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
                
                // Si está todo OK carga items del menu principal
                a2m.Helper.creaMenuArbol(obj.menu);

                view.destroy();
            },
            failure: function (response, opts) {
                console.error(response);
            }
        });
    },

    onLoginClick: function (sender) {
        var me = this,
            // refs = me.getReferences(),
            form = sender.up('formpanel');

        if (form && form.isValid()) {
            var vals = form.getValues();
            me.login(vals.usuario, vals.password);
        }
    },

    onRecuperarClave: function() {

    },

    onRecuperarClaveClick: function() {
        console.log('[onRecuperarClick] click');
    }
});