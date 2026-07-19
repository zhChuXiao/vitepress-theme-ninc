
<template>
  <div>
    <canvas id="webgl-canvas" class=""></canvas>
  </div>
</template>

<script setup>
import * as THREE from 'three'
class Stage {
  constructor() {
    this.renderParam = {
      width: window.innerWidth,
      height: window.innerHeight
    }

    this.cameraParam = {
      fov: 80,
      lookAt: new THREE.Vector3(0, 0, 0)
    }

    this.fogParam = {
      color: 0x000000,
      start: 50,
      end: 2000
    }

    this.scene = null
    this.camera = null
    this.renderer = null
    this.geometry = null
    this.material = null
    this.mesh = null
    this.isInitialized = false
  }

  init() {
    this._setScene()
    this._setRender()
    this._setCamera()
    this._setFog()

    this.isInitialized = true
  }

  _setScene() {
    this.scene = new THREE.Scene()
  }

  _setRender() {
    this.renderer = new THREE.WebGLRenderer({
      canvas: document.getElementById('webgl-canvas'),
      alpha: true
    })
    this.renderer.setPixelRatio(window.devicePixelRatio)
    this.renderer.setSize(this.renderParam.width, this.renderParam.height)
  }

  _setCamera() {
    const windowWidth = window.innerWidth
    const windowHeight = window.innerHeight

    if (!this.isInitialized) {
      this.camera = new THREE.PerspectiveCamera(this.cameraParam.fov, this.renderParam.width / this.renderParam.height)

      this.camera.lookAt(this.cameraParam.lookAt)
    }

    this.camera.aspect = windowWidth / windowHeight
    this.camera.updateProjectionMatrix()
    this.renderer.setPixelRatio(window.devicePixelRatio)
    this.renderer.setSize(windowWidth, windowHeight)
  }

  _setFog() {
    this.scene.fog = new THREE.Fog(this.fogParam.fov, this.fogParam.start, this.fogParam.end)
  }

  _render() {
    let rot = 0
    const radian = (rot * Math.PI) / 180

    rot += 0.1
    this.camera.position.x = 1000 * Math.sin(radian)
    this.camera.position.z = 1000 * Math.cos(radian)
    this.renderer.render(this.scene, this.camera)
  }

  onResize() {
    this._setCamera()
  }

  onRaf() {
    this._render()
  }
}

class Mesh {
  constructor(stage) {
    this.stage = stage
    this.mesh = null
  }

  init() {
    this._setMesh()
  }
  createCircleTexture() {
    const canvas = document.createElement('canvas')
    const size = 64 // 纹理大小
    canvas.width = size
    canvas.height = size

    const context = canvas.getContext('2d')
    const centerX = size / 2
    const centerY = size / 2
    const radius = size / 2 - 2 // 稍微小一点，留出边缘

    // 清空画布
    context.clearRect(0, 0, size, size)

    // 绘制圆形
    context.beginPath()
    context.arc(centerX, centerY, radius, 0, 2 * Math.PI, false)
    context.closePath()

    // 填充圆形
    context.fillStyle = '#dfac46' 
    context.fill()

    // 创建纹理
    const texture = new THREE.Texture(canvas)
    texture.needsUpdate = true
    return texture
  }
  _setMesh() {
    const vertices = []
    const SIZE = 3000
    const LENGTH = 3000
    const geometry = new THREE.BufferGeometry()
    const material = new THREE.PointsMaterial({
      color: 0xdfac46,
      size: 3,
      blending: THREE.AdditiveBlending,
      map: this.createCircleTexture(),
      transparent: true,
      alphaTest: 0.1
    })

    for (let i = 0; i < LENGTH; i++) {
      const x = SIZE * (Math.random() - 0.5)
      const y = SIZE * (Math.random() - 0.5)
      const z = SIZE * (Math.random() - 0.5)

      vertices.push(x, y, z)
    }

    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3))

    this.mesh = new THREE.Points(geometry, material)
    this.stage.scene.add(this.mesh)
  }

  _render() {
    this.mesh.rotation.y += 0.001
  }

  onRaf() {
    this._render()
  }
}

onMounted(() => {
  const stage = new Stage()
  const mesh = new Mesh(stage)

  stage.init()
  mesh.init()

  window.addEventListener('resize', () => {
    stage.onResize()
  })

  const _raf = () => {
    window.requestAnimationFrame(() => {
      stage.onRaf()
      mesh.onRaf()

      _raf()
    })
  }

  _raf()
})
</script>


<style lang="scss" scoped>
#webgl-canvas {
  position: fixed;
  pointer-events: none;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
}
</style>
