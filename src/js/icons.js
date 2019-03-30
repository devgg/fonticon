import icons from './generated/icons.js';
import { draw } from './draw.js';

function initIcons(state, enablePro) {
  const $right = $('#right');
  $right.empty();

  $.each(icons, (index, icon) => {
    if (!enablePro && icon.pr == 't') return;
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

  function iconClicked() {
    const icon = icons[$(this).data('ix')];
    if (!state.stackedSelected) {
      state.icon = icon;
    } else {
      state.stackedIcon = icon;
    }
    draw();
  }

  $('.icon').each((index, elem) => {
    elem.addEventListener('click', iconClicked, { passive: true });
    elem.addEventListener('touchstart', iconClicked, { passive: true });
  });
}

export { initIcons };
