# Set up

Define a config file for the flag directive that will hold the base api end 
point:

```javascript
angular.module('flagConfig').constant('flagConfig', {
  'server': 'http://localhost/drupal/api/'
});

```

One of the controllers should implement a listener. The listener will set the
access token of the current user. For example:
```javascript
  $scope.$on('flagAccessToken', function(event, data) {
    data.accessToken = localStorageService.get('access_token');
  });
```

How to use the directive it self:
```html
<span flag type="like" likes="20" entity="node" id="1"></span>
```

# Drupal part
For now you'll need to set up a few things. Look at [this](https://gist.github.com/RoySegall/fcb38410b3ecacc3b1d8)
gist for more info.

You also need to enable Restful token auth module.
