define([
    'ModelExtend',
    'underscore',
    'backbone',
    'localstorage'
], function (Model, _, Backbone) {
    'use strict';

    return function () {
        Model.namespace = 'googleLogin';

        Model.code = Backbone.Model.extend({
            localStorage: new Backbone.LocalStorage('aa_app_mod_google_' + _.aa.instance.i_id + '_GpLoginData'),

            defaults: {
                'id':         1,
                'gpid':       '',
                'nickname':   '',
                'email':      '',
                'firstname':  '',
                'lastname':   '',
                'avatar':     '',
                'gender':     'men',
                'login_type': 'gpuser',
                'logintime':  ''
            }
        });

        return Model;
    }
});