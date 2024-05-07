const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });
//console.log(process.env);
const app = require('./app');

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
