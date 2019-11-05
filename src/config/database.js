module.exports = {
  dialect: 'postgres',
  host: 'localhost',
  port: '5555',
  username: 'docker',
  password: 'docker',
  database: 'gobarber',
  define: {
    timestamps: true,
    underscored: true,
    underscoredAll: true,
  },
};
