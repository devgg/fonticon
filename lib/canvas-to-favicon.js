/* global document, navigator */

(function() {

  var canvasToFavicon;
  var supportsCanvas = !!document.createElement('canvas').getContext;

  if (supportsCanvas) {

    var head = document.head;

    var createIconElement = function() {
      var link = document.createElement('link');
      link.rel = 'icon';
      link.type = 'image/png';
      return link;
    };

    var isFirefox = !!navigator.userAgent.match(/firefox/i);

    var iconElement;

    canvasToFavicon = function(canvas) {

      if (!iconElement) {

        var existingIcons = document.querySelectorAll('link[rel="icon"]');
        for (var i = 0, len = existingIcons.length; i < len; i ++) {
          head.removeChild(existingIcons[i]);
        }

        iconElement = createIconElement();
        head.appendChild(iconElement);

      }

      // firefox needs to swap out the old element
      if (isFirefox) {
        var newEl = createIconElement();
        head.replaceChild(newEl, iconElement);
        iconElement = newEl;
      }

      iconElement.href = canvas.toDataURL('image/png');

    };

  } else {

    // noop without support
    canvasToFavicon = function() {};

  }

  if (typeof module !== 'undefined')
    module.exports = canvasToFavicon;
  else
    this.canvasToFavicon = canvasToFavicon;

})();
