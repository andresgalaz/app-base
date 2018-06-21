Ext.define('a2m.view.login.LoginController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.login',

    onLoginClick: function (sender) {
        // Obtiene los valores de los cmapos del formulario de Login
        var cUsuario = sender.up('formpanel').getFields('fldUsuario').getValue();
        var cPassword = sender.up('formpanel').getFields('fldPassword').getValue();
        console.log(cUsuario, cPassword);


        // Valores posibles de Phone y Desktop:  Ext.os.deviceType
        // RUTA_GLOBAL = '../';
        RUTA_GLOBAL = '../'; // localhost:1841
        if (Ext.os.deviceType != 'Desktop') {
            RUTA_GLOBAL = 'https://desa.snapcar.com.ar/wappTest/'
        }

        var vista = this.getView();

        Ext.Ajax.request({
            url: RUTA_GLOBAL + 'do/a2m/menuMovilLogin.bsh',
            method: 'post',
            params: {
                prm_data: Ext.util.Base64.encode(Ext.JSON.encode({
                    u: cUsuario,
                    p: cPassword
                })),
                prm_dataSource: 'xgenJNDI'
            },
            success: function (response, opts) {
                // Remove Login Window
                vista.destroy();
                //
                var obj = Ext.decode(response.responseText);
                var arrItem = obj.menu;
                localStorage.setItem("menu", Ext.encode(arrItem));
                localStorage.setItem("token", Ext.encode(obj.token));

                // Crea panel principal
                var m = Ext.create({
                    xtype: 'app-main'
                });
                // Construye item-tab
                for (i = 0; i < arrItem.length; i++) {
                    m.add({
                        title: arrItem[i].cNombreRecurso,
                        url: RUTA_GLOBAL + arrItem[i].cAccion,
                        iconCls: arrItem[i].cIconCls,
                        bind: {
                            html: '{cargandoForm}'
                        }
                    });
                }
                // Agrega panel principal al ViewPort
                Ext.Viewport.add(m);
            },
            failure: function (response, opts) {
                console.log(response);
                // panel.setHtml('server-side failure with status code ' + response.status + '<br/>' +
                //     RUTA_GLOBAL + 'do/PE/menuMovilLogin.bsh'
                // );
            }
        });

        // Conecta al servidor

        // Guarda la conexión en la memoria local
        a2m.Helper.usuario = cUsuario;
        // Guarda la información de conexión en el ambiente local
        localStorage.setItem("a2mLogin", Ext.encode({
            usuario: cUsuario,
            password: cPassword,
            conectado: true
        }));

    }
});