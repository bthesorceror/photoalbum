# Photo Album

Session manager for connect and stack that uses Redis for storage.

```javascript

var redis_host = 'localhost';
var redis_port = 6397;
var time_to_live_in_seconds = 1000;

var http  = require('http');
var stack = require('stack');

var PhotoAlbum = require('photoalbum');

var first = (new PhotoAlbum(time_to_live_in_seconds, redis_host, redis_port)).middleware();
var second = function(req, res, next) {
  // can access session through req.session
};

var server = http.createServer(
    stack(
      first,
      second
    )
);

server.listen(4000);
```

## Notes

Session is a object that you can set keys on and is saved at the end of the
response.

## Namespacing

```javascript

var album = new PhotoAlbum(time_to_live_in_seconds, redis_host, redis_port, {
  namespace: 'namemyspace'
});

```

This is prefix session keys with 'namemyspace::'. However this will only happen internally and is not written to the cookies.
