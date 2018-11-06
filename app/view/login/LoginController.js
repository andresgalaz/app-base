Ext.define('a2m.view.login.LoginController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.login',

    init: function () {
    },

    login: function (cUsuario, cPassword, oView) {
        var me = this,
            view = me.getView();

        oGlobal = {};
        Ext.Ajax.request({
            url: a2m.Helper.rutaServidor + 'menuMovilLogin.bsh',
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
                // TODO Walas: Agregar parametro bPasswordCaducada
                oGlobal = {
                    depura: obj.depura,
                    ambiente: obj.ambiente,
                    cUsuario: obj.cUsuario,
                    pUsuario: obj.pUsuario,
                    cNombre: obj.cNombre,
                    tpUsuario: obj.tpUsuario,
                    cEmail: obj.cEmail,
                    perfiles: obj.perfiles
                };
                a2m.Helper.inicio();

                localStorage.setItem("usuario", Ext.encode(oGlobal));
                localStorage.setItem("menu", Ext.encode(obj.menu));
                localStorage.setItem("token", obj.token);

                // TODO Maxi: Si modifica password redirigir a view.login.PasswordChange

                // Hace la carga en forma diferida, para que la sesión tenga tiempo, sino aparece como deslogeado
                setTimeout(function () {
                    // Si está todo OK
                    // Carga items del menu principal
                    a2m.Helper.creaMenuArbol(obj.menu);

                    // Y apunta a la aplicación pro defecto.
                    // Maxito: desde aquí no hay otro modo porque no tenemos siempre el objeto VIEW en oView

                    // primero verifica que no venga una redireccionameinto en la ruta de incio
                    if (! /.+a2m\/#.+/.test(window.location))
                        location.href = '#view.dashboard.Dashboard';

                }, 1000);

                view.destroy();
            },
            failure: function (response, opts) {
                console.error(response);
            }
        });
    },
    /*
     * Elimina la sesión con el BSH y después elimina la localStorage, excpeto las posiciones GPS.
     * Finalmente refresca la página
     */
    salir: function () {
        var me = this;
        if (DEBUG) console.log('Desconectando .... ');
        localStorage.removeItem("usuario");
        localStorage.removeItem("menu");
        localStorage.removeItem("token");
        Ext.Ajax.request({
            url: a2m.Helper.rutaServidor + 'menuMovilSalir.bsh',
            method: 'post',
            params: { prm_dataSource: 'xgenJNDI' },
            success: function (response, opts) {
                if (DEBUG) console.log(response);
                setTimeout(() => {
                    location.href = '#view.login.Login';
                }, 2000);
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

    onModificarClaveClick: function () {
        var me = this,
            view = me.getView(),
            jsonData = {};

        if (view.isValid()) {
            jsonData['DATOS'] = view.getValues();
            a2m.Helper.grabaLocal('modificarClave', jsonData);

            Ext.Msg.alert('Login', 'Clave modificada con éxito');

            me.redirectTo('view.dashboard.Dashboard');
        }
    },

    onRecuperarClaveClick: function () {
        // if (DEBUG) console.log('[onRecuperarClick] click');
        var me = this,
            view = me.getView(),
            jsonData = {};
        
        if (view.isValid()) {
            jsonData['DATOS'] = view.getValues();
            a2m.Helper.grabaLocal('recuperarClave', jsonData);

            Ext.Msg.alert('Login', 'Se ha enviado un email a su casilla con una nueva contraseña.<br>Verifique e ingrésela en el sistema');

            me.redirectTo('view.login.Login');

        } else {
            Ext.Msg.alert('Login', 'Ingrese usuario');
        }
    }
});