import { app } from './src/index';

const port = parseInt(process.env.PORT ?? '80');

app.listen(port, () => {
    console.log(`============> Initiate Server is running on port ${port}`);
});