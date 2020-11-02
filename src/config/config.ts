interface Config {
  jwtSecret: string;
  assetPath: string;
}

const config: Config = {
  jwtSecret: 'this-is-a-jwt-secret',
  assetPath: 'http://localhost:3000',
};

export default config;
