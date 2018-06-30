import { initDraw, draw } from './draw.js';
import { initIcons } from './icons.js';
import { initState, c, s } from './state.js';
import { initControls } from './controls.js';
import { initSearch } from './search.js';
import { initDownload } from './download.js';

import 'spectrum-colorpicker/spectrum.css';
import './../css/rangeslider.css';
import './../css/style.css';
import './../css/mobile.css';

$(window).on('load', function() {
  initState();
  initIcons(s);
  initSearch();
  initDownload();
  initControls(s);
  initDraw(c.canvas, c.ctx, c.canvasSize, s);
  setTimeout(draw, 1000);
});
