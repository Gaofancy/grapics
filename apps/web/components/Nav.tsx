import { Navbar, Button, Text, User } from "@nextui-org/react";
import { GitHubIcon } from './Icon'

type NavRes = {
  id?: number;
  login: string;
  avatarUrl: string;
  status: number;
}

const doLogin = () => {
  const url = 'https://github.com/login/oauth/authorize?client_id=52679fe0af1963ad9f91'
  window.location.href = url
}

const LoginButton = () => {
  return (
    <Button icon={<GitHubIcon fill="currentColor" />} auto color="gradient" onPress={() => doLogin()}>
      Login with GitHub
    </Button>
  )
}

const AvatarInfo = (login: string, avatarUrl: string) => {
  return (
    <User src={avatarUrl} name={login} />
  )
}

const Nav = ({ login, avatarUrl, status }: NavRes) => {
  return (
    <>
      <Navbar variant="static">
        <Navbar.Brand>
          <Text b color="inherit" hideIn="xs">
            Graphics Interview
          </Text>
        </Navbar.Brand>

        <Navbar.Content>
          <Navbar.Item>
            {status === 200 ? AvatarInfo(login, avatarUrl) : LoginButton()}
          </Navbar.Item>
        </Navbar.Content>
      </Navbar>
    </>
  )
}

export default Nav