import mongoose, { Document } from 'mongoose';


interface Users extends Document {
    username: string,
    password: string,
    authtoken: string,
    cookies: string | boolean,
}

const UsersSchema = new mongoose.Schema({
    username: { type: String, required: true },
    password: { type: String, required: true },
    authtoken: { type: String, require: true },
    cookies: { type: mongoose.Schema.Types.Mixed, require: true}
});

export default mongoose.models.User || mongoose.model<Users>('User', UsersSchema);
