require.config({
    paths: {
        'google_api': '//apis.google.com/js/client:plus'
    },
    shim:  {
        'google_api': {
            exports: 'gapi'
        }
    }
});

define([
    'ViewExtend',
    'jquery',
    'underscore',
    'backbone',
    'modules/aa_app_mod_google/js/models/LoginModel',
    'google_api'
], function (View, $, _, Backbone, LoginModel, gapi) {
    'use strict';

    return function () {
        View.namespace = 'google';

        View.code = Backbone.View.extend({
            el: $('body'),

            shareUrl: '//plus.google.com/share',

            scopes: 'https://www.googleapis.com/auth/plus.login https://www.googleapis.com/auth/plus.me https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile',

            initialize: function () {
                _.bindAll(this, 'libInit', 'share', 'follow', 'addClickEventListener', 'login', 'handleClientLoad', 'checkAuth', 'handleAuthResult', 'handleAuthClick', 'makeApiCall');

                this.modelGpLogin = LoginModel().init();

                var lang;

                if (_.t('share_lang') === 'de') {
                    lang = 'de-DE';
                } else {
                    lang = 'en-US';
                }
                window.___gcfg = {
                    lang:      lang,
                    parsetags: 'onload' // set explicit to handle calls by your self. at the moment, onload is the best choice for fangate using
                };
            },

            libInit: function () {
                /*var po, s, lang;

                 if (_.t('share_lang') === 'de') {
                 lang = 'de-DE';
                 } else {
                 lang = 'en-US';
                 }
                 window.___gcfg = {
                 lang:      lang,
                 parsetags: 'onload'
                 };

                 po = document.createElement('script');
                 po.type = 'text/javascript';
                 po.async = true;
                 po.src = 'https://apis.google.com/js/plusone.js';
                 s = document.getElementsByTagName('script')[0];
                 s.parentNode.insertBefore(po, s);*/

                return this;
            },

            share: function (elem, share_infos) {
                var redirection,
                    url = encodeURIComponent(share_infos.url),
                    text = share_infos.title,
                    lang = elem.attr('data-lang') || 'en',
                    width = 575,
                    height = 400,
                    left = ($(window).width() - width) / 2,
                    top = ($(window).height() - height) / 2,
                    opts = 'status=1' +
                        ',width=' + width +
                        ',height=' + height +
                        ',top=' + top +
                        ',left=' + left;

                redirection = this.shareUrl +
                    '?url=' + url +
                    '&title=' + encodeURIComponent(text) +
                    '&hl=' + lang;
                window.open(redirection, 'googleplus', opts);
            },

            follow: function (callback, element) {
                //$(element).data('callback', callback);
            },

            addClickEventListener: function () {
                // add click event listener on GPLUS login buttons
                var that = this,
                    connect = $('.gpconnect');
                connect.off('click');
                connect.on('click', function (event) {
                    that.login(event);
                });
            },

            login: function (event) {
                this.handleAuthClick(event);

                return this;
            },

            handleClientLoad: function () {
                gapi.client.setApiKey(_.aa.gp.api_key);
                this.checkAuth();
            },

            checkAuth: function () {
                var that = this;
                gapi.auth.authorize({
                    client_id: _.aa.gp.client_id,
                    scope:     this.scopes,
                    immediate: true
                }, function (authResult) {
                    that.handleAuthResult(authResult);
                });
            },

            handleAuthResult: function (authResult) {
                if (authResult && !authResult.error) {
                    this.makeApiCall();
                }
            },

            handleAuthClick: function (event) {
                var that = this;
                gapi.auth.authorize({
                    client_id: _.aa.gp.client_id,
                    scope:     this.scopes,
                    immediate: false
                }, function (authResult) {
                    that.handleAuthResult(authResult);
                });
                return false;
            },

            makeApiCall: function () {
                var that = this;

                gapi.client.load('plus', 'v1', function () {
                    var request = gapi.client.plus.people.get({
                        'userId': 'me'
                    });

                    request.execute(function (response) {
                        var data = that.modelGpLogin.toJSON();

                        if (typeof( response.id ) !== 'undefined' && parseInt(response.id, 10) > 0) {
                            data.gpid = parseInt(response.id, 10);
                            data.email = 'mail' + data.gpid + '@google.com';
                        }
                        if (typeof( response.name ) !== 'undefined' && response.name.givenName.length > 0) {
                            data.firstname = response.name.givenName;
                        }
                        if (typeof( response.name ) !== 'undefined' && response.name.familyName.length > 0) {
                            data.lastname = response.name.familyName;
                        }
                        if (typeof( response.gender ) !== 'undefined' && response.gender === 'female') {
                            data.gender = 'woman';
                        }
                        if (typeof( response.image ) !== 'undefined' && response.image.url.length > 0) {
                            data.avatar = response.image.url;
                        }
                        if (typeof( response.nickname ) !== 'undefined' && response.nickname.length > 0) {
                            data.nickname = response.nickname;
                        }
                        data.logintime = _.uniqueId();
                        that.modelGpLogin.set(data);
                        that.modelGpLogin.save();
                    });
                });
            }
        });

        return View;
    }
});