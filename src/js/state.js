import icons from './generated/icons.js';

const c = {
  canvas: undefined,
  ctx: undefined,
  canvasSize: 1024,
};

const s = {
  foregroundColor: '#345334',
  backgroundColor: '#345334',
  size: 85,
  stackedSize: 60,
  icon: icons[432],
  stackedIcon: icons[432],
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
