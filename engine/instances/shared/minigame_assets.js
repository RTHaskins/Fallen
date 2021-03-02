/**
 * Creates a new minigame timer which will count down to zero. When it reaches zero it will call onTimerStopped.
 * 
 * 
 */
class MinigameTimer extends EngineInstance {
    onEngineCreate() {
        throw new Error("Do not instantiate the MinigameTimer with rooms.")
    }

    onCreate(frames, style = { fontFamily: 'Helvetica', fontSize: 30, fontVariant: 'bold italic', fill: '#FFFFFF', align: 'center', stroke: '#363636', strokeThickness: 2 }) {
        this.timerText = new PIXI.Text('TIME REMAINING:', style);
        this.timerText.anchor.x=0.5
        this.timerText.x = $engine.getWindowSizeX()/2;
        this.timerText.y = 40;

        this.timerDone = false;
        this.isPaused = false;
        this.visible = true;

        this.onTimerUp = [];

        this.gameOverText = "GAME OVER";
        this.gameCompleteText = "GAME COMPLETE";

        this.timerTextPrepend = "TIME REMAINING: ";

        this.survivalMode = false;

        this.canExpire = true;

        this.restartTimer(frames);
    }

    /**
     * Registers a function with this timer that will be called when the timer is stopped for any reason.
     * 
     * @param {EngineInstance} par The parent instance for variable access reasons
     * @param {Function} f The function to call, with the first argument being par and the second being whether or not the timer expired (true) or if it was forced to stop by stopTimer() (false)
     */
    addOnTimerStopped(par, f) {
        this.onTimerUp.push({parent:par, func:f});
    }

    removeAllOnTimerStopped() {
        this.onTimerUp = [];
    }

    preventExpire() {
        this.canExpire = false;
    }

    step() {
        if(!this.timerDone && !this.isPaused) {
            this._updateText();
            this._checkIsTimeUp();
            this.timer--;
        }
    }

    setGameOverText(text) {
        this.gameOverText = text;
    }

    setGameCompleteText(text) {
        this.gameCompleteText = text;
    }

    getGameOverText() {
        return this.gameOverText;
    }

    getGameCompleteText() {
        return this.gameCompleteText;
    }

    // inverts the timer's behaviours. now when the timer expires, it is counted as a win.
    setSurvivalMode() {
        this.survivalMode = true;
    }

    updateStyle(key, value) {
        this.timerText.style[key]=value;
        this.timerText.dirty = true;
    }

    setStyle(style) {
        this.timerText.style = style;
        this.timerText.dirty = true;
    }

    restartTimer(newTime) {
        this.timerDone = false;
        this.timer = newTime;
        this._updateText();
    }

    _updateText() {
        var strEnd = String(EngineUtils.roundMultiple((this.timer%60)/60,0.01))+"000"
        this.timerText.text = this.timerTextPrepend + String(Math.floor(this.timer/60) +":"+strEnd.substring(2,4))
    }

    _checkIsTimeUp() {
        if(this.timer<0) {
            this.expire();
        }
    }

    getTimeRemaining() {
        return this.timer;
    }

    setTimeRemaining(frames) {
        if(this.timerDone) {
            throw new Error("Timer must be running to set the time remaining");
        }
        this.timer = frames;
    }

    /**
     * Skips the specified number of frames on the timer.
     * @param {Number} frames The amount of frames to skip
     */
    tickDown(frames) {
        this.timer -= frames;
        if(this.timer-frames<0)
            this.timer = 0;
    }

    /**
     * Causes the timer to stop immediately and display either the gameComplete or gameOver text based on whether
     * or not it is in survival mode. The timer will consider this a loss in survival mode.
     * 
     * This will fire all onTimerStopped methods and input an argument of 'false'
     */
    stopTimer() {
        for(const f of this.onTimerUp)
            f.func(f.parent,false);
        this.timerDone=true;

        if(this.survivalMode)
            this.timerText.text = this.gameOverText;
        else
            this.timerText.text = this.gameCompleteText;
    }

