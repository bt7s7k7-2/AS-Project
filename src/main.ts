import { Color, Matrix, Point } from "mini-draw"
import { AttackDamage } from "./components/AttackDamage"
import { Collider } from "./components/Collider"
import { Force, FORCE_NEUTRAL, FORCE_PLAYER } from "./components/Force"
import { Health } from "./components/Health"
import { IsPlayer } from "./components/IsPlayer"
import { MaxSpeed } from "./components/MaxSpeed"
import { Position } from "./components/Position"
import { RenderColor } from "./components/RenderColor"
import { ShootingCooldown } from "./components/ShootingCooldown"
import { Size } from "./components/Size"
import { Dispatcher } from "./ecs/Dispatcher"
import { GameView } from "./GameView"
import { NaiveDispatcher } from "./NaiveDispatcher"
import "./style.scss"
import { BulletHitSystem } from "./systems/BulletHitSystem"
import { CameraSystem } from "./systems/CameraSystem"
import { CollisionSystem } from "./systems/CollisionSystem"
import { DeathSystem } from "./systems/DeathSystem"
import { HealthBarRenderSystem } from "./systems/HealthBarRenderSystem"
import { PlayerMovementSystem } from "./systems/PlayerMovementSystem"
import { PlayerShootingSystem } from "./systems/PlayerShootingSystem"
import { RenderSystem } from "./systems/RenderSystem"
import { VelocityMovementSystem } from "./systems/VelocityMovementSystem"

const gameView = new GameView()
const dispatcher: Dispatcher = new NaiveDispatcher(gameView)

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

dispatcher.createEntity([
    new Position(new Point(5, 5)),
    new Size(Point.one),
    new RenderColor(Color.orange.mul(0.5)),
    new Health(5),
    new Force(FORCE_NEUTRAL),
    new Collider("static"),
])

dispatcher.registerSystem(BulletHitSystem)
dispatcher.registerSystem(CameraSystem)
dispatcher.registerSystem(CollisionSystem)
dispatcher.registerSystem(DeathSystem)
dispatcher.registerSystem(HealthBarRenderSystem)
dispatcher.registerSystem(PlayerMovementSystem)
dispatcher.registerSystem(PlayerShootingSystem)
dispatcher.registerSystem(RenderSystem)
dispatcher.registerSystem(VelocityMovementSystem)

let lastFrame = performance.now()
setInterval(() => {
    const now = performance.now()
    const deltaTime = (now - lastFrame) / 1000
    lastFrame = now

    gameView.drawer
        .setNativeSize()
        .overrideTransform(Matrix.identity)
        .setStyle(Color.white.mul(0.5).lerp(Color.green, 0.01))
        .fillRect()

    dispatcher.update(deltaTime)
}, 17)
