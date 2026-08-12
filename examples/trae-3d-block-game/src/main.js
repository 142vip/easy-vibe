import * as THREE from 'three'

// ==================== 方块类型定义 ====================
const BlockType = {
  AIR: 0,
  GRASS: 1,
  DIRT: 2,
  STONE: 3,
  WOOD: 4,
  LEAVES: 5,
  SAND: 6
}

const BLOCK_COLORS = {
  [BlockType.GRASS]: { top: 0x4caf50, side: 0x8b5a2b, bottom: 0x8b5a2b },
  [BlockType.DIRT]: { top: 0x8b5a2b, side: 0x8b5a2b, bottom: 0x8b5a2b },
  [BlockType.STONE]: { top: 0x9e9e9e, side: 0x888888, bottom: 0x757575 },
  [BlockType.WOOD]: { top: 0xa0826d, side: 0x6d4c2b, bottom: 0xa0826d },
  [BlockType.LEAVES]: { top: 0x2e7d32, side: 0x388e3c, bottom: 0x1b5e20 },
  [BlockType.SAND]: { top: 0xf4e4bc, side: 0xe8d49b, bottom: 0xd4c088 }
}

const HOTBAR_BLOCKS = [
  BlockType.GRASS,
  BlockType.DIRT,
  BlockType.STONE,
  BlockType.WOOD,
  BlockType.LEAVES,
  BlockType.SAND
]

// ==================== 游戏配置 ====================
const CONFIG = {
  WORLD_SIZE: 32, // 世界半径（方块数）
  WORLD_HEIGHT: 24, // 世界高度
  GRAVITY: 28,
  JUMP_SPEED: 10,
  WALK_SPEED: 5,
  RUN_SPEED: 9,
  PLAYER_HEIGHT: 1.8,
  PLAYER_WIDTH: 0.6,
  MOUSE_SENSITIVITY: 0.002,
  REACH_DISTANCE: 6,
  BLOCK_SIZE: 1
}

// ==================== 全局游戏状态 ====================
const gameState = {
  scene: null,
  camera: null,
  renderer: null,
  world: null, // 3D 数组存放方块
  blockMeshes: null, // Map: key -> InstancedMesh
  player: {
    position: new THREE.Vector3(0, 20, 0),
    velocity: new THREE.Vector3(),
    onGround: false,
    yaw: 0,
    pitch: 0
  },
  keys: {},
  selectedSlot: 0,
  isPlaying: false,
  isPaused: false,
  pointerLocked: false,
  highlightWireframe: null,
  lastTime: 0,
  frameCount: 0,
  fpsUpdateTime: 0
}

// ==================== 工具函数 ====================
function worldKey(x, y, z) {
  return `${x},${y},${z}`
}

function getBlock(x, y, z) {
  const ix = Math.floor(x)
  const iy = Math.floor(y)
  const iz = Math.floor(z)
  const half = CONFIG.WORLD_SIZE
  if (
    ix < -half ||
    ix >= half ||
    iy < 0 ||
    iy >= CONFIG.WORLD_HEIGHT ||
    iz < -half ||
    iz >= half
  ) {
    return BlockType.AIR
  }
  return gameState.world.get(worldKey(ix, iy, iz)) || BlockType.AIR
}

function setBlock(x, y, z, type) {
  const ix = Math.floor(x)
  const iy = Math.floor(y)
  const iz = Math.floor(z)
  const key = worldKey(ix, iy, iz)
  if (type === BlockType.AIR) {
    gameState.world.delete(key)
  } else {
    gameState.world.set(key, type)
  }
}

// 简单的伪随机哈希（用于世界生成）
function hash(x, z) {
  let h = x * 374761393 + z * 668265263
  h = (h ^ (h >> 13)) * 1274126177
  return ((h ^ (h >> 16)) >>> 0) / 4294967295
}

// 平滑值
function smooth(t) {
  return t * t * (3 - 2 * t)
}

// 双线性插值噪声
function noise2D(x, z) {
  const xi = Math.floor(x)
  const zi = Math.floor(z)
  const xf = x - xi
  const zf = z - zi
  const a = hash(xi, zi)
  const b = hash(xi + 1, zi)
  const c = hash(xi, zi + 1)
  const d = hash(xi + 1, zi + 1)
  const u = smooth(xf)
  const v = smooth(zf)
  return (a * (1 - u) + b * u) * (1 - v) + (c * (1 - u) + d * u) * v
}

