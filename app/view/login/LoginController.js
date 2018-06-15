Ext.define('a2m.view.login.LoginController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.login',

    onLoginClick: function (sender) {

        // Valores posibles de Phone y Desktop:  Ext.os.deviceType
        RUTA_GLOBAL = '';
        if (Ext.os.deviceType != 'Desktop') {
            RUTA_GLOBAL = 'https://desa.snapcar.com.ar/wappTest/'
        }

        var vista = this.getView();

        Ext.Ajax.request({
            url: RUTA_GLOBAL + 'do/PE/menuMovilLogin.bsh',
            method: 'post',
            success: function (response, opts) {
                // Remove Login Window
                vista.destroy();
                //
                var obj = Ext.decode(response.responseText);
                var arrItem = obj.response;
                localStorage.setItem("a2mItems", Ext.encode(arrItem));
        
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
                panel.setHtml('server-side failure with status code ' + response.status + '<br/>' +
                    RUTA_GLOBAL + 'do/PE/menuMovilLogin.bsh'
                );
            }
        });

        // Obtiene los valores de los cmapos del formulario de Login
        var cUsuario = sender.up('formpanel').getFields('fldUsuario').getValue();
        var cPassword = sender.up('formpanel').getFields('fldPassword').getValue();
        console.log(cUsuario, cPassword);

        // Conecta al servidor

        // Guarda la información de conexión en el ambiente local
        localStorage.setItem("a2mLogin", Ext.encode({
            usuario: cUsuario,
            password: cPassword,
            conectado: true
        }));

    }
});