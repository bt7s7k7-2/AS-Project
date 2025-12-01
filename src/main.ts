import { Color, Matrix, Point } from "mini-draw"
import { AIState } from "./components/AIState"
import { AttackDamage } from "./components/AttackDamage"
import { Collider } from "./components/Collider"
import { Force, FORCE_ENEMY, FORCE_NEUTRAL, FORCE_PLAYER } from "./components/Force"
import { Health } from "./components/Health"
import { IsPlayer } from "./components/IsPlayer"
import { MaxSpeed } from "./components/MaxSpeed"
import { Position } from "./components/Position"
import { RenderColor } from "./components/RenderColor"
import { ShootingCooldown } from "./components/ShootingCooldown"
import { Size } from "./components/Size"
import { Dispatcher } from "./ecs/Dispatcher"
import { Game } from "./Game"
import { PreFilteredDispatcher } from "./PreFilteredDispatcher"
import "./style.scss"
import { BulletHitSystem } from "./systems/BulletHitSystem"
import { CameraSystem } from "./systems/CameraSystem"
import { CollisionSystem } from "./systems/CollisionSystem"
import { DeathSystem } from "./systems/DeathSystem"
import { EnemyBehaviourSystem } from "./systems/EnemyBehaviourSystem"
import { EnemyCollisionReactionSystem } from "./systems/EnemyCollisionReactionSystem"
import { EnemyShootingSystem } from "./systems/EnemyShootingSystem"
import { HealthBarRenderSystem } from "./systems/HealthBarRenderSystem"
import { PlayerMovementSystem } from "./systems/PlayerMovementSystem"
import { PlayerShootingSystem } from "./systems/PlayerShootingSystem"
import { RenderSystem } from "./systems/RenderSystem"
import { VelocityMovementSystem } from "./systems/VelocityMovementSystem"

const game = new Game()
const dispatcher: Dispatcher = new PreFilteredDispatcher(game)

dispatcher.registerSystem(BulletHitSystem)
dispatcher.registerSystem(CameraSystem)
dispatcher.registerSystem(CollisionSystem)
dispatcher.registerSystem(EnemyBehaviourSystem)
dispatcher.registerSystem(EnemyCollisionReactionSystem)
dispatcher.registerSystem(EnemyShootingSystem)
dispatcher.registerSystem(DeathSystem)
dispatcher.registerSystem(HealthBarRenderSystem)
dispatcher.registerSystem(PlayerMovementSystem)
dispatcher.registerSystem(PlayerShootingSystem)
dispatcher.registerSystem(RenderSystem)
dispatcher.registerSystem(VelocityMovementSystem)

dispatcher.createEntity([
    new Position(Point.zero),
    new Size(Point.one),
    new RenderColor(Color.yellow),
    new IsPlayer(),
    new MaxSpeed(15),
    new ShootingCooldown(0.1),
    new AttackDamage(1),
    new Collider("dynamic"),
    new Health(20),
    new Force(FORCE_PLAYER),
])

const arenaSize = 20
const wallThickness = 1
for (const [position, size] of [
    [new Point(0, arenaSize * 0.5), new Point(arenaSize, wallThickness)],
    [new Point(0, -arenaSize * 0.5), new Point(arenaSize, wallThickness)],
    [new Point(arenaSize * 0.5, 0), new Point(wallThickness, arenaSize)],
    [new Point(-arenaSize * 0.5, 0), new Point(wallThickness, arenaSize)],
]) {
    dispatcher.createEntity([
        new Position(position),
        new Size(size),
        new RenderColor(Color.white.mul(0.3).lerp(Color.magenta, 0.02)),
        new Collider("static"),
    ])
}

for (let i = 0; i < 5; i++) {
    dispatcher.createEntity([
        new Position(new Point(Math.random() * arenaSize - arenaSize * 0.5, Math.random() * arenaSize - arenaSize * 0.5)),
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
}

dispatcher.createEntity([
    new Position(new Point(5, 5)),
    new Size(Point.one),
    new RenderColor(Color.orange.mul(0.5)),
    new Health(5),
    new Force(FORCE_NEUTRAL),
    new Collider("static"),
])

let lastFrame = performance.now()
setInterval(() => {
    const now = performance.now()
    const deltaTime = (now - lastFrame) / 1000
    lastFrame = now

    game.drawer
        .setNativeSize()
        .overrideTransform(Matrix.identity)
        .setStyle(Color.white.mul(0.5).lerp(Color.green, 0.01))
        .fillRect()

    dispatcher.update(deltaTime)
}, 17)
