import draw from './draw.js';

import spectrum from 'spectrum-colorpicker';

function initColors(state) {
  const $color = $('#color');
  const $colorText = $('#color_text');
  const $backgroundColor = $('#background_color');
  const $backgroundColorText = $('#background_color_text');

  const colors = {
    foreground: {
      setState: c => (state.foregroundColor = c),
      $: $color,
      $text: $colorText,
    },
    background: {
      setState: c => (state.backgroundColor = c),
      $: $backgroundColor,
      $text: $backgroundColorText,
    },
  };

  function colorFromPicker(color) {
    const col = color.$.spectrum('get');
    return 'rgba(' + col.toRgb().r + ', ' + col.toRgb().g + ', ' + col.toRgb().b + ', ' + col.toRgb().a + ')';
  }

  function updateColor(color, fromPicker, doDraw) {
    if (!fromPicker) {
      color.$.spectrum('set', color.$text.val());
    }

    const rgba = colorFromPicker(color);
    color.setState(rgba);
    color.$.css('background-color', rgba);

    if (fromPicker) {
      color.$text.val(rgba);
    }
    if (doDraw) {
      draw();
    }
  }

  $color.spectrum({
    color: 'rgba(255, 56, 96, 1)',
    showButtons: false,
    showAlpha: true,
    move: updateColor.bind(updateColor, colors.foreground, true, true),
  });

  $backgroundColor.spectrum({
    color: 'rgba(255, 255, 255, 0)',
    showButtons: false,
    showAlpha: true,
    move: updateColor.bind(updateColor, colors.background, true, true),
  });

  $colorText.on('input', updateColor.bind(updateColor, colors.foreground, false, true));
  $backgroundColorText.on('input', updateColor.bind(updateColor, colors.background, false, true));

  updateColor(colors.foreground, true, false);
  updateColor(colors.background, true, false);
}

function initControls(state) {
  initColors(state);
  const $size = $('#size');
  const $stackedSize = $('#stacked_size');
  const $stacked = $('#stacked');

  $size.on('input', () => {
    state.size = $size.val();
    draw();
  });

  $stackedSize.on('input', () => {
    state.stackedSize = $stackedSize.val();
    draw();
  });

  $stacked.click(() => {
    state.stackedSelected = !state.stackedSelected;
    state.stackedSelected ? $stackedSize.show() : $stackedSize.hide();
    draw();
  });

  $size.val(state.size);
  $stackedSize.val(state.stackedSize);
  $stacked.attr('checked', state.stackedSelected);
}

export { initControls };