// 多层叠加噪声（fBm）
function fbm(x, z) {
  let value = 0
  let amplitude = 1
  let frequency = 1
  let maxValue = 0
  for (let i = 0; i < 4; i++) {
    value += noise2D(x * frequency, z * frequency) * amplitude
    maxValue += amplitude
    amplitude *= 0.5
    frequency *= 2
  }
  return value / maxValue
}

// ==================== 世界生成 ====================
function generateWorld() {
  gameState.world = new Map()
  const half = CONFIG.WORLD_SIZE
  const waterLevel = 6

  for (let x = -half; x < half; x++) {
    for (let z = -half; z < half; z++) {
      // 高度计算（使用 fBm 噪声）
      const height = Math.floor(5 + fbm(x * 0.08, z * 0.08) * 14)

      for (let y = 0; y <= height; y++) {
        let type
        if (y === height) {
          if (height <= waterLevel) {
            type = BlockType.SAND
          } else {
            type = BlockType.GRASS
          }
        } else if (y > height - 4) {
          type = BlockType.DIRT
        } else {
          type = BlockType.STONE
        }
        setBlock(x, y, z, type)
      }

      // 生成树木（在草地且高于水位的地方随机生成）
      if (height > waterLevel + 1 && hash(x + 1000, z + 1000) < 0.02) {
        generateTree(x, height + 1, z)
      }
    }
  }

  // 找一个合适的出生点（最高的方块上方）
  let spawnY = CONFIG.WORLD_HEIGHT - 2
  for (let y = CONFIG.WORLD_HEIGHT - 1; y >= 0; y--) {
    if (getBlock(0, y, 0) !== BlockType.AIR) {
      spawnY = y + 3
      break
    }
  }
  gameState.player.position.set(0.5, spawnY, 0.5)
}

function generateTree(x, y, z) {
  const trunkHeight = 4 + Math.floor(hash(x + 500, z + 500) * 2)

  // 树干
  for (let i = 0; i < trunkHeight; i++) {
    setBlock(x, y + i, z, BlockType.WOOD)
  }

  // 树叶（球状）
  const leafStart = y + trunkHeight - 1
  for (let dx = -2; dx <= 2; dx++) {
    for (let dz = -2; dz <= 2; dz++) {
      for (let dy = -1; dy <= 2; dy++) {
        const dist = Math.sqrt(dx * dx + dz * dz + dy * 0.8 * (dy * 0.8))
        if (dist < 2.5) {
          if (getBlock(x + dx, leafStart + dy, z + dz) === BlockType.AIR) {
            setBlock(x + dx, leafStart + dy, z + dz, BlockType.LEAVES)
          }
        }
      }
    }
  }
}

// ==================== 方块渲染 ====================
function createBlockMesh(type) {
  const colors = BLOCK_COLORS[type]
  const materials = [
    new THREE.MeshLambertMaterial({ color: colors.side }), // +x
    new THREE.MeshLambertMaterial({ color: colors.side }), // -x
    new THREE.MeshLambertMaterial({ color: colors.top }), // +y
    new THREE.MeshLambertMaterial({ color: colors.bottom }), // -y
    new THREE.MeshLambertMaterial({ color: colors.side }), // +z
    new THREE.MeshLambertMaterial({ color: colors.side }) // -z
  ]
  // 树叶半透明
  if (type === BlockType.LEAVES) {
    materials.forEach((m) => {
      m.transparent = true
      m.opacity = 0.92
    })
  }
  const geometry = new THREE.BoxGeometry(
    CONFIG.BLOCK_SIZE,
    CONFIG.BLOCK_SIZE,
    CONFIG.BLOCK_SIZE
  )
  return { geometry, materials }
}

function isBlockExposed(x, y, z) {
  return (
    getBlock(x + 1, y, z) === BlockType.AIR ||
    getBlock(x - 1, y, z) === BlockType.AIR ||
    getBlock(x, y + 1, z) === BlockType.AIR ||
    getBlock(x, y - 1, z) === BlockType.AIR ||
    getBlock(x, y, z + 1) === BlockType.AIR ||
    getBlock(x, y, z - 1) === BlockType.AIR
  )
}

