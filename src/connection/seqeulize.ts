import { Sequelize } from 'sequelize';

const sequelize = new Sequelize('tests', 'root', 'Elvino12_', {
    host: 'localhost',
    dialect: 'mysql',
});

async function testDatabaseConnection() {
    try {
        await sequelize.authenticate();
        console.log('Connection to the database has been established successfully.');
    } catch (err) {
        console.error('Unable to connect to the database:', err);
    }
}

async function runMigrations() {
    try {
        const User = sequelize.define('User', {
        });
        const userTableExists = await User.sync({ force: false }).then(() => true).catch(() => false);
        if (!userTableExists) {
            await sequelize.sync();
            console.log('Migrasi berhasil.');
        } else {
            console.log('Tabel pengguna sudah ada, tidak perlu migrasi.');
        }
    } catch (error) {
        console.error('Gagal menjalankan migrasi:', error);
    }
}

runMigrations();

export { sequelize, testDatabaseConnection };
