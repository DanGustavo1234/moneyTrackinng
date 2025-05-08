import express from 'express';
import {PORT} from './config.js';
import router from './routes/index.js';

const app= express();
app.set('views','./src/views');
app.set('view engine','ejs');

app.use(express.json());
app.use(router);

app.listen(PORT,()=>{
    console.log(`Server is running on ${PORT}`);
})




