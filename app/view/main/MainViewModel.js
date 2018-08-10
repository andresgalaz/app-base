Ext.define('a2m.view.main.MainViewModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.main',

    data: {
        currentView: null,
        cargandoForm: "<h3>Cargando Formulario ... espere</h3>",
        name: "a2m"
    },
        
    stores: {
        // Store con los accesos que tiene el usuario al sistema
        stNavigationTree: {
            type: 'tree',
            
            fields: [
                { name: "text" },
                { name: "cTpAcceso" },
                { name: "leaf", type:'boolean' },
                { name: "viewType" },
                { name: "cCodArbol" },
                { name: "iconCls" }
            ], 

            clearOnLoad: true, 

            root: {
                expanded: true
            },

            // proxy: {
            //     url : '../do/PE/menuGet.bsh',
            //     type : 'ajax',
            //     reader : {
            //         type : 'json',
            //         rootProperty : 'children',
            //         successProperty : 'success'
            //     },
            //     extraParams : {
            //         cCodArbol: '04', //Corresponde al codigo arbol menu de appPE en Compustrom / Adm. Menu
            //         prm_dataSource: "xgenJNDI"
            //     }
            // }, 
        }
    }
});