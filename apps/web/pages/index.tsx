import { NextPageContext } from 'next'
import Cookies from 'cookies'
import { getGitHubUserInfo, getAccessToken } from '@graphics/lib'
import { createTheme, NextUIProvider, Grid, Card, Input, useInput, Button, Text, Spacer } from "@nextui-org/react"
import Layout from '../components/Layout'
import { Text3DSt } from '../components/Graph/index'
import { useEffect, useCallback, useRef } from 'react'

interface Props {
  login: string;
  avatarUrl: string;
  status: number;
}
type Record = {
  varName: string;
  value: any;
}

const Web = ({ login, avatarUrl, status }: Props) => {
  const darkTheme = createTheme({
    type: 'dark',
    theme: {
      colors: {},
    }
  })

  const defaultScale = '1'
  const defaultPR = '0'
  const defaultColor = '#9750dd'

  const scale = useInput(defaultScale)
  // 位移
  const positionX = useInput(defaultPR)
  const positionY = useInput(defaultPR)
  const positionZ = useInput(defaultPR)
  // 选转
  const rotateX = useInput(defaultPR)
  const rotateY = useInput(defaultPR)
  const rotateZ = useInput(defaultPR)

  const colors = useInput(defaultColor)
  // 回退&前进
  const undo = useRef<Record[]>([])
  const redo = useRef<Record[]>([])

  const reset = () => {
    scale.setValue(defaultScale);
    ['X', 'Y', 'Z'].forEach((k: string) => {
      ['position', 'rotate'].forEach((name: string) => eval(`${name}${k}`).reset())
    })
  }

  const isFirstStep = (varName: string) => {
    return !undo.current.filter((item: Record) => item.varName === varName)?.length
  }

  const record = (varName: string, value: any) => {
    if (isFirstStep(varName)) {
      let rValue = defaultScale;
      if (varName === 'colors') {
        rValue = defaultColor
      } else {
        rValue = defaultPR
      }
      undo.current.push({
        varName,
        value: rValue,
      })
    }

    undo.current.push({
      varName,
      value,
    })
  }

  const recordHistory = (e: React.ChangeEvent<HTMLInputElement>, varName: string) => {
    const { value } = e.target
    record(varName, value)
  }

  const renderInput = () => {
    return ['Position', 'Rotate'].map((name: string) => {
      return (
        <>
          <Spacer y={2} />
          <Text h5>{name}</Text>
          {
            ['X', 'Y', 'Z'].map((k: string) => {
              const nameStr = `${name.toLowerCase()}${k}`
              const variable = eval(nameStr);
              return (
                <>
                  <Input bordered labelRight={k} type="number" placeholder={k} {...variable} onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    variable.bindings.onChange(e)
                    recordHistory(e, nameStr)
                  }} />
                  <Spacer y={0.5} />
                </>
              )
            })
          }
        </>
      )
    })
  }

  const onKeydown = useCallback((event: KeyboardEvent) => {
    const { key, ctrlKey, metaKey } = event;
    if (ctrlKey || metaKey) {
      const undoLength = undo.current.length
      if (key === 'z') {
        if (undoLength) {
          const item = undo.current.pop();

          if (item) {
            // 执行回退
            eval(item.varName).setValue(item.value)

            // 记录前进脚步
            redo.current.push(item)
          }
        } else {
          reset()
        }

      }
      if (key === 'y' && redo.current.length) {
        const item = redo.current.pop();

        if (item) {
          // 执行前进
          eval(item?.varName).setValue(item.value)

          // 记录回退
          undo.current.push(item)
        }
      }
    }
  }, [])

  useEffect(() => {
    window.addEventListener('keydown', onKeydown)
    return () => {
      window.removeEventListener('keydown', onKeydown)
    }
  }, [])

  useEffect(() => {
    record('colors', colors.value)
  }, [colors.value])

  return (
    <NextUIProvider theme={darkTheme}>
      <Layout login={login} avatarUrl={avatarUrl} status={status}>
        <Grid.Container gap={2} justify="center">
          <Grid xs={9}>
            <Text3DSt
              login={login}
              color={colors.value}
              setPositionX={positionX.setValue}
              record={record}
              scale={+scale.value}
              position={[+positionX.value, +positionY.value, +positionZ.value]}
              rotation={[+rotateX.value, +rotateY.value, +rotateZ.value]} />
          </Grid>
          <Grid xs={3}>
            <Card>
              <Card.Body>
                <Text h3>Prefab</Text>
                <Input type={'color'} label="Color" {...colors} onChange={colors.bindings.onChange} />
                <Spacer y={2} />
                <Text h5>Scale</Text>
                <Input bordered type="number" placeholder="Scale" {...scale} onChange={(e: any) => {
                  scale.bindings.onChange(e)
                  recordHistory(e, 'scale')
                }} />
                {renderInput()}
              </Card.Body>
              <Card.Body>
                <Button color="secondary" auto onPress={() => reset()}>Reset</Button>
              </Card.Body>
            </Card>
          </Grid>
        </Grid.Container>
      </Layout>
    </NextUIProvider>

  );
}

Web.getInitialProps = async ({ req, res, query }: NextPageContext) => {
  const getGitHubUser = async (token: string) => {
    try {
      const info = await getGitHubUserInfo(token)

      const { login, id, avatar_url: avatarUrl } = info?.data || {};
      return {
        login,
        avatarUrl,
        status: 200,
      };
    } catch (error) {
      console.error(error)
      return {
        status: 500,
      }
    }
  }

  let cookies: any;
  if (req && res) {
    cookies = new Cookies(req, res)
  }

  const token = cookies?.get('atoken');
  if (token) {
    return await getGitHubUser(token)
  }

  const { code } = query;

  if (typeof code === 'string') {
    try {
      const accRes = await getAccessToken(code)
      const { access_token } = accRes?.data
      cookies?.set('atoken', access_token, {
        expires: new Date(Date.now() + 1000 * 3600 * 24),
      })

      return await getGitHubUser(access_token)
    } catch (error) {
      return {
        status: 500,
      }
    }
  }

  return {
    status: 500,
  }
}

export default Web