var Quagga = window.Quagga;
var ScannerApp = {
    _scanner: null,
    init: function() {
        //this.activateScanner();
    },
    activateScanner: function() {
        var scanner = this.configureScanner('.overlay__content'),
            onDetected = function (result) {
                $("#current-upc").val(result.codeResult.code);
                stop();
            }.bind(this),
            stop = function() {
                scanner.stop();  // should also clear all event-listeners?
                scanner.removeEventListener('detected', onDetected);
                this.hideOverlay();
                this.attachListeners();
                $('#scan-item').click();
            }.bind(this);

        this.showOverlay(stop);
        scanner.addEventListener('detected', onDetected).start();
    },
    deactivateScanner: function() {
        //var scanner = this.configureScanner('.overlay__content'),
        scanner.stop();  // should also clear all event-listeners?
        scanner.removeEventListener('detected', onDetected);
        this.hideOverlay();
        $('#scan-item').click();
    },
    attachListeners: function() {
      /*
        var self = this,
            button = document.querySelector('.input-field input + button.scan');

        button.addEventListener("click", function onClick(e) {
            e.preventDefault();
            button.removeEventListener("click", onClick);
            self.activateScanner();
        });
        */
    },
    showOverlay: function(cancelCb) {
        if (!this._overlay) {
            var content = document.createElement('div');
            var closeButton = document.createElement('div');

            closeButton.appendChild(document.createTextNode('Close'));
            content.className = 'overlay__content';
            closeButton.className = 'overlay__close';
            this._overlay = document.createElement('div');
            this._overlay.className = 'overlay';
            this._overlay.appendChild(content);
            content.appendChild(closeButton);
            closeButton.addEventListener('click', function closeClick() {
                closeButton.removeEventListener('click', closeClick);
                cancelCb();
            });
            var scanner = document.querySelector(".scanner");
            scanner.replaceWith(this._overlay);
        } else {
            var closeButton = document.querySelector('.overlay__close');
            closeButton.addEventListener('click', function closeClick() {
                closeButton.removeEventListener('click', closeClick);
                cancelCb();
            });
        }
        this._overlay.style.display = "block";
    },
    hideOverlay: function() {
        if (this._overlay) {
            this._overlay.style.display = "none";
        }
    },
    configureScanner: function(selector) {
        if (!this._scanner) {
            this._scanner = Quagga
                .decoder({readers: ['ean_reader']})
                .locator({patchSize: 'large', halfSample: true})
                .fromSource({
                    target: selector,
                    constraints: {
                        width: 400,
                        height: 300,
                        facingMode: "environment"
                    }
                });
        }
        return this._scanner;
    }
};

ScannerApp.init();


