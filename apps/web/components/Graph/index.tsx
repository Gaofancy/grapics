import React, { useState } from 'react'
import { Canvas, Vector3, Euler, ThreeEvent } from '@react-three/fiber'
import fontJSON from "three/examples/fonts/helvetiker_bold.typeface.json";
import { Text3D, Center } from '@react-three/drei'

interface IText3D {
  login: string;
  scale: number;
  position: Vector3 | any;
  rotation: Euler;
  color: string;
  record: (name: string, value: any) => void;
  setPositionX: (x: string) => void;
}

export const Text3DSt = ({ login, scale, position, rotation, color, record, setPositionX }: IText3D) => {
  const rate = 120;
  const [enabled, setEnabled] = useState<boolean>(false)
  const [x, setX] = useState<number>(0)
  const [d, setD] = useState<number>(0)
  const onPointerMove = (e: ThreeEvent<PointerEvent>) => {
    if (!enabled) return
    const formatX = `${((e.pageX + d - x) / rate).toFixed(2)}`
    setPositionX(formatX)
  }

  const onMouseDown = (e: React.MouseEvent<HTMLElement>) => {
    setEnabled(true)
    setX(e.pageX)
    setD(position[0] * rate)
  }

  return (
    <Canvas style={{ height: '88vh' }} onMouseDown={(e: React.MouseEvent<HTMLElement>) => onMouseDown(e)} onMouseUp={() => {setEnabled(false); record('positionX', position[0])}}>
      <ambientLight intensity={0.3} />
      <mesh onPointerMove={(e: ThreeEvent<PointerEvent>) => onPointerMove(e)}>
        <color attach="background" args={['#000']} />
        <React.Suspense fallback={null}>
          <Center position={position}>
            <directionalLight position={[0, 2, 2]} />
            <Text3D
              font={fontJSON as any}
              bevelEnabled
              bevelSize={0.05}
              rotation={rotation}
              scale={[scale, scale, scale]}>
              {login || 'Text 3D'}
              <meshStandardMaterial color={color} />
            </Text3D>
          </Center>
        </React.Suspense>
      </mesh>
    </Canvas>
  )
}

