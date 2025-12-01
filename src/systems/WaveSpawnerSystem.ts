import { Color, Point } from "mini-draw"
import { AIState } from "../components/AIState"
import { AttackDamage } from "../components/AttackDamage"
import { Collider } from "../components/Collider"
import { EntityDiedEvent } from "../components/EntityDestroyedEvent"
import { Force, FORCE_ENEMY, FORCE_NEUTRAL } from "../components/Force"
import { Health } from "../components/Health"
import { IsPlayer } from "../components/IsPlayer"
import { MaxSpeed } from "../components/MaxSpeed"
import { Position } from "../components/Position"
import { RenderColor } from "../components/RenderColor"
import { ShootingCooldown } from "../components/ShootingCooldown"
import { Size } from "../components/Size"
import { Entity } from "../ecs/Entity"
import { EventHandler } from "../ecs/EventHandler"
import { dispatcher } from "../main"

export const ARENA_SIZE = 20

const _PATTERNS = [
    `\
####################
#                  #
#   EE  EEEE  EE   #
#                  #
# E CC  CCCC  CC E #
# E CC        CC E #
#                  #
#                  #
#  E   C    C   E  #
#  E   C    C   E  #
#  E   C    C   E  #
#  E   C    C   E  #
#                  #
#                  #
# E CC        CC E #
# E CC  CCCC  CC E #
#                  #
#   EE  EEEE  EE   #
#                  #
####################
`,
    `\
####################
#                  #
# EEE          EEE #
#                  #
#      CC   C  CCC #
#  C   CC   C  CCC #
# EC   C   CC   C  #
# EC   C   CC   CE #
# EC            CE #
# EC EE      EE CE #
# EC EE      EE CE #
# EC            CE #
#  C   CC   C   CE #
# CCC  CC   C   C  #
# CCC  C   CC      #
#      C   CC      #
#                  #
# EEE          EEE #
#                  #
####################
`,
    `\
####################
#            EE    #
# EE            EE #
#  E     EE     E  #
#   CCCC EE CCCC   #
#      C EE C      #
#      C    C      #
# CCC  CCCCCC  CCC #
#  C            C  #
#  C E      E   C  #
#  C    E     E C  #
#  C            C  #
# CCC  CCCCCC  CCC #
#      C    C      #
#      C EE C      #
#   CCCC EE CCCC   #
#        EE        #
# EE EE         EE #
#  E            E  #
####################
`,
]

export class WaveSpawnerSystem extends EventHandler<typeof EntityDiedEvent> {
    protected _enemies = new Set<Entity>()
    protected _props = new Set<Entity>()
    protected _wave = 0
    protected _maxWaves = 10
    protected _enemiesToSpawn: Point[] = []
    protected _cratesToSpawn: Point[] = []

    public getPriority(): number {
        return 200
    }

    public getEventType(): typeof EntityDiedEvent {
        return EntityDiedEvent
    }

    public handleEvents(events: [Entity, EntityDiedEvent][]): void {
        for (const [entity] of events) {
            if (this._enemies.delete(entity)) {
                // Enemy died
            } else if (this._dispatcher.tryGetComponent(entity, IsPlayer)) {
                // Player died
                this._displayAnnouncement("You died")
            }
        }

        // When spawning crates and enemies, only spawn one per frame for a pleasing animation

        if (this._cratesToSpawn.length > 0) {
            const point = this._cratesToSpawn.pop()!
            const crate = dispatcher.createEntity([
                new Position(point),
                new Size(Point.one),
                new RenderColor(Color.orange.mul(0.5)),
                new Health(5),
                new Force(FORCE_NEUTRAL),
                new Collider("static"),
            ])

            this._props.add(crate)
            return
        }

        if (this._enemiesToSpawn.length > 0) {
            const point = this._enemiesToSpawn.pop()!
            const enemy = dispatcher.createEntity([
                new Position(point),
                new Size(Point.one),
                new RenderColor(Color.red),
                new MaxSpeed(7),
                new Health(5),
                new Collider("dynamic"),
                new Force(FORCE_ENEMY),
                new AIState(),
                new ShootingCooldown(1),
                new AttackDamage(1),
            ])

            this._enemies.add(enemy)
            return
        }

        if (this._enemies.size > 0) return
        // When all enemies have been defeated, go to the next wave
        // This will also execute on the first frame, we move from wave 0 to 1

        // Delete any leftover crates
        if (this._props.size > 0) {
            const firstProp = this._props[Symbol.iterator]().next().value!
            this._dispatcher.deleteEntity(firstProp)
            this._props.delete(firstProp)
            return
        }

        // Increment wave counter 
        this._wave++

        // Display wave announcement
        this._displayAnnouncement("Wave " + this._wave)

        // Pick a pattern for wave level
        const pattern = _PATTERNS[Math.random() * _PATTERNS.length | 0]

        // Based on the current wave, only a subset of the enemies defined in the level will be
        // spawned, collect all enemies here and later pick only a percentage
        const allEnemies: Point[] = []

        // Parse the pattern for the level
        const lines = pattern.split("\n")
        for (let y = 0; y < lines.length; y++) {
            const line = lines[y]
            for (let x = 0; x < line.length; x++) {
                const point = new Point(x - ARENA_SIZE * 0.5 + 0.5, y - ARENA_SIZE * 0.5 + 0.5)
                const char = line[x]

                if (char == "E") {
                    allEnemies.push(point)
                } else if (char == "C") {
                    this._cratesToSpawn.push(point)
                }
            }
        }

        // Spawn a number of enemies based on the current wave
        const difficulty = Math.min(1, this._wave / this._maxWaves)
        const enemyCount = difficulty * allEnemies.length | 0

        for (let i = 0; i < enemyCount; i++) {
            const enemy = allEnemies[Math.random() * allEnemies.length | 0]
            allEnemies.splice(i, 1)
            this._enemiesToSpawn.push(enemy)
        }
    }

    protected _displayAnnouncement(announcement: string) {
        const waveAnnouncement = document.createElement("div")
        waveAnnouncement.innerHTML = announcement

        document.querySelector(".as-announcement-container")!.appendChild(waveAnnouncement)

        waveAnnouncement.classList.add("as-announcement")
        waveAnnouncement.addEventListener("animationend", () => {
            waveAnnouncement.remove()
        })
    }
}
