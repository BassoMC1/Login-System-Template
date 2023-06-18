import { Router, Request, Response } from 'express';
import Userschema from "../../../schema/user"

export default class User {
    public router: any;

    constructor() {
        this.router = Router();
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get('/', this.data);
    }

    private data = async (req: Request, res: Response) => {
        const user = await Userschema.findOne({ cookies: req.cookies.sessionToken });
        if (!user) {
            return res.status(400).send({ message: 'Unauthorized' });
        } 
        return res.status(200).send({ User: {username: user.username} });
    }

    public build() {
        return this.router;
    }
}