    /**
     * Expires the timer immediately. this is the same as setting the remaining time to zero.
     * This will cause the timer to display either the gameComplete or gameOver text based on whether
     * or not it is in survival mode. The timer will consider this a win survival mode
     * 
     * This will fire all onTimerStopped methods and input an argument of 'true'
     */
    expire() {
        if(!this.canExpire)
            return;
        for(const f of this.onTimerUp)
                f.func(f.parent,true);
        this.timerDone = true;
        if(this.survivalMode)
            this.timerText.text = this.gameCompleteText;
        else
            this.timerText.text = this.gameOverText;
    }

    isTimerDone() {
        return this.timerDone;
    }

    pauseTimer() {
        this.isPaused = true;
    }

    unpauseTimer() {
        this.isPaused=false;
    }

    hideTimer() {
        this.visible = false;
    }

    unhideTimer() {
        this.visible=true;
    }

    setLocation(x,y) {
        this.timerText.x = x;
        this.timerText.y = y;
    }

    setAnchor(x,y) {
        this.timerText.anchor.set(x,y);
    }

    draw(gui, camera) {
        if(this.visible)
            $engine.requestRenderOnGUI(this.timerText);
    }

    cleanup() {
        $engine.freeRenderable(this.timerText);
    }

}

/**
 * Overwrites:
 * 
 * **onEngineCreate** / onCreate
 * 
 * step
 * 
 * pause
 * 
 * draw
 * 
 * cleanup
 * 
 * This class automatically handles the start and cheating with minigames. Simply tell it what to render using setInstructionRenderable and
 * setCheatRenderable and it does the rest.
 * 
 * Can call hasCheated() to know if the user has cheated. or can can use addCheatCallback to get a function callback when cheat is pressed.
 * Additionally addOnGameStartCallback will call the specified function when the instructions go away.
 */
class MinigameController extends EngineInstance {
    onEngineCreate() {
        if(this.__initalized)
            return;
        if(MinigameController.controller !== undefined)
            throw new Error("Only one MinigameController may exist at a time.");
        this.__initalized = true;
        this.minigamePaused = false;

        this.failed = false;
        this.gameStopped = false;
        this.stopTimer = 0;
        this.stopTime = 75;

        this.won = false;

        this.instructionTimer = 0;
        this.instructionTimerLength = 60*30; // 30 seconds at most
        this.showingInstructions = true;

        this.cheated = false;
        this.cheatTimer = 0;
        this.cheatTimerLength = 60*2;
        this.showingCheat = false;

        this.onCheatCallbacks  = [];
        this.onGameStartCallbacks = [];

        this.cheatKey = "Enter"
        this.cheatButton = undefined; // TODO: make into engineButton later

        this.cheatKeyActive = true;
        this.cheatButtonActive = false;

        this.allowActivateCheat = true;

        this.blurFadeTime = 60;
        this.blurFilterStrength = 9.6666; // making it a round number kinda messes with it
        this.blurFilter = new PIXI.filters.BlurFilter(8,4,3,15);
        this.blurFilter.blur = this.blurFilterStrength
        this.blurFilter.repeatEdgePixels=true;
        this.blurFilterInstruction = new PIXI.filters.BlurFilter(8,4,3,15);
        this.blurFilterInstruction.blur = 0
        this.blurFilterInstruction.repeatEdgePixels=true;

        if(!$engine.isLow()) {
            $engine.getCamera().addFilter(this.blurFilter);

        }
        this.adjustmentFilter = new PIXI.filters.AdjustmentFilter();
        $engine.getCamera().addFilter(this.adjustmentFilter);

        $engine.setOutcomeWriteBackValue(ENGINE_RETURN.LOSS);
        $engine.setCheatWriteBackValue(ENGINE_RETURN.NO_CHEAT);

        this.cheatImage = undefined
        this.setCheatRenderable(new PIXI.Sprite($engine.getTexture("gui_cheat_graphic")))
        this.instructionImage = undefined;
        this.setInstructionRenderable(new PIXI.Sprite($engine.getTexture("title_card")));

        MinigameController.controller = this;

        $engine.pauseGame();
    }

