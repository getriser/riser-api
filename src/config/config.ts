interface Config {
  jwtSecret: string;
}

const config: Config = {
  jwtSecret: 'this-is-a-jwt-secret',
};

export default config;
