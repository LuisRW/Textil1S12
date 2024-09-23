const express = require('express');
const cors = require('cors');
const apiRouter = require('./routes/api');
const { logErrors, errorHandler, boomErrorHandler, ormErrorHandler } = require('./middlewares/error.handler');

const app = new express();
const port = 3000;

app.use(express.json());

app.use(cors());

require('./utils/auth');

app.get('/', (req, res) => {
    res.send('hello cadima!!!');
});

apiRouter(app);

app.use(logErrors);
app.use(ormErrorHandler);
app.use(boomErrorHandler);
app.use(errorHandler);

app.listen(port, () => {
    console.log('run!!');
});