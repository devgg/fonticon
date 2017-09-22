function FASymbol(name, id, unicode, $icon) {
    this.name = name;
    this.id = id;
    this.unicode = unicode;
    this.$icon = $icon;
}

$(window).on('load', function () {
    var $color = $("#color");
    var $color_text = $("#color_text");
    var $background_color = $("#background_color");
    var $background_color_text = $("#background_color_text");
    var $search = $("#search");
    var $right = $('#right');
    var $size = $("#size");
	var $stackedSize = $("#stackedSize")

    var symbol = "\uf004";
	var stackedSelected = false;
	var stackedSymbol = "\uf004";
    var canvas = document.getElementById('canvas');
    var sideLength = 1024;
    canvas.width = sideLength;
    canvas.height = sideLength;
    var ctx = canvas.getContext('2d');
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    var symbols = [];
    initialize();

    function initialize() {
        $size.on("input", draw);
		$stackedSize.on("input", draw);
        $color_text.on("input", updateColor.bind(updateColor, $color, $color_text, false));
        $background_color_text.on("input", updateColor.bind(updateColor, $background_color, $background_color_text, false));
        $color.spectrum({
            color: "#f85032",
            showButtons: false,
            showAlpha: true,
            move: updateColor.bind(updateColor, $color, $color_text, true)
        });

        $background_color.spectrum({
            color: "rgba(255,255,255,0)",
            showButtons: false,
            showAlpha: true,
            move: updateColor.bind(updateColor, $background_color, $background_color_text, true)
        });
        updateColor($color, $color_text, false);
        updateColor($background_color, $background_color_text, false);

        initSearch($search, $right);

        $("#download").on("click", function () {
            canvas.toBlob(function (blob) {
                saveAs(blob, "favicon.png");
            });
        });

		    $("#stacked").click(function() {
            stackedSelected = this.checked;
            this.checked ? $stackedSize.show() : $stackedSize.hide();
            draw();
        });

        $.each(icons, function (index, icon) {
            var $iconOuter = $("<div>").addClass("icon_outer").data("id", icon.id);
            var $icon = $("<div>")
                    .addClass("icon")
                    .append($('<i class="fa fa-' + icon.id + '"></i>'));
            $icon.append($("<div>").addClass("icon_text").text(icon.id));
            $iconOuter.append($icon);
            $right.append($iconOuter);

            symbols.push(new FASymbol(icon.name, icon.id, icon.unicode, $icon));
        });


        $(".icon").on("click", function () {
            var selectedSymbol = window.getComputedStyle($(this).children().get()[0], ':before').content.substring(1, 2);
            if (stackedSelected) {
                stackedSymbol = selectedSymbol;
            } else {
                symbol = selectedSymbol;
            }
            draw();
        });

        draw();
    }

    function initSearch($search, $right) {
        var options = {
            id: "id",
            shouldSort: true,
            threshold: 0.3,
            location: 0,
            distance: 100,
            maxPatternLength: 32,
            minMatchCharLength: 1,
            keys: [
                "name",
                "filter"
            ]
        };
        var fuse = new Fuse(icons, options);
        $search.on("input", function () {
            var query = $search.get(0).value;
            var result = fuse.search(query);
            $right.children().hide();
            $right.children().filter(function(index, element) {
                return query == "" || result.indexOf($(element).data("id")) != -1;
            }).show();
            if (result.length == 0 && query != "") {
                tinysort($right.children());
            } else if (result.length > 0) {
                tinysort($right.children(), {
                    sortFunction: function(a, b) {
                        return result.indexOf($(a.elm).data("id")) - result.indexOf($(b.elm).data("id"));
                    }
                });
            }
        })
    }

    function updateColor($color, $color_text, fromPicker) {
        if (!fromPicker) {
            $color.spectrum("set", $color_text.val());
        }
        var rgba = colorToRgba($color.spectrum("get"));
        $color.css("background-color", rgba);
        if (fromPicker) {
            $color_text.val(rgba);
        }
        draw();
    }

    function colorToRgba(color) {
        return "rgba("
            + color.toRgb().r + ", "
            + color.toRgb().g + ", "
            + color.toRgb().b + ", "
            + color.toRgb().a + ")";
    }

    function draw() {
        if (sideLength > 0) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = $background_color_text.val();
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            setFontSize(symbol, $size);
            ctx.fillStyle = "rgba(0, 0, 0, 1)";
            ctx.globalCompositeOperation = "destination-out";
            ctx.fillText(symbol, sideLength / 2, sideLength / 2);
            ctx.fillStyle = $color_text.val();
            ctx.globalCompositeOperation = "source-over";
            ctx.fillText(symbol, sideLength / 2, sideLength / 2);
            if (stackedSelected && stackedSymbol) {
                ctx.save();
                setFontSize(stackedSymbol, $stackedSize);
                ctx.globalCompositeOperation = "xor";
                ctx.fillText(stackedSymbol, sideLength / 2, sideLength / 2);
                ctx.restore();
            }
            canvasToFavicon(canvas);
        }
    }

    function setFontSize(symbol, $size) {
        var i = sideLength;
        do {
            ctx.font = i + "px FontAwesome";
            i--;
        } while (ctx.measureText(symbol).width > sideLength);
        ctx.font = (i * ($size.val() / 100)) + "px FontAwesome";
    }
});


// used to update the icons
//function updateIcons() {
//    $.get('https://rawgit.com/FortAwesome/Font-Awesome/master/src/icons.yml', function (data) {
//        var parsedYaml = jsyaml.load(data);
//        console.log(JSON.stringify(parsedYaml));
//    });
//<!--<script src="lib/js-yaml.min.js"></script>-->
//}
