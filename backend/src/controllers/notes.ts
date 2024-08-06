import {RequestHandler} from "express";
import NoteModel from "../models/note";
import createHttpError from "http-errors";
import mongoose, {ObjectId} from "mongoose";
import {assertIsDefined} from "../util/assertIsDefined";

export const getNotes: RequestHandler = async (req, res, next) => {
  const authenticatedUserId = req.session.userId;
  try {
    assertIsDefined(authenticatedUserId);
    const notes = await NoteModel.find({userId: authenticatedUserId}).exec();
    res.status(200).json(notes);
  } catch (error) {
    next(error);
  }
};

export const getNote: RequestHandler = async (req, res, next) => {
  const noteId = req.params.noteId;
  const authenticatedUserId = req.session.userId;
  try {
    assertIsDefined(authenticatedUserId);

    if (!mongoose.isValidObjectId(noteId)) {
      throw createHttpError(400, "Invalid note ID");
    }
    const note = await NoteModel.findById(noteId).exec();
    if (!note) {
      throw createHttpError(404, "Note not found");
    }

    if (!note.userId.equals(authenticatedUserId)) {
      throw createHttpError(401, "You cannot access this note");
    }
    res.status(200).json(note);
  } catch (error) {
    next(error);
  }
};

interface CreateNoteBody {
  title?: string; //? here as well! because we can't know the contents of these values while the end point is being called
  text?: string; //? means optional
}

export const createNote: RequestHandler<
  unknown,
  unknown,
  CreateNoteBody,
  unknown
> = async (req, res, next) => {
  const title = req.body.title;
  const text = req.body.text;
  const authenticatedUserId = req.session.userId;
  try {
    assertIsDefined(authenticatedUserId);
    if (!title) {
      throw createHttpError(400, "Note must have a title!");
    }
    const newNote = await NoteModel.create({
      userId: authenticatedUserId,
      title: title,
      text: text,
    });

    res.status(201).json(newNote);
  } catch (error) {
    next(error);
  }
};

interface updateNoteParams {
  noteId: string;
}

interface updateNoteBody {
  title?: string;
  text?: string;
}

//in request handlers, either we declare no types or define all of them (all or nothing)
export const updateNote: RequestHandler<
  updateNoteParams,
  unknown,
  updateNoteBody,
  unknown
> = async (req, res, next) => {
  const noteId = req.params.noteId;
  const newTitle = req.body.title;
  const newText = req.body.text;
  const authenticatedUserId = req.session.userId;

  try {
    assertIsDefined(authenticatedUserId);
    if (!mongoose.isValidObjectId(noteId)) {
      throw createHttpError(400, "Invalid note ID");
    }
    if (!newTitle) {
      throw createHttpError(400, "Note must have a title to be updated!");
    }
    const noteToBeUpdated = await NoteModel.findById(noteId).exec();
    if (!noteToBeUpdated) {
      throw createHttpError(404, "Note to be updated not found");
    }
    if (!noteToBeUpdated.userId.equals(authenticatedUserId)) {
      throw createHttpError(401, "You cannot access this note");
    }
    noteToBeUpdated.title = newTitle;
    noteToBeUpdated.text = newText;

    const updatedNote = await noteToBeUpdated.save();
    res.status(200).json(updatedNote);
  } catch (error) {
    next(error);
  }
};

export const deleteNote: RequestHandler = async (req, res, next) => {
  const noteId = req.params.noteId;
  const authenticatedUserId = req.session.userId;

  try {
    assertIsDefined(authenticatedUserId);
    if (!mongoose.isValidObjectId(noteId)) {
      throw createHttpError(400, "Invalid note ID");
    }
    const noteToBeDeleted = await NoteModel.findById(noteId).exec();

    if (!noteToBeDeleted) {
      throw createHttpError(404, "Note to be deleted not found");
    }

    if (!noteToBeDeleted.userId.equals(authenticatedUserId)) {
      throw createHttpError(401, "You cannot access this note");
    }

    await NoteModel.deleteOne({_id: noteId});
    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
};
