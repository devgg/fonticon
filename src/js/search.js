import Fuse from 'fuse.js';
import tinysort from 'tinysort';
import icons from './generated/icons.js';

function initSearch() {
  const $search = $('#search');
  const $right = $('#right');
  const icon_map = icons.map;
  const options = {
    id: 'idx',
    shouldSort: true,
    threshold: 0.3,
    location: 0,
    distance: 100,
    maxPatternLength: 32,
    minMatchCharLength: 1,
    keys: ['id', 'search_terms'],
  };
  const fuse = new Fuse(icons, options);
  const result_map = new Array(icons.length);

  function createResultMap(result) {
    for (let i = 0; i < result_map.length; i++) {
      result_map[i] = -1;
    }
    for (let i = 0; i < result.length; i++) {
      result_map[result[i]] = i;
    }
  }

  function filterIcons(query) {
    $right.children().hide();
    $right
      .children()
      .filter(function(index, element) {
        return query == '' || result_map[$(element).data('idx')] != -1;
      })
      .show();
  }

  $search.on('input', function() {
    console.time('someFunction');
    console.time('search');
    const query = $search.get(0).value;
    const result = fuse.search(query);
    createResultMap(result);
    console.timeEnd('search');

    console.time('filter');
    filterIcons(query, result);
    console.timeEnd('filter');
    if (result.length == 0 && query == '') {
      tinysort($right.children());
    } else if (result.length > 0) {
      tinysort($right.children(), {
        sortFunction: function(a, b) {
          return result_map[$(a.elm).data('idx')] - result_map[$(b.elm).data('idx')];
        },
      });
    }
    console.timeEnd('someFunction');
  });

  //  function filterIcons(query, result) {
  //    $right.children().hide();
  //    $right
  //      .children()
  //      .filter(function(index, element) {
  //        return query == '' || result.indexOf($(element).data('id')) != -1;
  //      })
  //      .show();
  //  }
  //
  //  $search.on('input', function() {
  //    console.time('someFunction');
  //    const query = $search.get(0).value;
  //    const result = fuse.search(query);
  //    //createResultMap(result);
  //
  //    filterIcons(query, result);
  //    if (result.length == 0 && query == '') {
  //      tinysort($right.children());
  //    } else if (result.length > 0) {
  //      tinysort($right.children(), {
  //        sortFunction: function(a, b) {
  //          return result.indexOf($(a.elm).data('id')) - result.indexOf($(b.elm).data('id'));
  //        },
  //      });
  //    }
  //    console.timeEnd('someFunction');
  //  });
}

export { initSearch };
