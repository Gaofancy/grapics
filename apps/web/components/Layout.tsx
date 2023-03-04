import { useSSR, Container } from '@nextui-org/react';
import Header from './Head'
import Nav from './Nav';
import 'ui/global.css'


interface LayoutProps {
  children: React.ReactNode;
  login: string;
  avatarUrl: string;
  status: number;
}

const Layout = ({ children, login, avatarUrl, status }: LayoutProps) => {
  const { isBrowser } = useSSR()
  return isBrowser ? (
    <>
      <Header />
      <Nav login={login} avatarUrl={avatarUrl} status={status} />
      <Container css={{ height: 'calc(100vh - 76px)' }}>
        <main>{children}</main>
      </Container>
    </>
  ) : <></>
}

export default Layout