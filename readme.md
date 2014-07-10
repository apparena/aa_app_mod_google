# App-Arena.com App Module: Google
* **Github:** https://github.com/apparena/aa_app_mod_google
* **Docs:** http://www.app-arena.com/docs/display/developer
* This is a module of the [aa_app_template](https://github.com/apparena/aa_app_template)
* **Required Template-Version:** >= 1.3.0

## Module job
Implements some google API functions to login and share over google. This is used for example in the fangate and auth module.

### Dependencies
* Nothing


### Functions
* **share** - Shares information from a button.
    * **elem** - Button Object (jQuery)
    * **share_infos** - JSON object with additional share information (not required)
* **addClickEventListener** - Add a click event to google login/connect button with class .gpconnect to use the lofin function

### Examples
#### Initialize Module and API
```javascript
require(['modules/aa_app_mod_google/js/views/GoogleView'], function (Google) {
    google = Google().init({init: true});
    google.libInit();
});
```

#### HTML follow button
```html
<div id="fangate_btn_google">
    <div class="g-follow" data-annotation="bubble" data-size="small" data-href="//plus.google.com/<%- _.c('share_googleplus_id') %>" data-rel="author"></div>
</div>
```

### Load module with require
```
modules/aa_app_mod_google/js/views/GoogleView
```

#### App-Manager config values
| config | default | description |
|--------|--------|--------|
| share_googleplus_id | 0 | google plus account id |

#### App-Manager locale values
| locale | default | description |
|--------|--------|--------|
| share_lang | de/en | language selection for share buttons |