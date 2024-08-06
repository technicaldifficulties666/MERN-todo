import {InferSchemaType, Schema, model} from "mongoose";

const noteSchema = new Schema(
  {
    userId: {type: Schema.Types.ObjectId,  required: true},
    title: {type: String, required: true},
    text: {type: String},
  },
  {timestamps: true}
);

//extra step for typescript (create a type / alias for the note)
type Note = InferSchemaType<typeof noteSchema>;

export default model<Note>("Note", noteSchema);