function rebuildWorldMeshes() {
  // 清除旧网格
  if (gameState.blockMeshes) {
    gameState.blockMeshes.forEach((mesh) => {
      gameState.scene.remove(mesh)
      mesh.geometry.dispose()
      if (Array.isArray(mesh.material)) {
        mesh.material.forEach((m) => m.dispose())
      } else {
        mesh.material.dispose()
      }
    })
  }
  gameState.blockMeshes = []

  // 按类型收集方块位置
  const blockPositionsByType = new Map()

  for (const [key, type] of gameState.world) {
    const [x, y, z] = key.split(',').map(Number)
    if (!isBlockExposed(x, y, z)) continue // 剔除内部方块（面剔除优化）
    if (!blockPositionsByType.has(type)) {
      blockPositionsByType.set(type, [])
    }
    blockPositionsByType.get(type).push(new THREE.Vector3(x, y, z))
  }

  // 为每种类型创建 InstancedMesh
  const dummy = new THREE.Object3D()

  for (const [type, positions] of blockPositionsByType) {
    const { geometry, materials } = createBlockMesh(type)

    if (positions.length === 0) continue

    // 使用多材质 InstancedMesh（BoxGeometry 的每一面独立材质）
    const mesh = new THREE.InstancedMesh(geometry, materials, positions.length)
    mesh.castShadow = true
    mesh.receiveShadow = true

    positions.forEach((pos, i) => {
      dummy.position.set(pos.x + 0.5, pos.y + 0.5, pos.z + 0.5)
      dummy.updateMatrix()
      mesh.setMatrixAt(i, dummy.matrix)
    })

    mesh.instanceMatrix.needsUpdate = true
    gameState.scene.add(mesh)
    gameState.blockMeshes.push(mesh)
  }
}

// ==================== 碰撞检测 ====================
function checkCollision(px, py, pz) {
  const hw = CONFIG.PLAYER_WIDTH / 2
  const h = CONFIG.PLAYER_HEIGHT

  // 玩家包围盒 8 个角点 + 中间点检测
  const corners = [
    [px - hw, py, pz - hw],
    [px + hw, py, pz - hw],
    [px - hw, py, pz + hw],
    [px + hw, py, pz + hw],
    [px - hw, py + h, pz - hw],
    [px + hw, py + h, pz - hw],
    [px - hw, py + h, pz + hw],
    [px + hw, py + h, pz + hw],
    // 膝盖位置（防止卡在方块上）
    [px, py + h * 0.5, pz]
  ]

  for (const [cx, cy, cz] of corners) {
    if (getBlock(cx, cy, cz) !== BlockType.AIR) {
      return true
    }
  }
  return false
}

// ==================== 玩家移动与物理 ====================
function updatePlayer(dt) {
  const player = gameState.player

  // --- 输入 -> 水平方向 ---
  let moveX = 0
  let moveZ = 0
  if (gameState.keys['KeyW']) moveZ -= 1
  if (gameState.keys['KeyS']) moveZ += 1
  if (gameState.keys['KeyA']) moveX -= 1
  if (gameState.keys['KeyD']) moveX += 1

  // 根据 yaw 旋转方向
  const yaw = player.yaw
  const cosY = Math.cos(yaw)
  const sinY = Math.sin(yaw)
  const dx = moveX * cosY + moveZ * sinY
  const dz = -moveX * sinY + moveZ * cosY

  // 归一化
  const len = Math.sqrt(dx * dx + dz * dz)
  let speed =
    gameState.keys['ShiftLeft'] || gameState.keys['ShiftRight']
      ? CONFIG.RUN_SPEED
      : CONFIG.WALK_SPEED

  let moveDirX = 0,
    moveDirZ = 0
  if (len > 0) {
    moveDirX = (dx / len) * speed
    moveDirZ = (dz / len) * speed
  }

  // --- 重力 & 跳跃 ---
  player.velocity.y -= CONFIG.GRAVITY * dt
  if (gameState.keys['Space'] && player.onGround) {
    player.velocity.y = CONFIG.JUMP_SPEED
    player.onGround = false
  }

  // --- 分轴移动 + 碰撞（避免穿墙）---
  // X 轴
  let newX = player.position.x + moveDirX * dt
  if (!checkCollision(newX, player.position.y, player.position.z)) {
    player.position.x = newX
  }

  // Z 轴
  let newZ = player.position.z + moveDirZ * dt
  if (!checkCollision(player.position.x, player.position.y, newZ)) {
    player.position.z = newZ
  }

  // Y 轴
  let newY = player.position.y + player.velocity.y * dt
  if (player.velocity.y <= 0) {
    // 下落：检查脚下碰撞
    if (checkCollision(player.position.x, newY, player.position.z)) {
      // 落到方块上
      player.position.y = Math.ceil(newY)
      player.velocity.y = 0
      player.onGround = true
    } else {
      player.position.y = newY
      player.onGround = false
    }
  } else {
    // 上升：检查头撞
    if (
      checkCollision(
        player.position.x,
        newY + CONFIG.PLAYER_HEIGHT,
        player.position.z
      )
    ) {
      player.velocity.y = 0
    } else {
      player.position.y = newY
    }
    player.onGround = false
  }

  // 世界边界（防掉落）
  if (player.position.y < -20) {
    player.position.set(0.5, CONFIG.WORLD_HEIGHT, 0.5)
    player.velocity.set(0, 0, 0)
  }

  // --- 更新相机 ---
  gameState.camera.position.set(
    player.position.x,
    player.position.y + CONFIG.PLAYER_HEIGHT * 0.9,
    player.position.z
  )
  updateCameraRotation()
}

