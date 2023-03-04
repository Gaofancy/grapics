// import React, { useRef, useState, useMemo, useLayoutEffect } from 'react'
// import { Canvas, useFrame, ThreeElements } from '@react-three/fiber'
// import {DoubleSide, Vector3} from 'three'
// import { Text3D } from '@react-three/drei'
// import fontJSON from "three/examples/fonts/helvetiker_bold.typeface.json";

// const Graph = ({ login }: any) => {
//   return (
//     <>
//       <Canvas style={{height: '80vh'}}>
//         123
//       </Canvas>
//     </>
//   )
// }

// export default Graph


import * as React from 'react'
import { Vector3 } from 'three'
import { withKnobs } from '@storybook/addon-knobs'
import { Canvas, useFrame, ThreeElements } from '@react-three/fiber'
import fontJSON from "three/examples/fonts/helvetiker_bold.typeface.json";
import { Text, Text3D, Float, Center } from '@react-three/drei'
import { Setup } from './Setup'


// export default {
//   title: 'Abstractions/Text3D',
//   component: Text,
//   decorators: [withKnobs, (storyFn: () => any) => <Setup cameraPosition={new Vector3(0, 0, 5)}>{storyFn()}</Setup>],
// }

function Text3DScene({ login }: any) {
  return (
    <React.Suspense fallback={null}>
      <Center>
        <Float floatIntensity={5} speed={2}>
          <Text3D font={fontJSON as any} bevelEnabled bevelSize={0.05}>
            {login || 'Text 3D'}
            <meshNormalMaterial />
          </Text3D>
        </Float>
      </Center>
    </React.Suspense>
  )
}

export const Text3DSt = ({ login }: any) => (
  <Canvas style={{ height: '80vh' }}>
    <Text3DScene login={login} />
  </Canvas>
)
Text3DSt.storyName = 'Default'
