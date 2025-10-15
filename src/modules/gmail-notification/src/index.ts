import { startServer } from './app.js';
startServer().catch((e) => {
    console.error(e);
    process.exit(1);
});
