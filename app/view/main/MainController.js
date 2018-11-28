Ext.define('a2m.view.main.MainController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.main',

    requires: [
        'Ext.MessageBox'
    ],

    listen : {
        controller : {
            '#' : {
                unmatchedroute : 'setCurrentView'
            }
        }
    },

    routes: {
        ':node': {
            action: 'setCurrentView',
            before: 'beforeRoute'
        },
    },

    config: {
        showNavigation: false
    },

    slidOutCls: 'main-nav-slid-out',
    collapsedCls: 'main-nav-collapsed',

    init: function (view) {
        if (DEBUG) console.log('SEQ INICIO [MainController]');

        var logo = view.lookup('logo'),
            nav = view.lookup('navigation');

        // Detach the navigation container so we can float it in from the edge.
        nav.getParent().remove(nav, false);
        nav.addCls(['x-floating', 'main-nav-floated', this.slidOutCls]);
        nav.setScrollable(true);
        nav.getRefOwner = function () {
            // we still need events to route here or our base
            return view;
        };

        // Also, transplant the logo from the toolbar to be docked at the top of the
        // floating nav.
        nav.add(logo);
        logo.setDocked('top');

        Ext.getBody().appendChild(nav.element);
    },

    beforeRoute: function (node, action) {
        var me = this,
            oUsr = Ext.decode(localStorage.getItem("usuario"));
        
        if (typeof oUsr === "undefined") {
            me.setCurrentView('view.login.Login');
        } else {
            action.resume();
        }
    },

    onNavigationItemClick: function (tree, info) {
        var me = this;

	    me.cargaFormulario( info.node.data.viewType, function(){
            me.setCurrentView(info.node.data.viewType);
        });

        if( DEBUG ) console.log('onNavigationItemClick');
        
        if (info.select) {
            // If we click a selectable node, slide out the navigation tree. We cannot
            // use select event for this since the user may tap the currently selected
            // node. We don't want to slide out, however, if the tap is on an unselectable
            // thing (such as a parent node).
            this.setShowNavigation(false);
        }
    },

    onNavigationTreeSelectionChange: function (tree, node) {
        var to = node && (node.get('routeId') || node.get('viewType'));

        if (to) {
            this.redirectTo(to);
        }
    },

    onToggleNavigationSize: function () {
        this.setShowNavigation(!this.getShowNavigation());
    },

    cargaFormulario: function (cAccion, fnCallback) {
        var cAppName = Ext.getApplication().getName();
        var cUrl = cAppName + "/app/" + cAccion.replace(/\./g, '/') + '.js';
        var cNombreClase = cAppName + '.' + cAccion;

        Ext.require(cNombreClase, function () {
            var objCreado = Ext.create(cNombreClase);
            if (typeof (fnCallback) == 'function')
                fnCallback(objCreado);
        });
    },

    setCurrentView: function (hashTag) {
        // Se utiliza notación Camel, luego pasar a minusculas rompe el esquema
        // hashTag = (hashTag || '').toLowerCase();

        var me = this,
            pos =  hashTag.indexOf("/"),
            viewHash = pos > 0 ? hashTag.substring(0, pos) : hashTag,
            evento_id = pos > 0 ? hashTag.substring(pos + 1, hashTag.length) : 0,
            view = this.getView(),
            refs = view.getReferences(),
            navigationTree = this.lookup('navigationTree'),
            store = navigationTree.getStore(),
            node = store.findNode('routeId', viewHash) ||
                   store.findNode('viewType', viewHash),
            item = view.child('component[routeId=' + viewHash + ']');

        if (!item) {
            me.cargaFormulario(viewHash, function(obj) {
                item = {
                    xtype: viewHash,
                    routeId: viewHash
                }

                switch (viewHash) {
                    case 'view.paciente.ListaPacientes':
                    case 'view.solicitud.ListaDerivados':
                    case 'view.dashboard.Dashboard':
                        refs.tlbMain.setHidden(false);
                        break;
                    
                    default:
                        refs.tlbMain.setHidden(true);
                        break;
                }

                setTimeout(function(){
                    view.setActiveItem(item);
                    navigationTree.setSelection(node);
                }, 500 );
                
                if (evento_id > 0 && obj) {
                    obj.fireEvent('cargadatos', evento_id);
                }
            });
            return;
        } 
        view.setActiveItem(item);
        navigationTree.setSelection(node);

        switch (item.xtype) {
            case 'view.paciente.ListaPacientes':
            case 'view.solicitud.ListaDerivados':
            case 'view.dashboard.Dashboard':
                refs.tlbMain.setHidden(false);
                break;
            
            default:
                refs.tlbMain.setHidden(true);
                break;
        }

        if (evento_id > 0) {
            item.fireEvent('cargadatos', evento_id);
        }
    },

    updateShowNavigation: function (showNavigation, oldValue) {
        // Ignore the first update since our initial state is managed specially. This
        // logic depends on view state that must be fully setup before we can toggle
        // things.
        //
        // NOTE: We do not callParent here; we replace its logic since we took over
        // the navigation container.
        //
        if (oldValue !== undefined) {
            var me = this,
                view = this.getView(),
                nav = view.lookup('navigation'),
                mask = me.mask;

            if (showNavigation) {
                me.mask = mask = Ext.Viewport.add({
                    xtype: 'loadmask',
                    userCls: 'main-nav-mask'
                });

                mask.element.on({
                    tap: 'onToggleNavigationSize',
                    scope: me,
                    single: true
                });
            } else if (mask) {
                me.mask = Ext.destroy(mask);
            }

            nav.toggleCls(me.slidOutCls, !showNavigation);
        }
    },

    toolbarButtonClick: function (btn) {
        var me = this,
            href = btn.config.href;

        me.redirectTo(href);
        // me.cargaFormulario(href, function(){
        //     me.setCurrentView(href);
        // });
    }
});
