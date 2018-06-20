$(window).on('load', function() {
  var $color = $("#color");
  var $color_text = $("#color_text");
  var $background_color = $("#background_color");
  var $background_color_text = $("#background_color_text");
  var $search = $("#search");
  var $right = $('#right');
  var $size = $("#size");
  var $download = $("#download");
  var $stackedLabel = $("#stacked_label");
  var $stackedSize = $("#stacked_size");
  var $downloadIframe = $("#download_iframe");
  var $fileFormatText = $("#file_format_text");

  var createFaviconUrl = "https://fonticon-207412.appspot.com/";
  var loading = false;
  var symbol = "\uf004";
  var symbolStyle = "s";
  var stackedSelected = false;
  var stackedSymbol = "\uf004";
  var stackedSymbolStyle = "s";
  var canvas = document.getElementById('canvas');
  var sideLength = 1024;
  canvas.width = sideLength;
  canvas.height = sideLength;
  var ctx = canvas.getContext('2d');
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  initialize();

  function initialize() {
    $size.on("input", draw);
    $stackedSize.on("input", draw);
    $color_text.on("input", updateColor.bind(updateColor, $color, $color_text,
                                             false, true));
    $background_color_text.on(
        "input", updateColor.bind(updateColor, $background_color,
                                  $background_color_text, false, true));
    $color.spectrum({
      color : "#ff3860",
      showButtons : false,
      showAlpha : true,
      move : updateColor.bind(updateColor, $color, $color_text, true, true)
    });

    $background_color.spectrum({
      color : "rgba(255,255,255,0)",
      showButtons : false,
      showAlpha : true,
      move : updateColor.bind(updateColor, $background_color,
                              $background_color_text, true, true)
    });
    updateColor($color, $color_text, false, false);
    updateColor($background_color, $background_color_text, false, false);

    initSearch($search, $right);

    function loadingFinished() {
      loading = false;
      $download.removeClass("loading");
    }

    function iconCreationError(errorMessage) { console.error(errorMessage); }

    $download.on("click", function() {
      if (!loading) {
        loading = true;
        $download.addClass("loading");
        if ($fileFormatText.text() == ".ico") {
          var iconData = canvas.toDataURL().split(',')[1];
          $.ajax({
            type : "POST",
            url : createFaviconUrl,
            data : iconData,
            success : function(response) {
              if (response.status == "error") {
                iconCreationError(response.error_message);
              } else {
                $downloadIframe.attr('src', response.url);
              }
            },
            error : function(jqXHR, textStatus,
                             errorMessage) { iconCreationError(errorMessage); },
            complete : loadingFinished
          })
        } else {
          canvas.toBlob(function(blob) {
            saveAs(blob, "favicon.png");
            loadingFinished();
          });
        }
      }
    });

    $("#stacked").click(function() {
      stackedSelected = this.checked;
      this.checked ? $stackedSize.show() : $stackedSize.hide();
      draw();
    });

    $.each(icons, function(index, icon) {
      var $iconOuter = $("<div>").addClass("icon_outer").data("id", icon.id);

      var iconStyle;
      switch (icon.style) {
      case 'solid':
        iconStyle = 's';
        break;
      case 'regular':
        iconStyle = 'r';
        break;
      default:
        console.error('Unkown icon style.');
      }
      var styleClass = "fa" + iconStyle + " fa-" + icon.id;
      var $icon = $("<div>")
                      .addClass("icon hover")
                      .data('style', iconStyle)
                      .data('unicode', icon.unicode)
                      .append($('<i>').addClass(styleClass));
      $icon.append($("<div>").addClass("icon_text underline").text(icon.id));
      $iconOuter.append($icon);
      $right.append($iconOuter);
    });

    $(".icon").on("click touchstart", function() {
      var selectedSymbol = $(this).data('unicode');
      var selectedSymbolStyle = $(this).data('style');
      if (stackedSelected) {
        stackedSymbol = selectedSymbol;
        stackedSymbolStyle = selectedSymbolStyle;
      } else {
        symbol = selectedSymbol;
        symbolStyle = selectedSymbolStyle;
      }
      draw();
    });

    $("#file_format").on("click", function() {
      new_format = ".ico";
      if ($fileFormatText.text() == ".ico") {
        new_format = ".png";
      }
      $fileFormatText.text(new_format);
    });

    setTimeout(draw, 1000);
  }

  function initSearch($search, $right) {
    var options = {
      id : "id",
      shouldSort : true,
      threshold : 0.3,
      location : 0,
      distance : 100,
      maxPatternLength : 32,
      minMatchCharLength : 1,
      keys : [ "id", "name", "search_terms" ]
    };
    var fuse = new Fuse(icons, options);
    $search.on("input", function() {
      var query = $search.get(0).value;
      var result = fuse.search(query);
      $right.children().hide();
      $right.children()
          .filter(function(index, element) {
            return query == "" || result.indexOf($(element).data("id")) != -1;
          })
          .show();
      if (result.length == 0 && query != "") {
        tinysort($right.children());
      } else if (result.length > 0) {
        tinysort($right.children(), {
          sortFunction : function(a, b) {
            return result.indexOf($(a.elm).data("id")) -
                   result.indexOf($(b.elm).data("id"));
          }
        });
      }
    })
  }

  function updateColor($color, $color_text, fromPicker, doDraw) {
    if (!fromPicker) {
      $color.spectrum("set", $color_text.val());
    }
    var rgba = colorToRgba($color.spectrum("get"));
    $color.css("background-color", rgba);
    if (fromPicker) {
      $color_text.val(rgba);
    }
    if (doDraw) {
      draw();
    }
  }

  function colorToRgba(color) {
    return "rgba(" + color.toRgb().r + ", " + color.toRgb().g + ", " +
           color.toRgb().b + ", " + color.toRgb().a + ")";
  }

  function draw() {
    if (sideLength > 0) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = $background_color_text.val();
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      setFontSize(symbol, symbolStyle, $size);
      ctx.fillStyle = "rgba(0, 0, 0, 1)";
      ctx.globalCompositeOperation = "destination-out";
      ctx.fillText(symbol, sideLength / 2, sideLength / 2);
      ctx.fillStyle = $color_text.val();
      ctx.globalCompositeOperation = "source-over";
      ctx.fillText(symbol, sideLength / 2, sideLength / 2);
      if (stackedSelected && stackedSymbol) {
        ctx.save();
        setFontSize(stackedSymbol, stackedSymbolStyle, $stackedSize);
        ctx.globalCompositeOperation = "xor";
        ctx.fillText(stackedSymbol, sideLength / 2, sideLength / 2);
        ctx.restore();
      }
      canvasToFavicon(canvas);
    }
  }

  function getFont(symbolStyle, pixelSize) {
    var font = pixelSize + 'px "Font Awesome 5 Free"';
    var fontWeight = 0;
    switch (symbolStyle) {
    case 's':
      fontWeight = 900;
      break;
    case 'r':
      fontWeight = 400;
      break;
    default:
      console.error('Unkown icon style.');
    }
    return fontWeight + ' ' + font;
  }

  function setFontSize(symbol, symbolStyle, $size) {
    var i = sideLength;
    do {
      ctx.font = getFont(symbolStyle, i);
      i--;
    } while (ctx.measureText(symbol).width > sideLength);
    ctx.font = getFont(symbolStyle, i * $size.val() / 100);
  }
});

// used to update the icons
// function updateIcons() {
//    $.get('https://rawgit.com/FortAwesome/Font-Awesome/master/src/icons.yml',
//    function (data) {
//        var parsedYaml = jsyaml.load(data);
//        console.log(JSON.stringify(parsedYaml));
//    });
//<!--<script src="lib/js-yaml.min.js"></script>-->
//}
