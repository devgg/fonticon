import icons from './generated/icons.js';
import { draw } from './draw.js';

function initIcons(state) {
  const $right = $('#right');

  $.each(icons, (index, icon) => {
    const $iconOuter = $('<div>')
      .addClass('icon_outer')
      .data('ix', icon.ix);

    const styleClass = icon.st + ' fa-' + icon.id;

    const $icon = $('<div>')
      .addClass('icon hover')
      .data('ix', icon.ix)
      .append($('<i>').addClass(styleClass));

    $icon.append(
      $('<div>')
        .addClass('icon_text underline')
        .text(icon.id),
    );
    $iconOuter.append($icon);
    $right.append($iconOuter);
  });

  $('.icon').on('click touchstart', event => {
    const icon = icons[$(event.currentTarget).data('ix')];
    if (!state.stackedSelected) {
      state.icon = icon;
    } else {
      state.stackedIcon = icon;
    }
    draw();
  });
}

export { initIcons };
