module.exports = {
  devServer: {
    host: '127.0.0.1',
    // mock server
    proxy: 'http://127.0.0.1:3000'
  }
}
