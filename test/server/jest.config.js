const config = {
  verbose: true,
  globals: {
    api: {
      services: {
        prefix: "http://localhost:9000/services/"
      }
    }
  }
};

module.exports = async () => {
  return config;
};

