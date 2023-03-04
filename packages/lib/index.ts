import { service } from './axios';
import { GitBubUserUrl, GitBubAccessTokenUrl, ClientId, ClientSecret } from './const'

interface GetGitHubUserInfo {
  login: string,
  id: number,
  avatar_url: string;
}

export const getGitHubUserInfo = (token: string) => {
  // if (!token || typeof token !== 'string') {
  //   throw new Error(`expect string but got ${typeof token}`)
  // }
  return service<GetGitHubUserInfo>({
    url: GitBubUserUrl,
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}

export const getAccessToken = (code: string) => {
  return service({
    url: GitBubAccessTokenUrl,
    method: 'POST',
    data: {
      code,
      client_id: ClientId,
      client_secret: ClientSecret,
    },
  })
}