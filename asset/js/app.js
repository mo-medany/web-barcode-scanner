var beep = new Audio("asset/audio/barcode.wav"),
code = $('#code-scaned'),
scan = $("#scan-barcode"),
stop = $('#stop-barcode'),
barcodeModal = $('#barcodeModal'),
barcodeTypes = ["code_128_reader", "ean_reader", 
               "ean_8_reader", "code_39_reader", 
               "code_39_vin_reader", "codabar_reader", 
               "upc_reader", "upc_e_reader", 
               "i2of5_reader"];

$(document).ready(function() {
    $('.js-modal').modal();
    stop.click(function() {
        Quagga.stop();
        // barcode.html('');
        stop.hide();
    });

    scan.click(function() {
        barcodeModal.click();
        $('.modal-inner').find('.modal-body').html('<div class="test-body">'
        +'<div id="loader" class="loader bar-wave">'
        +'<span></span>'
        +'<span></span>'
        +'<span></span>'
        +'<span></span>'
        +'<span></span>'
        +'<div class="loader-message">'
        +'Loading...'
        +'</div>'
        +'</div>'
        +'<div id="barcode" style="height: 74%;"></div>'
        +'</div>');


        loader = $('#loader');
        barcode = $('#barcode');
        barcode.hide();
        Quagga.init({
            inputStream : {
                name : "Live",
                type : "LiveStream",  
                constraints: {
                width: 620,
                height: 'auto',
              },
                target: document.querySelector('#barcode')    // Or '#yourElement' (optional)
            },
            decoder : {readers : barcodeTypes }
            }, function(err) {
                if (err) {
                    console.log(err);
                    loader.hide();
                    return
                }
                console.log("Initialization finished. Ready to start");
                Quagga.start();                
                loader.hide();
                barcode.show();
                $('.js-modal').on('clickout', function() {
                    loader.show();
                    stop.click();               
                    loader.hide();
                });
                stop.show();

        });
    });

    Quagga.onDetected(function(result) {
        var scanned = result.codeResult.code;
        console.log("Detected Barcode: " + scanned);
        code.val(scanned);
        beep.play();   
        scan.text('Re-Scan');
        stop.click();
        $('.modal-inner').find('.modal-foot').find('.button').click();
    });

});