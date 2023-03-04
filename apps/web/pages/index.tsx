import Cookies from 'cookies'
import { NextPageContext } from 'next'
import { getGitHubUserInfo, getAccessToken } from '@graphics/lib'
import Layout from '../components/Layout'
import { Text3DSt } from '../components/Graph/index'
import { createTheme, NextUIProvider } from "@nextui-org/react"

interface Props {
  login: string;
  avatarUrl: string;
  status: number;
}

const Web = ({ login, avatarUrl, status }: Props) => {
  const darkTheme = createTheme({
    type: 'dark',
    theme: {
      colors: {},
    }
  })

  return (
    <NextUIProvider theme={darkTheme}>
      <Layout login={login} avatarUrl={avatarUrl} status={status}>
        <Text3DSt login={login} />
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