function updateCameraRotation() {
  const player = gameState.player
  const pitch = THREE.MathUtils.clamp(
    player.pitch,
    -Math.PI / 2 + 0.01,
    Math.PI / 2 - 0.01
  )

  // 构建旋转四元数
  const qPitch = new THREE.Quaternion().setFromAxisAngle(
    new THREE.Vector3(1, 0, 0),
    pitch
  )
  const qYaw = new THREE.Quaternion().setFromAxisAngle(
    new THREE.Vector3(0, 1, 0),
    player.yaw
  )
  gameState.camera.quaternion.copy(qYaw).multiply(qPitch)
}

// ==================== 方块交互（射线检测）====================
function raycastBlock() {
  const raycaster = new THREE.Raycaster()
  raycaster.setFromCamera(new THREE.Vector2(0, 0), gameState.camera)
  raycaster.far = CONFIG.REACH_DISTANCE

  if (!gameState.blockMeshes || gameState.blockMeshes.length === 0) {
    return null
  }

  const hits = raycaster.intersectObjects(gameState.blockMeshes, true)
  if (hits.length === 0) return null

  const hit = hits[0]
  const hitPoint = hit.point.clone()

  // 获取方块中心坐标
  const worldPos = new THREE.Vector3()
  const matrix = new THREE.Matrix4()
  hit.object.getMatrixAt(hit.instanceId, matrix)
  worldPos.setFromMatrixPosition(matrix)

  const bx = Math.floor(worldPos.x)
  const by = Math.floor(worldPos.y)
  const bz = Math.floor(worldPos.z)

  // 计算相邻方块坐标（根据法线）
  const normal = hit.face.normal.clone()
  // 将法线转换到世界空间
  normal.transformDirection(hit.object.matrixWorld).normalize()
  normal.round()

  const nx = bx + Math.round(normal.x)
  const ny = by + Math.round(normal.y)
  const nz = bz + Math.round(normal.z)

  return {
    block: { x: bx, y: by, z: bz },
    adjacent: { x: nx, y: ny, z: nz },
    hitPoint
  }
}

function updateBlockHighlight() {
  const result = raycastBlock()
  if (result) {
    gameState.highlightWireframe.visible = true
    gameState.highlightWireframe.position.set(
      result.block.x + 0.5,
      result.block.y + 0.5,
      result.block.z + 0.5
    )
  } else {
    gameState.highlightWireframe.visible = false
  }
  return result
}

function breakBlock() {
  const result = raycastBlock()
  if (!result) return
  const { x, y, z } = result.block

  // 检查方块内是否有玩家（防止破坏脚下方块后卡住？不，MC 允许）
  setBlock(x, y, z, BlockType.AIR)
  rebuildWorldMeshes()
}

function placeBlock() {
  const result = raycastBlock()
  if (!result) return
  const { x, y, z } = result.adjacent

  // 检查放置位置是否会卡住玩家
  const player = gameState.player
  const hw = CONFIG.PLAYER_WIDTH / 2
  const minX = player.position.x - hw
  const maxX = player.position.x + hw
  const minY = player.position.y
  const maxY = player.position.y + CONFIG.PLAYER_HEIGHT
  const minZ = player.position.z - hw
  const maxZ = player.position.z + hw

  // 方块包围盒: [x, x+1] x [y, y+1] x [z, z+1]
  if (
    x + 1 > minX &&
    x < maxX &&
    y + 1 > minY &&
    y < maxY &&
    z + 1 > minZ &&
    z < maxZ
  ) {
    return // 与玩家重叠，不放置
  }

  if (getBlock(x, y, z) !== BlockType.AIR) return

  const blockType = HOTBAR_BLOCKS[gameState.selectedSlot]
  setBlock(x, y, z, blockType)
  rebuildWorldMeshes()
}

