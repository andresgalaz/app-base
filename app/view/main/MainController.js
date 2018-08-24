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
        ':node': 'setCurrentView'
    },

    config: {
        showNavigation: false
    },

    slidOutCls: 'main-nav-slid-out',
    collapsedCls: 'main-nav-collapsed',

    init: function (view) {
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


    onNavigationItemClick: function (tree, info) {
        var me = this;

	    a2m.Helper.cargaFormulario( info.node.data.viewType, function(){
            me.setCurrentView(info.node.data.viewType);
        });

        console.log('onNavigationItemClick');
        
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

    setCurrentView: function (hashTag) {
        // Se utiliza notación Camel, luego pasar a minusculas rompe el esquema
        // hashTag = (hashTag || '').toLowerCase();

        var view = this.getView(),
            navigationTree = this.lookup('navigationTree'),
            store = navigationTree.getStore(),
            node = store.findNode('routeId', hashTag) ||
                   store.findNode('viewType', hashTag),
            item = view.child('component[routeId=' + hashTag + ']');

        if (!item) {
            a2m.Helper.cargaFormulario(hashTag, function(){
                item = {
                    xtype: hashTag,
                    routeId: hashTag
                };
                setTimeout(function(){
                    view.setActiveItem(item);
                    navigationTree.setSelection(node);
                }, 500 );
            });
            return;
        } 
        view.setActiveItem(item);
        navigationTree.setSelection(node);
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

        a2m.Helper.cargaFormulario(href, function(){
            me.setCurrentView(href);
        });
    }
});
