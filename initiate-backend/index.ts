import { app } from './src/index';

const port = parseInt(process.env.PORT ?? '3031');

app.listen(port, () => {
    console.log(`============> Initiate Server is running on port ${port}`);
});