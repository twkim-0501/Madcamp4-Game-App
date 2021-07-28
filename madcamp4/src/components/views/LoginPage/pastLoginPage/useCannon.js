import * as THREE from 'three'
import React, { useState, useEffect, useContext, useRef } from 'react'
import { useFrame } from 'react-three-fiber'

let count = 0
let buffers = React.createRef()

// Cannon-world context provider
const context = React.createContext()
export function Physics({ children, number }) {
  const [worker] = useState(() => new Worker('/worker.js'))

  useEffect(() => {
    let positions = new Float32Array(number * 3)
    let quaternions = new Float32Array(number * 4)

    function loop() {
      worker.postMessage({ op: 'step', positions: positions, quaternions: quaternions }, [positions.buffer, quaternions.buffer])
    }

    worker.onmessage = e => {
      positions = e.data.positions
      quaternions = e.data.quaternions
      buffers.current = { positions, quaternions }
      requestAnimationFrame(loop)
    }

    loop()
    return () => worker.terminate()
  }, [])

  return <context.Provider value={worker} children={children} />
}

// Custom hook to maintain a world physics body
export function useCannon({ ...props }, fn, deps = []) {
  const ref = useRef()
  const worker = useContext(context)
  const [id] = useState(() => count++)

  useEffect(() => {
    worker.postMessage({ op: 'addBody', id, ...props })
    return () => worker.postMessage({ op: 'removeBody', id })
  }, deps)

  useFrame(() => {
    // Transport cannon physics into the referenced threejs object
    if (buffers.current && buffers.current.positions.length) {
      ref.current.position.fromArray(buffers.current.positions, id * 3)
      ref.current.quaternion.fromArray(buffers.current.quaternions, id * 4)
    }
  })
  return [ref, worker, id]
}

// Custom hook to maintain instanced world physics bodies
const _object = new THREE.Object3D()
export function useCannonInstanced(props, fn, deps = []) {
  const ref = useRef()
  const worker = useContext(context)
  const ids = useRef([])
  useEffect(() => {
    if (ref.current && ref.current.count) {
      ref.current.instanceMatrix.setUsage(35048)
      ids.current = []
      for (let i = 0; i < ref.current.count; i++) ids.current.push(count++)
      worker.postMessage({ op: 'addBodies', ids: ids.current, ...props })
    }
    return () => worker.postMessage({ op: 'removeBodies', ids: ids.current })
  }, deps)

  useFrame(() => {
    for (let i = 0; i < ref.current.count; i++) {
      const id = ids.current[i]

      if (buffers.current && buffers.current.positions.length) {
        _object.position.fromArray(buffers.current.positions, id * 3)
        _object.quaternion.fromArray(buffers.current.quaternions, id * 4)
        _object.updateMatrix()
        ref.current.setMatrixAt(i, _object.matrix)
      }
    }
    ref.current.instanceMatrix.needsUpdate = true
  })

  return [ref, worker, ids]
}
