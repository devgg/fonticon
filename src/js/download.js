import saveAs from 'file-saver';
import _ from 'blueimp-canvas-to-blob';

function initDownload() {
  const createFaviconUrl = 'https://fonticon-207412.appspot.com/';
  const $download = $('#download');
  const $fileFormat = $('#file_format_text');
  const $fileFormatText = $('#file_format_text');
  const $downloadIframe = $('#download_iframe');
  const $interactiveDownload = $('#interactive_download');
  const $interactiveDownloadInput = $('#interactive_download_input');

  let loading = false;

  function iconCreationError(errorMessage) {
    console.error(errorMessage);
  }

  function loadingFinished() {
    loading = false;
    $download.removeClass('loading');
  }

  $download.on('click', function() {
    //postAndRedirect(createAdvancedRequest());
    if (!loading) {
      loading = true;
      $download.addClass('loading');
      if ($fileFormatText.text() == '.ico') {
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
      } else {
        canvas.toBlob(function(blob) {
          saveAs(blob, 'favicon.png');
          loadingFinished();
        });
      }
    }
  });

  $fileFormat.on('click', function() {
    let new_format = '.ico';
    if ($fileFormatText.text() == '.ico') {
      new_format = '.png';
    }
    $fileFormatText.text(new_format);
  });

  downloadIfParameterPresent();

  function getUrlParameter(param) {
    const url = decodeURIComponent(window.location.search.substring(1));
    const params = url.split('&');
    for (let i = 0; i < params.length; i++) {
      let p = params[i].split('=');
      if (p[0] === param) {
        p = params[i].split(param + '=');
        return p[1] === undefined ? true : p[1];
      }
    }
  }

  function downloadFromUrl(url) {
    $downloadIframe.attr('src', url);
  }

  function downloadIfParameterPresent() {
    let downloadResponse = getUrlParameter('json_result');
    if (downloadResponse !== undefined) {
      downloadResponse = JSON.parse(downloadResponse).favicon_generation_result;
      if (downloadResponse.result.status == 'error') {
        iconCreationError(downloadResponse.result.status.error_message);
      } else {
        downloadFromUrl(downloadResponse.favicon.package_url);
      }
    }
  }

  function postAndRedirect(data) {
    $interactiveDownloadInput.attr('value', data);
    $interactiveDownload.submit();
  }

  function generateBase64Picture() {
    return canvas.toDataURL().split(',')[1];
  }

  function createAdvancedRequest() {
    return JSON.stringify({
      favicon_generation: {
        api_key: '87d5cd739b05c00416c4a19cd14a8bb5632ea563',
        master_picture: {
          type: 'inline',
          content: generateBase64Picture(),
          demo: 'false',
        },

        files_location: { type: 'no_location' },
        callback: {
          type: 'url',
          url: 'https://gauger.io/fonticon',
          short_url: 'false',
          path_only: 'false',
        },
      },
    });
  }
}

export { initDownload };
