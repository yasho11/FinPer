//DB Connection:
import { Sequelize } from "sequelize";
import dotenv from 'dotenv';

dotenv.config();

const sequelize = new Sequelize(
    'prefin',
     'postgres',
     'postgres',
    {
        host: 'db',
        dialect: 'postgres',
        port: Number(process.env.DB_PORT),
        logging: false,

    }
);


export default sequelize;
