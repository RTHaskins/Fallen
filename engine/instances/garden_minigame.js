class GardenMinigameController extends MinigameController {
    
    onEngineCreate() { 
        super.onEngineCreate();
        this.score = 9;

        
        new ParallaxingBackground();

        this.timer = 0;
        this.attempts = 6;
        this.waiting = false;
        this.waitTimer = 0;
        
        this.startTimer(60*60);


        var text = new PIXI.Text("Basically\n WORMS\n\nPress ENTER to cheat",$engine.getDefaultTextStyle());
        this.setInstructionRenderable(text);
        this.controlsUseKeyBoard(false);

        this.progressText = new PIXI.Text("",$engine.getDefaultSubTextStyle());
        $engine.createManagedRenderable(this,this.progressText);
        this.progressText.anchor.set(0.5,0.5);
        this.progressText.x = $engine.getWindowSizeX()/2;
        this.progressText.y = $engine.getWindowSizeY()-30;
        //this.updateProgressText();
        //this.newRound();
        var plant_array = [];
        this.plant_array = plant_array;

        for(var i = 0; i < 9; i++){
            if(i < 3){
                plant_array[i] = new GardenPlant(90*2+200*i, $engine.getWindowSizeY()/2 -150, i);       
            }if(i >= 3 && i < 6){
                plant_array[i] = new GardenPlant(90*3+200*(i-3), $engine.getWindowSizeY()/2, i);
            }if(i >= 6 && i < 9){
                plant_array[i] = new GardenPlant(90*2+200*(i-6), $engine.getWindowSizeY()/2 +150, i);
            }
        }

    }

    notifyFramesSkipped(frames) {
        this.getTimer().tickDown(frames);  
    }


    onCreate() { 
        super.onCreate();
        this.onEngineCreate();
    }


    step() {
        super.step();
        if(this.minigameOver()){
            return;
        }
        if(this.timer === 60){
            var spawnI = EngineUtils.irandomRange(0,8);
            IM.with(GardenWorm, function(worm){
                if(worm.index === spawnI){
                    spawnI = EngineUtils.irandomRange(0,8);;
                }
            });
            this.spawnWorm(spawnI);
            
            //this.getTimer().unpauseTimer();
            this.timer = 0;
        }
        this.countPlants();
        this.timer++;
    }

    countPlants(){
        var temp_score = 0;
        for(var i = 0; i < 9; i++){
            if(this.plant_array[i] != undefined){
                temp_score++;
            }
        }
        this.score = temp_score;
        if(this.score <= 0){
            this.getTimer().pauseTimer();
            this.endMinigame(false);
        }
    }

    spawnWorm(spawnI){
        if(spawnI < 3){
            new GardenWorm(90*2+200*spawnI, $engine.getWindowSizeY()/2 -150, spawnI);       
        }if(spawnI >= 3 && spawnI < 6){
            new GardenWorm(90*3+200*(spawnI-3), $engine.getWindowSizeY()/2, spawnI);
        }if(spawnI >= 6 && spawnI < 9){
            new GardenWorm(90*2+200*(spawnI-6), $engine.getWindowSizeY()/2 +150, spawnI);
        }
    }

}

class GardenWorm extends EngineInstance {
    onCreate(x,y,index) {
        this.x = x-100;
        this.y = y;
        this.index = index;
        this.setSprite(new PIXI.Sprite($engine.getTexture("garden_worm_alive")));
        this.hitbox = new Hitbox(this,new RectangeHitbox(this,-25,-37,25,37));
        this.clicked = false;
        this.wormTimer = 0;
        this.wormTimerEat = 60;
        this.deathTime = 0;
    }

    step(){
        //if(!this.enabled){
            //return;
        //}
        if(this.wormTimer >= this.wormTimerEat && this.deathTime === 0){            
            GardenMinigameController.getInstance().plant_array[this.index] = undefined;
            this.destroy();
        }
       
        if(IM.instanceCollisionPoint(IN.getMouseX(), IN.getMouseY(), this) && IN.mouseCheckPressed(0)){
            this.deathTime = this.wormTimer;
            this.getSprite().texture = $engine.getTexture("garden_worm_dead");
            $engine.audioPlaySound("sky_bonk");
        }
        if(this.wormTimer > this.deathTime + 60 && this.deathTime != 0){
            this.destroy();
        }
        this.wormTimer++;
    }
}

class GardenPlant extends EngineInstance {
    onCreate(x,y,index) {
        this.x = x;
        this.y = y;
        this.index = index;
        this.score = 1;
        this.setSprite(new PIXI.Sprite($engine.getTexture("garden_plant")));
        this.hitbox = new Hitbox(this,new RectangeHitbox(this,-25,-37,25,37));
        this.clicked = false;
    }
    step(){
        if(GardenMinigameController.getInstance().plant_array[this.index] === undefined){
            this.destroy();
        }
    }
}