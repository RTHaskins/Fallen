// utility class to render a raytraced lights
class LightingLayer extends EngineInstance {
    onCreate() {
        // the back texture to mask (required to be a sprite for pixel perfect masking)
        this.blackSprite = $engine.createRenderable(this, new PIXI.Sprite($engine.getTexture("black_square")))
        this.blackSprite.x = $engine.getWindowSizeX()/2;
        this.blackSprite.y = $engine.getWindowSizeY()/2;
        this.blackSprite.alpha = 0.95;
 
        // light graphics is the actual light source
        this.lightGraphics = $engine.createManagedRenderable(this, new PIXI.Graphics());
        this.filter = new PIXI.filters.BlurFilter();
        this.filter.blur = 16;
        this.lightGraphics.filters = [this.filter]

        this.pixels = []
        this.pixelRenderTexture = $engine.createManagedRenderable(this, PIXI.RenderTexture.create($engine.getWindowSizeX(),$engine.getWindowSizeY()));


        // used to clear the pixel buffer
        this.whiteGraphics = $engine.createManagedRenderable(this, new PIXI.Graphics());
        this.whiteGraphics.beginFill(0xffffff);
        this.whiteGraphics.drawRect(0,0,$engine.getWindowSizeX(),$engine.getWindowSizeY());
        this.whiteGraphics.endFill();
        

        // this is required to perform pixel perfect masking.
        this.lightRenderTexture = $engine.createManagedRenderable(this, PIXI.RenderTexture.create($engine.getWindowSizeX()+256,$engine.getWindowSizeY()+256));
        this.lightSprite = $engine.createRenderable(this, new PIXI.Sprite(this.lightRenderTexture));
        this.lightSprite.x=-128;
        this.lightSprite.y=-128;

        this.blackSprite.mask = this.lightSprite;

        this.numPoints = 364;
        this.pixelsPerStep = 4;
        this.maxSteps = 128;

        this.multiMode = false;
        this.hasStarted = false;
    }

    setBlur(blur) {
        this.filter.blur = blur;
    }


    /**
     * Whether or not to enable multi mode. In multi mode, you can render multiple lights, but must
     * call finish() to render the lighting to the screen.
     * 
     * @param {Boolean} bool Enable
     */
    setMultiMode(bool) {
        this.multiMode = bool;
    }

    /**
     * Sets the alpha of the shadow sprite.
     * 
     * @param {Number} factor How much the shadow should show when not lit
     */
    setShadowFactor(factor) {
        this.blackSprite.alpha = factor;
    }

    /**
     * Sets the amount of points to cast out on a raycast.
     * 
     * @param {Number} points The amount of points to cast out
     */
    setNumPoints(points) {
        this.numPoints=points
    }

    /**
     * Sets the amount of pixels to move per check. Higher numbers result in faster performance
     * but more jittery light. Recommended values are between 4 and 8
     * 
     * 
     * @param {Number} pixels How many pixels to move per step
     */
    setPixelsPerStep(pixels) {
        this.pixelsPerStep=pixels;
    }

    /**
     * 
     * Sets the max steps the light is allowed to travel before cutting off.
     * 
     * @param {Number} maxSteps The max steps to traverse before the light abruptly cuts off
     */
    setMaxSteps(maxSteps) {
        this.maxSteps=maxSteps;
    }

    /**
     * Sets the pixel mask to use for raycasting. The pixel array must be a 1d array with dimensions 816 x 624.
     * @param {Array} pixels The pixel array.
     */
    setPixels(pixels) { // sets the pixel mask directly
        this.pixels = pixels
    }

    /**
     * Sets the pixel buffer directly. The input must be a texture or PIXI display object
     * of size 816 x 624.
     * 
     * @param {PIXI.DisplayObject | PIXI.getTexture} obj The source object to extract the pixel data from
     */
    setPixelsFrom(obj) {
        this.pixels = $engine.getRenderer().plugins.extract.pixels(obj);
    }

    /**
     * Renders the display object into the pixel buffer.
     * 
     * The buffer is used for temporary storage until updatePixels() is called,
     * which will cause the pixel buffer to be extracted into the pixel mask and then reset.
     * 
     * @param {PIXI.DisplayObject} obj The display object to render
     */
    renderSprite(obj) {
        var oy = obj.y;
        var ox = obj.x;
        obj.x-=$engine.getCamera().getX();
        obj.y-=$engine.getCamera().getY();
        $engine.getRenderer().render(obj,this.pixelRenderTexture,false,null,false);
        obj.x = ox;
        obj.y = oy;
    }

    /**
     * Extracts the pixels from the pixel buffer into the pixel mak and then resets the pixel buffer
     */
    updatePixels() {
        this.pixels = $engine.getRenderer().plugins.extract.pixels(this.pixelRenderTexture);
        this.clear();
    }

    /**
     * Clears the render texture for the light. Can be used to reset the mask for future renders.
     */
    clear() {
        $engine.getRenderer().render(this.whiteGraphics,this.pixelRenderTexture,false,null,false);
    }

    /**
     * Finishes rendering all lights. Called automatically in single mode,
     *  Should be called after all lights are rendered in multi mode.
     */
    finish() {
        this.hasStarted = false;
        $engine.getRenderer().render(this.lightGraphics,this.lightRenderTexture,false,null,false);
    }

    /**
     * Renders a light from the specified point.
     * 
     * @param {Number} startX The x starting location, in GUI space.
     * @param {Number} startY The y starting location, in GUI space
     */
    raytraceFrom(startX,startY, numPoints = -1, maxSteps = -1, pixelsPerStep = -1) {
        if(!this.hasStarted) {
            // clear the lighting graphics.
            this.lightGraphics.clear();

            this.lightGraphics.beginFill(0xffffff);
            this.lightGraphics.drawRect(-128, -128, $engine.getWindowSizeX()+256, $engine.getWindowSizeY()+256);
            this.lightGraphics.endFill();

            this.hasStarted = true;
        }

        if(numPoints === -1)
            numPoints = this.numPoints;
        if(maxSteps === -1)
            maxSteps = this.maxSteps;
        if(pixelsPerStep === -1)
            pixelsPerStep = this.pixelsPerStep;
            

        var points = [];
        var dz = Math.PI*2/numPoints;
        var point = undefined;
        for(var i =0;i<numPoints;i++) {
            var cx = startX;
            var cy = startY;
            var dx = Math.cos(i*dz) * pixelsPerStep;
            var dy = Math.sin(i*dz) * pixelsPerStep;
            point = undefined;
            for(var t = 0;t<maxSteps;t++) {
                var cxf = Math.floor(cx)
                var cyf = Math.floor(cy)
                if(this.pixels[(cxf + cyf*816)<<2]!==0xff) { // since it's black and white, we only need to check one
                    var point = new PIXI.Point(cxf+128,cyf+128)
                    points.push(point); // account for texture offset
                    break;
                }
                cx+=dx;
                cy+=dy;
            }
            if(!point) {
                points.push(new PIXI.Point(cxf+128,cyf+128))
            }
        }
        var poly = new PIXI.Polygon(points);

        this.lightGraphics.beginFill(0);
        this.lightGraphics.drawPolygon(poly)
        this.lightGraphics.endFill();

        if(!this.multiMode)
            this.finish();
    }

    draw(gui,camera) {
        var xx = $engine.getCamera().getX();
        var yy = $engine.getCamera().getY();
        this.blackSprite.x = xx+$engine.getWindowSizeX()/2;
        this.blackSprite.y = yy+$engine.getWindowSizeY()/2;

        this.lightSprite.x = xx-128;
        this.lightSprite.y = yy-128;
    }
}