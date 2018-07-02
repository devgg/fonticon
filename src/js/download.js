import { saveAs } from 'file-saver';
import _ from 'blueimp-canvas-to-blob';

function initDownload() {
  const createFaviconUrl = 'https://fonticon-207412.appspot.com/';
  const $download = $('#download');
  const $fileFormat = $('#file_format');
  const $fileFormatText = $('#file_format_text');
  const $downloadIframe = $('#download_iframe');
  const $interactiveDownload = $('#interactive_download');
  const $interactiveDownloadInput = $('#interactive_download_input');

  let loading = false;

  const formats = {
    ico: {
      text: '.ico',
      func: ico,
    },
    icoAdvanced: {
      text: '.ico (advanced)',
      func: icoAdvanced,
    },
    png: {
      text: '.png',
      func: png,
    },
  };

  let format = formats.ico;

  function iconCreationError(errorMessage) {
    console.error(errorMessage);
  }

  function loadingFinished() {
    loading = false;
    $download.removeClass('loading');
  }

  function ico() {
    const iconData = generateBase64Picture();
    $.ajax({
      type: 'POST',
      url: createFaviconUrl,
      data: iconData,
      success: function(response) {
        if (response.status == 'error') {
          iconCreationError(response.error_message);
        } else {
          downloadFromUrl(response.url);
        }
      },
      error: function(jqXHR, textStatus, errorMessage) {
        iconCreationError(errorMessage);
      },
      complete: loadingFinished,
    });
  }

  function icoAdvanced() {
    const data = JSON.stringify({
      favicon_generation: {
        api_key: '87d5cd739b05c00416c4a19cd14a8bb5632ea563',
        master_picture: {
          type: 'inline',
          content: generateBase64Picture(),
        },

        files_location: { type: 'no_location' },
        callback: {
          type: 'none',
        },
      },
    });
    $interactiveDownloadInput.attr('value', data);
    $interactiveDownload.submit();
    loadingFinished();
  }

  function png() {
    canvas.toBlob(function(blob) {
      saveAs(blob, 'favicon.png');
      loadingFinished();
    });
  }

  $download.on('click', function() {
    if (!loading) {
      loading = true;
      $download.addClass('loading');
      format.func();
    }
  });

  $fileFormat.on('click', function() {
    if (format === formats.ico) {
      format = formats.icoAdvanced;
    } else if (format === formats.icoAdvanced) {
      format = formats.png;
    } else {
      format = formats.ico;
    }
    $fileFormatText.text(format.text);
  });

  function generateBase64Picture() {
    return canvas.toDataURL().split(',')[1];
  }
}

export { initDownload };
