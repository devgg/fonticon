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

    var symbol = "\uf004";
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
        $color_text.on("input", updateColor.bind(updateColor, $color, $color_text, false));
        $background_color_text.on("input", updateColor.bind(updateColor, $background_color, $background_color_text, false));
        $color.spectrum({
            color: "#ffffff",
            showButtons: false,
            showAlpha: true,
            move: updateColor.bind(updateColor, $color, $color_text, true)
        });

        $background_color.spectrum({
            color: "#f85032",
            showButtons: false,
            showAlpha: true,
            move: updateColor.bind(updateColor, $background_color, $background_color_text, true)
        });

        $search.on("input", function () {
            var phrase = $search.val().toLowerCase();
            for (var i = 0; i < symbols.length; i++) {
                if (symbols[i].id.indexOf(phrase) !== -1) {
                    symbols[i].$icon.parent().show();
                } else {
                    symbols[i].$icon.parent().hide();
                }
            }
        });

        $("#download").on("click", function () {
            canvas.toBlob(function (blob) {
                saveAs(blob, "favicon.png");
            });
        });


        $.each(icons, function (index, icon) {
            var $iconOuter = $("<div>").addClass("icon_outer");
            var $icon = $("<div>").addClass("icon").append($('<i class="fa fa-' + icon.id + '"></i>'));
            $icon.append($("<div>").addClass("icon_text").text(icon.id));
            $iconOuter.append($icon);
            $right.append($iconOuter);

            symbols.push(new FASymbol(icon.name, icon.id, icon.unicode, $icon));
        });


        $(".icon").on("click", function () {
            symbol = window.getComputedStyle($(this).children().get()[0], ':before').content.substring(1, 2);
            draw();
        });

        draw();
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

            setFontSize();
            ctx.fillStyle = "rgba(0, 0, 0, 1)";
            ctx.globalCompositeOperation = "destination-out";
            ctx.fillText(symbol, sideLength / 2, sideLength / 2);
            ctx.fillStyle = $color_text.val();
            ctx.globalCompositeOperation = "source-over";
            ctx.fillText(symbol, sideLength / 2, sideLength / 2);
            canvasToFavicon(canvas);
        }
    }

    function setFontSize() {
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