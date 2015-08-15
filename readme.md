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

There are two directives available for you. One it's the like flag which display
the likes a given entity have in the DB:
```html
<flag-like type="like" likes="{{object.like}}" entity="node" id="{{object.id}}"></flag-like>
```

This directive will be available with the `like.js` file.

Another directive which can be used it's the toggle directive. This directive
will be used to check or un-check an entity. A good example is a flag for follow
or unfollow an entity:

```html
<flag-toggle
  endpoint="question_follow"
  entity="node"
  entity-id="{{object.id}}"
  text-flagged="Unfollow"
  text-unflagged="Follow"
  class-flagged="fa fa-envelope"
  class-unflagged="fa fa-envelope-o"></flag-toggle>
```

# Drupal part
For now you'll need to set up a few things. Look at [this](https://gist.github.com/RoySegall/fcb38410b3ecacc3b1d8)
gist for more info.

You also need to enable Restful token auth module.
