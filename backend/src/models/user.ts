import {InferSchemaType, Schema, model} from "mongoose";

const userSchema = new Schema(
  {
    username: {type: String, required: true, unique: true},
    email: {type: String, required: true, unique: true, select: false},
    password: {type: String, required: true, select: false},
});

//extra step for typescript (create a type / alias for the note)
type User = InferSchemaType<typeof userSchema>;

export default model<User>("User", userSchema);