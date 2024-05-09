const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });

const app = require('./app');

if (process.env.NODE_ENV === 'development') {
  console.log(process.env);
  console.log(app.get('env'));
}

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
