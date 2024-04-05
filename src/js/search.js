import Fuse from 'fuse.js';
import tinysort from 'tinysort';
import icons from './generated/icons.js';

function initSearch() {
  const $search = $('#search');
  const $right = $('#right');
  const options = {
    id: 'ix',
    shouldSort: true,
    threshold: 0.3,
    location: 0,
    distance: 100,
    maxPatternLength: 32,
    minMatchCharLength: 1,
    keys: ['id', 'se'],
  };
  const fuse = new Fuse(icons, options);

  $search.on('input', () => {
    setTimeout(() => {
      const query = $search.get(0).value;
      const result = fuse.search(query);

      const map = new Map(result.map((obj, idx) => [obj.item.ix, idx]));

      let $childrenToShow = $right.children();
      if (query !== '') {
        $childrenToShow.css('display', 'none');
        $childrenToShow = $right.children().filter((index, element) => {
          return map.has($(element).data('ix'));
        });
        $childrenToShow.css('display', 'flex');

        if ($childrenToShow.length > 0) {
          tinysort($childrenToShow, {
            sortFunction: (a, b) => {
              return map.get($(a.elem).data('ix')) - map.get($(b.elem).data('ix'));
            },
          });
        }
      } else {
        $childrenToShow.css('display', 'flex');
        tinysort($childrenToShow);
      }
    }, 0);
  });
}

export { initSearch };
