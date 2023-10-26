import axios from 'axios';
import { requestError } from '@/errors';
import qs from "query-string";
import dotenv from "dotenv";

dotenv.config();


async function get(url: string) {
  try {
    const result = await axios.get(url);
    return result;
  } catch (error) {
    const { status, statusText } = error.response;
    throw requestError(status, statusText);
  }
}

type GitHubParamsForAccesToken = {
  code: string;
  grant_type: string;
  redirect_uri: string;
  client_id: string;
  client_secret: string;  
}

async function AccesCodeRequest(code: string){
  try {
    //const GITHUB_ACESS_TOKEN_URL = "https://github.com/login/oauth/access_token";
    const params: GitHubParamsForAccesToken = {
      code,
      grant_type: process.env.GRANT_TYPE,
      redirect_uri: process.env.REDIRECT_URI,
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
    }
    const {data} = await axios.post(process.env.GITHUB_ACESS_TOKEN_URL, params,{headers:{'Content-Type':'application/json'}});
    const {access_token} = qs.parse(data);
    return Array.isArray(access_token) ? access_token.join("") : access_token;
  } catch (error) {
    const { status, statusText } = error.response;
    throw requestError(status, statusText);
  }
}

async function fetchUser(token:string): Promise<githubUserResume>{
  try{

    const response = await axios.get(process.env.GITHUB_USER_URL,{headers:{Authorization:`Bearer ${token}`}});
    const {login,id,node_id,name,email} = response.data;
    return {login,id,node_id,name,email};
  } catch (error) {
    const { status, statusText } = error.response;
    throw requestError(status, statusText);
  }
}

export const request = {
  get,
  AccesCodeRequest,
  fetchUser
};

type GithubUserInformation = {
  login: String;
  id: number;
  node_id: String;
  avatar_url: String;
  gravatar_id: String;
  url: String;
  html_url: String;
  followers_url: String;
  following_url: String;
  gists_url: String;
  starred_url: String;
  subscriptions_url: String;
  organizations_url: String;
  repos_url: String;
  events_url: String;
  received_events_url: String;
  type: String;
  site_admin: Boolean;
  name: String;
  company: String;
  blog: String;
  location: String;
  email: String;
  hireable: String;
  bio: String;
  twitter_username: String;
  public_repos: number;
  public_gists: number;
  followers:number;
  following: number;
  created_at: String;
  updated_at: String;
  private_gists:number;
  total_private_repos:number;
  owned_private_repos:number;
  disk_usage: number;
  collaborators: number;
  two_factor_authentication: Boolean;
  plan: {
    name: String;
    space: number;
    collaborators: number;
    private_repos: number;
  }
};
export type githubUserResume = {
  login: String;
  id: number;
  node_id: String;
  name: String;
  email: String;
};