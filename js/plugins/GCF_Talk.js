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
