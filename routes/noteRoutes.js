import express from "express";
import NoteModel from "../models/noteModel.js";

const router = express.Router();

router.post("/", async (req, res) => {

    try {
        const { title, content, category, published } = req.body;

        const note = await NoteModel.create({
            title,
            content,
            category,
            published,
        });
        res.status(201).json({
            status: "success",
            data: {
                note,
            },
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message,
        });
    }
});

router.get("/", async (req, res) => {
    try {
        const page = req.query.page || 1;
        const limit = req.query.limit || 10;
        const skip = (page - 1) * limit;

        const notes = await NoteModel.findAll({ limit, offset: skip });

        res.status(200).json({
            status: "success",
            results: notes.length,
            notes,
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message,
        });
    }
});

router.patch("/:noteId", async (req, res) => {
    try {
        const result = await NoteModel.update(
            { ...req.body, updatedAt: Date.now() },
            {
                where: {
                    id: req.params.noteId,
                },
            }
        );

        if (result[0] === 0) {
            return res.status(404).json({
                status: "fail",
                message: "Note with that ID not found",
            });
        }

        const note = await NoteModel.findByPk(req.params.noteId);

        res.status(200).json({
            status: "success",
            data: {
                note,
            },
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message,
        });
    }
});

router.get("/:noteId", async (req, res) => {
    try {
        const note = await NoteModel.findByPk(req.params.noteId);

        if (!note) {
            return res.status(404).json({
                status: "fail",
                message: "Note with that ID not found",
            });
        }

        res.status(200).json({
            status: "success",
            data: {
                note,
            },
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message,
        });
    }
});

router.delete("/:noteId", async (req, res) => {
    try {
        const result = await NoteModel.destroy({
            where: { id: req.params.noteId },
            force: true,
        });

        if (result === 0) {
            return res.status(404).json({
                status: "fail",
                message: "Note with that ID not found",
            });
        }

        res.status(204).json();
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message,
        });
    }
});


export default router;