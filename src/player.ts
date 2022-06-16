import * as PIXI from "pixi.js"
import { Game } from "./game";

export class Player extends PIXI.Sprite {
    game: Game

    xspeed = 0;
    yspeed = 0;

    constructor(texture: PIXI.Texture, game: Game) {
        super(texture)
        this.game = game
        window.addEventListener("keydown", (e: KeyboardEvent) => this.onKeyDown(e))
        window.addEventListener("keyup", (e: KeyboardEvent) => this.onKeyUp(e))

        //de positie van de bubbels wordt hier bepaalt
        this.x = 200;
        this.y = 400;

        this.scale.set(0.4 + 0.2)

        // let area = this.getBounds()
        // let greenbox = new PIXI.Graphics()
        // greenbox.lineStyle(2, 0x33FF33, 1)
        // greenbox.drawRect(0, 0, area.width, area.height)
        // this.addChild(greenbox)
    }

    update(delta: number) {
        this.x += this.xspeed
        this.y += this.yspeed

        let mapwidth = 18000
        let mapheight = 600
        let centerx = 500
        let centery = 600


        this.x = this.clamp(this.x + this.xspeed, 0, mapwidth)
        this.y = this.clamp(this.y + this.yspeed, 0, mapheight)

        // centreer het hele level onder het karakter, gebruik clamp om bij de randen niet te scrollen
        let mapx = this.clamp(this.x, centerx, mapwidth - 9000)
        let mapy = this.clamp(this.y, centery, mapheight - centery)

        this.game.pixi.stage.pivot.set(mapx - 500, mapy)
    }

    clamp(num: number, min: number, max: number) {
        return Math.min(Math.max(num, min), max)
    }


    onKeyDown(e: KeyboardEvent): void {
        switch (e.key.toUpperCase()) {
            case "A":
            case "ARROWLEFT":
                this.xspeed = -3
                break
            case "D":
            case "ARROWRIGHT":
                this.xspeed = 3
                break
            case "W":
            case "ARROWUP":
                this.yspeed = -3
                break
            case "S":
            case "ARROWDOWN":
                this.yspeed = 3
                break
        }
    }


    onKeyUp(e: KeyboardEvent): void {
        switch (e.key.toUpperCase()) {
            case "A":
            case "ARROWLEFT":
            case "D":
            case "ARROWRIGHT":
                this.xspeed = 0
                break;
            case "W":
            case "ARROWUP":
            case "S":
            case "ARROWDOWN":
                this.yspeed = 0
                break
        }
    }
}
