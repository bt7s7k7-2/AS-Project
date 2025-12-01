import { Color, Matrix, Point } from "mini-draw"
import { AttackDamage } from "./components/AttackDamage"
import { Collider } from "./components/Collider"
import { Force, FORCE_PLAYER } from "./components/Force"
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
import { ARENA_SIZE, WaveSpawnerSystem } from "./systems/WaveSpawnerSystem"

const game = new Game()
export const dispatcher: Dispatcher = new PreFilteredDispatcher(game)

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
dispatcher.registerSystem(WaveSpawnerSystem)

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

const wallThickness = 1
for (const [position, size] of [
    [new Point(0, ARENA_SIZE * 0.5), new Point(ARENA_SIZE + wallThickness, wallThickness)],
    [new Point(0, -ARENA_SIZE * 0.5), new Point(ARENA_SIZE + wallThickness, wallThickness)],
    [new Point(ARENA_SIZE * 0.5, 0), new Point(wallThickness, ARENA_SIZE + wallThickness)],
    [new Point(-ARENA_SIZE * 0.5, 0), new Point(wallThickness, ARENA_SIZE + wallThickness)],
]) {
    dispatcher.createEntity([
        new Position(position),
        new Size(size),
        new RenderColor(Color.white.mul(0.3).lerp(Color.magenta, 0.02)),
        new Collider("static"),
    ])
}

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
