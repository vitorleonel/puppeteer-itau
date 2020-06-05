const BeanstalkdClient = require("beanstalkd");

module.exports = {
  send: async (payload) => {
    const beanstalkd = new BeanstalkdClient.default(
      process.env.BEANSTALKD_HOST,
      process.env.BEANSTALKD_PORT
    );

    const client = await beanstalkd.connect();

    await client.use(process.env.BEANSTALKD_QUEUE);
    await client.put(0, 0, 1, JSON.stringify(payload));
    await client.quit();
  },
};
