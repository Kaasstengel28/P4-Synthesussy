import * as PIXI from 'pixi.js'
//fotos importeren
import bubbleImage from "./images/sakura.png"
import backgroundImage from "./images/background.png"
import deathImage from "./images/bones.png"
import foregroundImage from "./images/foreground.png"
import godslugImage from "./images/godslug.png"
import idle from "./images/idle.png"


//classes importeren
import { TilingSprite } from 'pixi.js'
import { Bubble } from "./particles"
import { Player } from "./player"
import { Foreground } from "./wereld"
import { Godslug } from './DrSchtank'


export class game {
    //hier import hij de classes
    private bubble: Bubble;
    private bubbles: Bubble[];
    private player: Player;
    public slug: Godslug;

    private foreground: Foreground;
    private background: PIXI.TilingSprite

    private pixi: PIXI.Application
    private loader: PIXI.Loader
    private mylistener: EventListener



    constructor() {
        this.bubbles = [];

        this.mylistener = (e: Event) => this.logMessage(e)
        window.addEventListener('click', this.mylistener)

        //het gameveld wordt aangemaakt
        this.pixi = new PIXI.Application({ width: screen.width - 40, height: screen.height - 500 })
        document.body.appendChild(this.pixi.view)

        //laad de images alvast
        this.loader = new PIXI.Loader()
        this.loader
            .add('bubbleTexture', bubbleImage)
            .add('waterTexture', backgroundImage)
            .add('deadTexture', deathImage)
            .add('foreground', foregroundImage)
            .add('stinkySprite', godslugImage)
            .add('playerTexture', idle)


        //al zijn de images geladen roept hij de functie aan
        this.loader.load(() => this.doneLoading())
    }
    //hier  zet hij de event listeners uit
    private logMessage(e: Event) {
        console.log("hij is maar nu niet meer")
        window.removeEventListener("click", this.mylistener)
    }

    //zodra de sprites klaar zijn met laden begint hij met updaten
    private doneLoading() {
        //hier maakt hij de wereld (achtergrond/voorgrond) aan
        this.background = new PIXI.TilingSprite(this.loader.resources["waterTexture"].texture!, this.pixi.view.width, this.pixi.view.height )
        this.pixi.stage.addChild(this.background)
    
        //hier maakt hij alle sprites aan
        this.player = new Player(this.loader.resources["playerTexture"].texture!)
        this.pixi.stage.addChild(this.player)

        this.bubble = new Bubble(this.loader.resources["bubbleTexture"].texture!)
        this.pixi.stage.addChild(this.bubble)
        
        this.slug = new Godslug(this.loader.resources["stinkySprite"].texture!)
        this.pixi.stage.addChild(this.slug)

        //hier zorgt hij ervoor dat er meerdere sprites komen
        for (let i = 0; i < 20; i++) {
            let temp = new Bubble(this.loader.resources["bubbleTexture"].texture!);
            this.pixi.stage.addChild(temp);
            this.bubbles.push(temp);
        }
        //dit zorgt ervoor dat de update functie kan updaten
        this.pixi.ticker.add((delta) => this.update(delta))

        this.foreground = new Foreground(this.loader.resources["foreground"].texture!)
        this.pixi.stage.addChild(this.foreground)
    }

    private update(delta: number) {
        //dit update de bubbels zodat ze bewegen
        for(let bubble of this.bubbles) {
            bubble.update(delta)
        }

        //dit update de ahtergrond en de player
        this.background.tilePosition.x += 0.25
        this.player.update(delta)
        this.slug.update(delta)

        //hier checkt hij voor de collision
        if (this.groundCollision(this.player, this.foreground)) {
            this.player.y = 370
            }
    }

    //hier wordt ervoor gezorgt dat collision bestaat?
    private groundCollision(player: PIXI.Sprite, ground: PIXI.Sprite) {
        const bounds1 = player.getBounds()
        const bounds2 = this.foreground.getBounds()

        return bounds1.x < bounds2.x + bounds2.width
            && bounds1.x + bounds1.width > bounds2.x
            && bounds1.y < bounds2.y + bounds2.height
            && bounds1.y + bounds1.height > bounds2.y;
    }
}

new game()