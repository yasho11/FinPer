import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import User from '../models/user.model';
import { getAvatarByGender } from '../utils/avatar';
import { generateToken, verifyToken } from '../utils/token';

//?-------------------------------------------------------------------------------
//! Name: register
//! Desc: Registers a new user and sets auth token in cookie
//?-------------------------------------------------------------------------------

export const register = async (req: Request, res: Response): Promise<any> => {
  const { email, username, password, gender } = req.body;

  try {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ msg: 'Email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const avatar = getAvatarByGender(gender);

    const user = await User.create({
      email,
      username,
      password: hashedPassword,
      gender,
      avatar,
    });

    const token = generateToken(user.id);

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return res.status(201).json({ msg: 'User registered successfully', user });
  } catch (err) {
    return res.status(500).json({ msg: 'Registration failed', error: err });
  }
};

//?-------------------------------------------------------------------------------
//! Name: login
//! Desc: Logs in user and sets token in cookie
//?-------------------------------------------------------------------------------

export const login = async (req: Request, res: Response): Promise<any> => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    const token = generateToken(user.id);

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({ msg: 'Login successful', user });
  } catch (err) {
    return res.status(500).json({ msg: 'Login failed', error: err });
  }
};

//?-------------------------------------------------------------------------------
//! Name: authUser
//! Desc: Authenticates user using cookie token
//?-------------------------------------------------------------------------------

export const authUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const user = await User.findByPk(userId);

    if (!user) {
     res.status(404).json({ msg: 'User not found' });
      return ;
    }

    res.json({ user });
     return ;
  } catch (err) {
     res.status(401).json({ msg: 'Invalid or expired token', error: err });
      return;
    }
};

//?-----------------------------------------------------------------------------------------------
//! name: UpdateUser
//! description: Updates user profile data
//?-----------------------------------------------------------------------------------------------

export const UpdateUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id
    const user = await User.findByPk(userId);
    if (!user) {
      res.status(404).json({ msg: 'User not found' });
      return;
    }

    const { username, avatar, gender, password } = req.body;

    // Track if gender changed
    const genderChanged = gender && gender !== user.gender;

    if (username) user.username = username;
    if (genderChanged) user.gender = gender;

    // Only update avatar based on gender if:
    // - gender changed
    // - AND no custom avatar was submitted
    if (genderChanged && !avatar) {
      user.avatar = getAvatarByGender(gender);
    } else if (avatar) {
      user.avatar = avatar;
    }

    if (password) {
      const hashed = await bcrypt.hash(password, 10);
      user.password = hashed;
    }

    await user.save();

    res.status(200).json({ msg: 'User updated successfully', user });
  } catch (err) {
    res.status(500).json({ msg: 'Update failed', error: err });
  }
};