// ==================== 初始化场景 ====================
function initScene() {
  const container = document.getElementById('game-container')

  // Scene
  gameState.scene = new THREE.Scene()
  gameState.scene.background = new THREE.Color(0x87ceeb)
  gameState.scene.fog = new THREE.Fog(0x87ceeb, 30, 80)

  // Camera
  gameState.camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    500
  )

  // Renderer
  gameState.renderer = new THREE.WebGLRenderer({ antialias: true })
  gameState.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  gameState.renderer.setSize(window.innerWidth, window.innerHeight)
  gameState.renderer.shadowMap.enabled = true
  gameState.renderer.shadowMap.type = THREE.PCFSoftShadowMap
  container.appendChild(gameState.renderer.domElement)

  // --- 光照 ---
  // 环境光（基础照明）
  const ambient = new THREE.AmbientLight(0xffffff, 0.55)
  gameState.scene.add(ambient)

  // 半球光（天空蓝 + 地面绿渐变）
  const hemi = new THREE.HemisphereLight(0x87ceeb, 0x5a7a3a, 0.4)
  gameState.scene.add(hemi)

  // 方向光（太阳光）带阴影
  const sun = new THREE.DirectionalLight(0xffffff, 1.0)
  sun.position.set(30, 50, 20)
  sun.castShadow = true
  sun.shadow.mapSize.width = 2048
  sun.shadow.mapSize.height = 2048
  sun.shadow.camera.near = 0.5
  sun.shadow.camera.far = 150
  const half = CONFIG.WORLD_SIZE
  sun.shadow.camera.left = -half
  sun.shadow.camera.right = half
  sun.shadow.camera.top = half
  sun.shadow.camera.bottom = -half
  sun.shadow.bias = -0.0005
  gameState.scene.add(sun)
  gameState.sunLight = sun

  // --- 方块高亮线框 ---
  const highlightGeo = new THREE.BoxGeometry(
    CONFIG.BLOCK_SIZE + 0.02,
    CONFIG.BLOCK_SIZE + 0.02,
    CONFIG.BLOCK_SIZE + 0.02
  )
  const highlightEdges = new THREE.EdgesGeometry(highlightGeo)
  const highlightMat = new THREE.LineBasicMaterial({
    color: 0x000000,
    linewidth: 2,
    transparent: true,
    opacity: 0.8
  })
  gameState.highlightWireframe = new THREE.LineSegments(
    highlightEdges,
    highlightMat
  )
  gameState.highlightWireframe.visible = false
  gameState.scene.add(gameState.highlightWireframe)

  // 窗口大小变化
  window.addEventListener('resize', onWindowResize)
}

function onWindowResize() {
  gameState.camera.aspect = window.innerWidth / window.innerHeight
  gameState.camera.updateProjectionMatrix()
  gameState.renderer.setSize(window.innerWidth, window.innerHeight)
}

// ==================== 输入处理 ====================
function initInput() {
  // 键盘
  window.addEventListener('keydown', (e) => {
    gameState.keys[e.code] = true

    // 物品栏切换
    if (e.code.startsWith('Digit')) {
      const num = parseInt(e.code.slice(5)) - 1
      if (num >= 0 && num < HOTBAR_BLOCKS.length) {
        selectSlot(num)
      }
    }

    // ESC
    if (e.code === 'Escape' && gameState.isPlaying && !gameState.isPaused) {
      pauseGame()
    }
  })

  window.addEventListener('keyup', (e) => {
    gameState.keys[e.code] = false
  })

  // 鼠标
  document.addEventListener('mousemove', (e) => {
    if (!gameState.pointerLocked) return
    gameState.player.yaw -= e.movementX * CONFIG.MOUSE_SENSITIVITY
    gameState.player.pitch -= e.movementY * CONFIG.MOUSE_SENSITIVITY
  })

  // 鼠标滚轮切物品栏
  document.addEventListener(
    'wheel',
    (e) => {
      if (!gameState.isPlaying || gameState.isPaused) return
      if (e.deltaY > 0) {
        selectSlot((gameState.selectedSlot + 1) % HOTBAR_BLOCKS.length)
      } else {
        selectSlot(
          (gameState.selectedSlot - 1 + HOTBAR_BLOCKS.length) %
            HOTBAR_BLOCKS.length
        )
      }
    },
    { passive: true }
  )

  // 鼠标点击（破坏/放置）
  document.addEventListener('mousedown', (e) => {
    if (!gameState.isPlaying || gameState.isPaused) return
    if (!gameState.pointerLocked) return

    if (e.button === 0) {
      breakBlock()
    } else if (e.button === 2) {
      placeBlock()
    }
  })

  // 禁止右键菜单
  document.addEventListener('contextmenu', (e) => e.preventDefault())

  // PointerLock 变化
  document.addEventListener('pointerlockchange', () => {
    gameState.pointerLocked =
      document.pointerLockElement === gameState.renderer.domElement

    const clickToPlay = document.getElementById('click-to-play')
    if (
      gameState.isPlaying &&
      !gameState.isPaused &&
      !gameState.pointerLocked
    ) {
      clickToPlay.classList.remove('hidden')
    } else {
      clickToPlay.classList.add('hidden')
    }
  })

  // 点击锁定提示 -> 请求锁定
  document.getElementById('click-to-play').addEventListener('click', () => {
    requestPointerLock()
  })
}