    onCreate() {
        this.onEngineCreate();
    }

    step() {
        this._minigameControllerTick();
    }

    disableCheating() {
        this.allowActivateCheat=false;
    }

    /**
     * Fires if the window loses visibility and causes the game to stop.
     * 
     * When the user returns to the game, this event will fire with how many frames would have passed had they not hidden the game.
     * @param {Number} frames The amount of frames that were missed
     */
    notifyFramesSkipped(frames) {
        console.error("Notify Frames Skipped should always be implemenetd! -- "+String(frames)+" frames skipped...")
    }

    _minigameControllerTick() {
        if(!this.failed && ! this.won && !this.showingInstructions && this.cheatKeyActive && IN.keyCheckPressed(this.cheatKey)) {
            this.cheat();
        }
        this._handleInstructionImage();
        this._handleCheatImage();
    }

    gameWin() {
        if(this.failed || this.won)
            return;
        throw new Error("To be implemented")
    }

    gameLoss() {
        if(this.failed || this.won)
            return;
        this.failed = true;
        $engine.setTimescale(0.9999);
    }

    _winLossTick() {
        if(!this.failed) {
            return;
        }

        if(!this.gameStopped) {
            var fac = EngineUtils.interpolate(this.stopTimer/this.stopTime,0.9999,0,EngineUtils.INTERPOLATE_OUT_EXPONENTIAL);
            this.adjustmentFilter.saturation = fac;
            $engine.setTimescale(fac)
            this.stopTimer++;
            if(this.stopTimer>this.stopTime)
                this.gameStopped=true;
        } else {

        }
    }

    timescaleImmuneStep() {
        this._winLossTick();
    }

    pause() {
        this._minigameControllerTick();
    }

    draw(gui, camera) {
        if(this.showingInstructions) {
            $engine.requestRenderOnGUI(this.instructionImage);
        }

        if(this.showingCheat) {
            $engine.requestRenderOnGUI(this.cheatImage)
        }
    }

    cleanup() {
        MinigameController.controller = undefined;
    }

    setCheatButtonActive(bool) {
        this.cheatButtonActive = bool;
    }

    setCheatKeyActive(bool) {
        this.cheatKeyActive = bool;
    }

    cheat() {
        if(this.cheated) {
            return;
        }
        for(const callback of this.onCheatCallbacks) {
            callback.func(callback.caller);
        }
        $engine.pauseGame();
        $engine.setCheatWriteBackValue(ENGINE_RETURN.CHEAT);
        this.blurFilter.blur = this.blurFilterStrength;
        if(!$engine.isLow())
            $engine.getCamera().addFilter(this.blurFilter);
        this.cheated = true;
        this.showingCheat = true;
    }

    hasCheated() {
        return this.cheated;
    }

    addCheatCallback(parent,callback) {
        this.onCheatCallbacks.push({
            func:callback,
            caller:parent
        });
    }

    addOnGameStartCallback(parent,callback) {
        this.onGameStartCallbacks.push({
            func:callback,
            caller:parent
        });
    }

    _handleInstructionImage() {
        this.instructionTimer++;
        if(this.instructionTimer<this.instructionTimerLength) {
            if(((IN.anyKeyPressed() && this.instructionTimer>18) || IN.keyCheckPressed("Space") || IN.keyCheckPressed("Enter")) 
                            && this.instructionTimer < this.instructionTimerLength-this.blurFadeTime) {
                this.instructionTimer = this.instructionTimerLength-this.blurFadeTime; // skip;
            }
            if(this.instructionTimer>=this.instructionTimerLength-this.blurFadeTime) {
                var stren = EngineUtils.interpolate((this.instructionTimer-this.instructionTimerLength+this.blurFadeTime)/this.blurFadeTime,
                                                    this.blurFilterStrength,0,EngineUtils.INTERPOLATE_SMOOTH)
                this.blurFilter.blur = stren
                this.instructionImage.alpha = stren/this.blurFilterStrength
                this.blurFilterInstruction.blur = (1-(stren/this.blurFilterStrength))*40;
            }
        }
        if(this.instructionTimer===this.instructionTimerLength) {
            this.showingInstructions=false;
            if(!$engine.isLow())
                $engine.getCamera().removeFilter(this.blurFilter);
            this._onGameStart();
            $engine.unpauseGame();
        }
    }

