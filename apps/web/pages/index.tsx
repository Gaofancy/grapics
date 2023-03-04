import React, { useRef, useState } from 'react'
import { Button, Container } from '@nextui-org/react';
import * as THREE from 'three'
import { Canvas, useFrame, ThreeElements } from '@react-three/fiber'
import axios from 'axios'
import { NextPageContext } from 'next';
import Cookies from 'cookies'
import 'ui/global.css'

function Box(props: ThreeElements['mesh']) {
  const ref = useRef<THREE.Mesh>(null!)
  const [hovered, hover] = useState(false)
  const [clicked, click] = useState(false)
  useFrame((state, delta) => (ref.current.rotation.x += delta))
  return (
    <mesh
      {...props}
      ref={ref}
      scale={clicked ? 1.5 : 1}
      onClick={(event) => click(!clicked)}
      onPointerOver={(event) => hover(true)}
      onPointerOut={(event) => hover(false)}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={hovered ? 'hotpink' : 'orange'} />
    </mesh>
  )
}

function doLogin() {
  const url = 'https://github.com/login/oauth/authorize?client_id=52679fe0af1963ad9f91'
  window.location.href = url
}

function Web(props: any) {
  const { name, id, avatar_url } = props;

  return (
    <Container css={{ height: '100vh' }}>
      <Button onPress={() => doLogin()}>主界面</Button>
      <div>{name}{id}</div>
      <img src={avatar_url} />
      <Canvas>
        <ambientLight />
        <pointLight position={[10, 10, 10]} />
        <Box position={[-1.2, 0, 0]} />
        <Box position={[1.2, 0, 0]} />
      </Canvas>
    </Container>
  );
}

Web.getInitialProps = async ({ req, res, query }: NextPageContext) => {
  const cookies = new Cookies(req, res)

  if (cookies.get('atoken')) {
    const info = await axios({
      url: 'https://api.github.com/user',
      method: 'GET',
      headers: {
        Authorization: `Bearer ${cookies.get('atoken')}`,
      },
    })

    return {
      name: info.data.login,
      id: info.data.id,
      avatar_url: info.data.avatar_url
    };
  }

  const { code } = query

  if (!code) {
    return {
      info: 'no code'
    }
  }
  const data = {
    code,
    client_id: '52679fe0af1963ad9f91',
    client_secret: '87459e19bf23e5fc870f63de49fbf56a9c67e690',
  }

  try {
    const res = await axios({
      url: 'https://github.com/login/oauth/access_token',
      method: 'POST',
      headers: {
        Accept: 'application/json',
      },
      data,
    })

    const { access_token } = res.data
    cookies.set('atoken', access_token, {
      maxAge: 24 * 60 * 60 * 1000,
    })

    const info = await axios({
      url: 'https://api.github.com/user',
      method: 'GET',
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    })

    return {
      name: info.data.login,
      id: info.data.id,
      avatar_url: info.data.avatar_url
    }
  } catch (error) {
    console.error(error);
  }

  return {
    name: '500'
  }
}

export default Web