function fixBinary(bin) {
    var length = bin.length;
    var buf = new ArrayBuffer(length);
    var arr = new Uint8Array(buf);
    for (var i = 0; i < length; i++) {
        arr[i] = bin.charCodeAt(i);
    }
    return buf;
}

function readTextFile(file, callback) {
    var data = Android.readFile(file);
    data = fixBinary(atob(data));
    var blob = new Blob([data]);

    callback(blob);
}

document.addEventListener('DOMContentLoaded', function () {
	var $body = document.querySelector('body');
	var $files =  document.querySelector("#files");
	var $loading =  document.querySelector("#parser-loading");
	var $modal =  document.querySelector("#modal");
	var $docxjsWrapper = document.querySelector("#docxjs-wrapper");

	var instance = null;

	var stopEvent= function(e) {
		if(e.preventDefault) e.preventDefault();
		if(e.stopPropagation) e.stopPropagation();

		e.returnValue = false;
		e.cancelBubble = true;
		e.stopped = true;
	};

	var getInstanceOfFileType = function(file) {
		var fileExtension = null;

		if (file) {
			var fileName = file.name;
			fileExtension = fileName.split('.').pop();
		}

		return fileExtension;
	};

	var documentParser = function(file) {
		var fileType = getInstanceOfFileType(file);

		if (fileType) {
			if (fileType === 'docx') {
				instance = window.docxJS = window.createDocxJS();

			} else if (fileType === 'xlsx') {
				instance = window.cellJS = window.createCellJS();

			} else if (fileType === 'pptx') {
				instance = window.slideJS = window.createSlideJS();

			} else if (fileType === 'pdf') {
				instance = window.pdfJS = window.createPdfJS();
			}


			if (instance) {
				$loading.style.display = 'block';
				instance.parse(
					file,
					function () {
						afterRender(file, fileType);
						$loading.style.display = 'gone';
					}, function (e) {
						if(!$body.classList.contains('is-docxjs-rendered')){
							$docxjsWrapper.style.display = 'gone';
						}

						if(e.isError && e.msg){
							alert(e.msg);
						}

						$loading.style.display = 'gone';
					}, null
				);
			}
		}
	};

	var afterRender = function (file, fileType) {
		var element = $docxjsWrapper;
		$(element).css('height','calc(100% - 65px)');

		var loadingNode = document.createElement("div");
		loadingNode.setAttribute("class", 'docx-loading');
		element.parentNode.insertBefore(loadingNode, element);
		$modal.style.display = 'block';

		var endCallBackFn = function(result){
			if (result.isError) {
				if(!$body.hasClass('is-docxjs-rendered')){
					$docxjsWrapper.style.display = 'gone';
					$body.classList.remove('is-docxjs-rendered');
					element.innerHTML = "";

					$modal.style.display = 'gone';
					$body.classList.add('rendered');
				}
			} else {
				$body.classList.add('is-docxjs-rendered');
				console.log("Success Render");
			}

			loadingNode.parentNode.removeChild(loadingNode);
		};

		if (fileType === 'docx') {
			window.docxAfterRender(element, endCallBackFn);

		} else if (fileType === 'xlsx') {
			window.cellAfterRender(element, endCallBackFn);

		} else if (fileType === 'pptx') {
			window.slideAfterRender(element, endCallBackFn, 0);

		} else if (fileType === 'pdf') {
			window.pdfAfterRender(element, endCallBackFn, 0);
		}
	};

//	var filePath = "docs/sample_small_file.docx";
	var filePath = "docs/sample_medium_file.xlsx";
//	var filePath = "docs/sample_large_file.docx";

	if (filePath == null) {
	    console.error("Input file not found");
	}

	readTextFile(filePath, function(content) {
        var parts = [
            content
        ];

//        var myfile = new File(parts, 'sample_word.docx', {
//            lastModified: new Date(),
//            type: "overide/mimetype"
//        });

         var myfile = new File(parts, 'sample_excel.xlsx', {
                    lastModified: new Date(),
                    type: "overide/mimetype"
                });

//        var myfile = new File(parts, 'sample_powerpoint.pptx', {
//                    lastModified: new Date(),
//                    type: "overide/mimetype"
//                });

        documentParser(myfile);
    });
});
