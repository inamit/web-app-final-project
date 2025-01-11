import config from "../config.json";
import { HttpClientFactory } from "./httpClient";

export class AuthenticationService {
  httpClientFactory: HttpClientFactory;

  constructor() {
    this.httpClientFactory = new HttpClientFactory();
  }

  signUp(username: string, email: string, password: string) {
    return this.httpClientFactory
      .unauthorizedHttpClient()
      .post(config.signupUrl, {
        username,
        email,
        password,
      });
  }

  google(credentials: string) {
    return this.httpClientFactory
      .unauthorizedHttpClient()
      .post(config.googleAccountUrl, {
        jwtToken: credentials,
      });
  }
}