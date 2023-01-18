const express = require('express')
const cors = require('cors')
const {db} = require('./config')
const mainRouter = require('./mainRouter')
const expressFileUpload = require('express-fileupload');


db.sync()
    .then(() => console.log('DB connected'))
    .catch(console.log);
require('./models')

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(expressFileUpload({
    uploadTimeout:0,
}));

app.use('/api', mainRouter) // Main router

app.listen(3000, () => {
    console.log(`Server is running on port ${3000}.`);
});