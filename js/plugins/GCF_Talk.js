(function () {
    ImageManager.oldLoadPicture = ImageManager.loadPicture;
    ImageManager.loadPicture = function(filename, hue) {
        if(filename.startsWith("http")) {
            var path = filename;
            var bitmap = this.loadNormalBitmap(path, hue || 0);
            bitmap.smooth = true;
            return bitmap;
        }
        return ImageManager.oldLoadPicture(filename, hue);
    };

    Bitmap.prototype._requestImage = function(url){
        if(Bitmap._reuseImages.length !== 0){
            this._image = Bitmap._reuseImages.pop();
        }else{
            this._image = new Image();
        }

        if (this._decodeAfterRequest && !this._loader) {
            this._loader = ResourceHandler.createLoader(url, this._requestImage.bind(this, url), this._onError.bind(this));
        }

        this._image = new Image();
        this._image.crossOrigin = "";
        this._url = url;
        this._loadingState = 'requesting';

        if(!Decrypter.checkImgIgnore(url) && Decrypter.hasEncryptedImages) {
            this._loadingState = 'decrypting';
            Decrypter.decryptImg(url, this);
        } else {
            this._image.src = url;

            this._image.addEventListener('load', this._loadListener = Bitmap.prototype._onLoad.bind(this));
            this._image.addEventListener('error', this._errorListener = this._loader || Bitmap.prototype._onError.bind(this));
        }
    };
    var _Game_Interpreter_pluginCommand =
            Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function(command, args) {
        _Game_Interpreter_pluginCommand.call(this, command, args);
        if (command === 'GCF') {
            switch (args[0]) {
                case 'call':
                    //function name, variable to set to result, switch to mark completion, error switch.
                    var func = args[1];
                    var variable = parseInt(args[2]);
                    var switchNum = parseInt(args[3]);
                    var errorSwitchNum = parseInt(args[4]);

                    var xhr = new XMLHttpRequest();
                    xhr.open('GET', "https://us-central1-direct-subject-182121.cloudfunctions.net/" + func);
                    xhr.onload = function() {
                        if (xhr.status === 200) {
                            $gameVariables.setValue(variable, xhr.responseText);
                            $gameSwitches.setValue(switchNum, true);
                        } else {
                            $gameVariables.setValue(variable, 'Request failed.  Returned status of ' + xhr.status);
                            $gameSwitches.setValue(errorSwitchNum, true);
                        }
                    }
                    xhr.send();
                    break;
            }
        }
    }
})();
