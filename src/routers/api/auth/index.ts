import { Router, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';

import User from "../../../schema/user"

export default class Auth {
  public router: any;

  constructor() {
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post('/login', this.login);
    this.router.post('/register', this.register);
    this.router.post('/logout', this.logout);
  }

  private login = async (req: Request, res: Response) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).send({ message: 'Unauthorized' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(400).send({ message: 'Unauthorized' });
    }

    if(user.cookies) {
      this.setCookie(res, user.cookies)
    } else {
      const sessionToken = uuidv4()
      this.setCookie(res, sessionToken);
      user.cookies = sessionToken;
      await user.save();
    }

    return res.status(200).send({ message: "Login successfully", User: {username: user.username} });
  }

  private register = async (req: Request, res: Response)  => {
    const { username, password } = req.body;
    try {
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        return res.status(400).send({ message: 'Username is already taken' });
      }

      let authtoken: string;
      let isTokenUnique = false;

      do {
        authtoken = uuidv4();
        const userWithToken = await User.findOne({ authtoken });
        isTokenUnique = !userWithToken;
      } while (!isTokenUnique);

      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new User({ username, password: hashedPassword, authtoken});
      await newUser.save();
      res.status(200).send({ message: 'User registered successfully' });

    }catch (error) {
      console.error(error);
      res.status(500).send({ message: 'Internal Server Error' });
    }
  }

  private logout = async (req: Request, res: Response)  => {
    const user = await User.findOne({ cookies: req.cookies.sessionToken });
    if(!user) {
      return res.status(400).send({ message: 'Unauthorized' });
    } 
    user.cookies = false;
    await user.save();
    res.clearCookie('sessionToken', {
      httpOnly: true,
      secure: true
    });
    res.status(200).send({ message: 'Logout successfully' });
  }

  private setCookie(res: Response, cookieValue: string) {
    res.cookie('sessionToken', cookieValue, {
      maxAge: 7 * 24 * 60 * 60 * 1000, // Set an appropriate expiration time for the cookie
      httpOnly: true, // Make the cookie accessible only through HTTP requests
      secure: true // Set this to true if you're using HTTPS
    });
  }

  public build() {
    return this.router;
  }
}
