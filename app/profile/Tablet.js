Ext.define('a2m.profile.Tablet', {
    extend: 'Ext.app.Profile',

    isActive: function () {
        return !Ext.platformTags.phone;
    }
});
