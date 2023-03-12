module.exports = {
  servers: {
    one: {
      // TODO: set host address, username, and authentication method
      host: '134.209.214.201',
      username: 'root',
      // pem: './path/to/pem'
      password: 'XLvf3nFg',
      // or neither for authenticate from ssh-agent
    },
  },

  app: {
    // TODO: change app name and path
    name: 'club-social-dev',
    path: '../',

    servers: {
      one: {},
    },

    buildOptions: {
      serverOnly: true,
    },

    env: {
      // TODO: Change to your app's url
      // If you are using ssl, it needs to start with https://
      ROOT_URL: 'http://134.209.214.201',
      MONGO_URL:
        'mongodb+srv://club-social:7VgeWZXgvxCaRFIR@clubsocial.85jui5s.mongodb.net/club-social-dev?retryWrites=true&w=majority',
      // MONGO_OPLOG_URL: 'mongodb://mongodb/local',
    },

    docker: {
      image: 'zodern/meteor:root',
    },

    // Show progress bar while uploading bundle to server
    // You might need to disable it on CI servers
    enableUploadProgressBar: true,
  },

  // mongo: {
  //   version: '5.0.14',
  //   servers: {
  //     one: {},
  //   },
  // },

  // (Optional)
  // Use the proxy to setup ssl or to route requests to the correct
  // app when there are several apps

  // proxy: {
  //   domains: 'mywebsite.com,www.mywebsite.com',

  //   ssl: {
  //     // Enable Let's Encrypt
  //     letsEncryptEmail: 'email@domain.com'
  //   }
  // }
};