    _handleCheatImage() {
        if(!this.cheated) {
            return;
        }
        this.cheatTimer++;
        if(this.cheatTimer===this.cheatTimerLength) {
            this.showingCheat=false;
            if(!$engine.isLow())
                $engine.getCamera().removeFilter(this.blurFilter);
            $engine.unpauseGame();
        }
    }

    _onGameStart() {
        for(const callback of this.onGameStartCallbacks) {
            callback.func(callback.caller);
        }
    }

    /**
     * Makes this MinigameController display this renderable object as instructions.
     * 
     * The renderable will be automatically destroyed by the MinigameController.
     * @param {PIXI.DisplayObject} renderable The object to render
     */
    setInstructionRenderable(renderable) {
        if(this.instructionImage) {
            this.instructionImage.filters = [];
        }
        this.instructionImage = renderable;
        this.instructionImage.filters = [this.blurFilterInstruction];
        this.instructionImage.x = $engine.getWindowSizeX()/2;
        this.instructionImage.y = $engine.getWindowSizeY()/2;
        this.instructionImage.anchor.x = 0.5;
        this.instructionImage.anchor.y = 0.5;
        $engine.createManagedRenderable(this,renderable);
    }

    /**
     * Makes this MinigameController display this renderable object as the cheat graphic.
     * 
     * The renderable will be automatically destroyed by the MinigameController.
     * @param {PIXI.DisplayObject} renderable The object to render
     */
    setCheatRenderable(renderable) {
        this.cheatImage = renderable;
        this.cheatImage.x = $engine.getWindowSizeX()/2;
        this.cheatImage.y = $engine.getWindowSizeY()/2;
        this.cheatImage.anchor.x = 0.5;
        this.cheatImage.anchor.y = 0.5;
        $engine.createManagedRenderable(this,renderable);
    }

    /**
     * Static method to get the current instance of MinigameController.
     * @returns {MinigameController} The controller
     */
    static getInstance() {
        return MinigameController.controller;
    }
}
MinigameController.controller = undefined;

class ParallaxingBackground extends EngineInstance {

    onEngineCreate() {
        this.parallaxFactorX = 0.25;
        this.parallaxFactorY = 0.25;
        this.x = $engine.getWindowSizeX()/2;
        this.y = $engine.getWindowSizeY()/2;
        this.sprites = $engine.getTexturesFromSpritesheet("background_sheet",0,$engine.getSpriteSheetLength("background_sheet"));
        for(var i =0;i<this.sprites.length;i++) {
            this.sprites[i] = $engine.createRenderable(this,new PIXI.Sprite(this.sprites[i]),false);
            this.sprites[i].x = this.x;
            this.sprites[i].y = this.y;
        }
        this.depth = 9999999999;
        $engine.setBackground(new PIXI.Graphics())
        $engine.setBackgroundColour(0xe2d6b3);
    }

    onCreate() {
        this.onEngineCreate()
    }

    draw() {
        var dx = $engine.getCamera().getX()
        var dy = $engine.getCamera().getY()
        var cx = $engine.getWindowSizeX()/2 + dx;
        var cy = $engine.getWindowSizeY()/2 + dy;
        var facX = this.parallaxFactorX;
        var facY = this.parallaxFactorY;
        for(var i = this.sprites.length-1;i>=0;i--) {
            this.sprites[i].x = cx+(-dx*facX);
            this.sprites[i].y = cy+(-dy*facY);
            facX/=2;
            facY/=2;
        }
    }

}