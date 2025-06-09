import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database";
import { defaultMaxListeners } from "events";

export interface IUser extends Model {
    id: number;
    email: string;
    username: string;
    password: string;
    gender: 'male' | 'female' | 'other';
    avatar: string;
}

const User = sequelize.define<IUser>('User', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    email: {
        type: DataTypes.STRING,
        unique:true,
        allowNull: false,
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    gender: {
        type: DataTypes.ENUM('male', 'female', 'other'),
        allowNull: false,
    },
    avatar: {
        type: DataTypes.STRING,
        allowNull: false,

    },
});

export default User;