function requestPointerLock() {
  gameState.renderer.domElement.requestPointerLock()
}

// ==================== UI 逻辑 ====================
function selectSlot(index) {
  gameState.selectedSlot = index
  document.querySelectorAll('.hotbar-slot').forEach((el, i) => {
    el.classList.toggle('active', i === index)
  })
}

function updateHUD(dt) {
  // FPS 计算
  gameState.frameCount++
  gameState.fpsUpdateTime += dt
  if (gameState.fpsUpdateTime >= 0.5) {
    const fps = Math.round(gameState.frameCount / gameState.fpsUpdateTime)
    document.getElementById('fps-counter').textContent = `FPS: ${fps}`
    gameState.frameCount = 0
    gameState.fpsUpdateTime = 0
  }

  // 位置
  const p = gameState.player.position
  document.getElementById('pos-info').textContent =
    `位置: ${p.x.toFixed(1)}, ${p.y.toFixed(1)}, ${p.z.toFixed(1)}`
}

// ==================== 游戏流程控制 ====================
function startGame() {
  gameState.isPlaying = true
  gameState.isPaused = false

  // 重置玩家
  generateWorld()
  rebuildWorldMeshes()
  gameState.player.velocity.set(0, 0, 0)
  gameState.player.yaw = 0
  gameState.player.pitch = 0

  // UI 切换
  document.getElementById('main-menu').classList.add('hidden')
  document.getElementById('pause-menu').classList.add('hidden')
  document.getElementById('hud').classList.remove('hidden')
  document.getElementById('crosshair').classList.remove('hidden')

  // 自动请求指针锁定
  requestPointerLock()
}

function pauseGame() {
  if (!gameState.isPlaying) return
  gameState.isPaused = true
  document.exitPointerLock?.()
  document.getElementById('pause-menu').classList.remove('hidden')
}

function resumeGame() {
  gameState.isPaused = false
  document.getElementById('pause-menu').classList.add('hidden')
  requestPointerLock()
}

function backToMenu() {
  gameState.isPlaying = false
  gameState.isPaused = false
  document.exitPointerLock?.()
  document.getElementById('main-menu').classList.remove('hidden')
  document.getElementById('pause-menu').classList.add('hidden')
  document.getElementById('hud').classList.add('hidden')
  document.getElementById('crosshair').classList.add('hidden')
  document.getElementById('click-to-play').classList.add('hidden')
}

function initUI() {
  document.getElementById('start-btn').addEventListener('click', startGame)
  document.getElementById('exit-btn').addEventListener('click', () => {
    if (window.electronAPI) {
      window.electronAPI.exit()
    } else {
      window.close()
    }
  })
  document.getElementById('resume-btn').addEventListener('click', resumeGame)
  document.getElementById('menu-btn').addEventListener('click', backToMenu)
}

// ==================== 主循环 ====================
function animate(time) {
  requestAnimationFrame(animate)

  if (gameState.lastTime === 0) gameState.lastTime = time
  const dt = Math.min((time - gameState.lastTime) / 1000, 0.05) // 限制最大 dt，防止卡顿时穿墙
  gameState.lastTime = time

  if (gameState.isPlaying && !gameState.isPaused) {
    updatePlayer(dt)
    updateBlockHighlight()
    updateHUD(dt)
  }

  gameState.renderer.render(gameState.scene, gameState.camera)
}

// ==================== 启动 ====================
function init() {
  initScene()
  initInput()
  initUI()
  // 预生成一个世界（让背景不是空的）
  generateWorld()
  rebuildWorldMeshes()
  animate(0)
}

// 启动
init()
