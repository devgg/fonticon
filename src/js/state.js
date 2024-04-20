import icons from './generated/icons.js';

const c = {
  canvas: undefined,
  ctx: undefined,
  canvasSize: 960,
};

const heart_icon = icons.find((icon) => {
  return icon.id === 'heart' && icon.st === 'fas';
});

const s = {
  foregroundColor: '#345334',
  backgroundColor: '#345334',
  size: 85,
  stackedSize: 60,
  icon: heart_icon,
  stackedIcon: heart_icon,
  stackedSelected: false,
};

function initState() {
  c.canvas = document.getElementById('canvas');
  c.canvas.width = c.canvasSize;
  c.canvas.height = c.canvasSize;
  c.ctx = c.canvas.getContext('2d');
  c.ctx.textAlign = 'center';
  c.ctx.textBaseline = 'middle';

  Object.freeze(c);
}

export { initState, c, s };
