# Set up

Define a config file for the flag directive that will hold the base api end 
point:

```javascript
angular.module('flagConfig').constant('flagConfig', {
  'server': 'http://localhost/drupal/api/',
  'access_token': 'foo'
});

```

How to use the directive it self:
```html
<span flag type="like" likes="20" entity="node" id="1"></span>
```
