const express = require('express')
const router = express.Router()
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

router.get('/', async (req, res) => {
    try {
        const notes = await prisma.notes.findMany({
            orderBy: { id: 'asc' }
        })
        res.send(notes)
    } catch (err) {
        console.error(err)
        res.status(500).send({ error: 'Failed to fetch notes' })
    }
})

router.get('/:id', async (req, res) => {
    const { id } = req.params

    try {
        const note = await prisma.notes.findUnique({
            where: { id: Number(id) }
        })

        if (!note) {
            return res.status(404).send({ error: 'Note not found' })
        }

        res.send(note)
    } catch (err) {
        console.error(err)
        res.status(500).send({ error: 'Failed to fetch note' })
    }
})

router.post('/', async (req, res) => {
    const { author_id, note, board_id } = req.body

    if (!author_id || !note || !board_id) {
        return res.status(400).send({ error: 'author_id, note and board_id are required' })
    }

    try {
        const created = await prisma.notes.create({
            data: { author_id, note, board_id }
        })
        res.status(201).send(created)
    } catch (err) {
        console.error(err)
        res.status(500).send({ error: 'Failed to create note' })
    }
})

router.put('/:id', async (req, res) => {
    const { id } = req.params
    const { author_id, note, board_id } = req.body

    if (!author_id || !note || !board_id) {
        return res.status(400).send({ error: 'author_id, note and board_id are required' })
    }

    try {
        const updated = await prisma.notes.update({
            where: { id: Number(id) },
            data: { author_id, note, board_id, updated_at: new Date() }
        })
        res.send(updated)
    } catch (err) {
        if (err.code === 'P2025') {
            return res.status(404).send({ error: 'Note not found' })
        }
        console.error(err)
        res.status(500).send({ error: 'Failed to update note' })
    }
})

router.patch('/:id', async (req, res) => {
    const { id } = req.params
    const { author_id, note, board_id } = req.body

    const data = {}
    if (author_id !== undefined) data.author_id = author_id
    if (note !== undefined) data.note = note
    if (board_id !== undefined) data.board_id = board_id

    if (Object.keys(data).length === 0) {
        return res.status(400).send({ error: 'At least one of author_id, note or board_id is required' })
    }

    data.updated_at = new Date()

    try {
        const updated = await prisma.notes.update({
            where: { id: Number(id) },
            data
        })
        res.send(updated)
    } catch (err) {
        if (err.code === 'P2025') {
            return res.status(404).send({ error: 'Note not found' })
        }
        console.error(err)
        res.status(500).send({ error: 'Failed to update note' })
    }
})

router.delete('/:id', async (req, res) => {
    const { id } = req.params

    try {
        await prisma.notes.delete({
            where: { id: Number(id) }
        })
        res.status(204).send()
    } catch (err) {
        if (err.code === 'P2025') {
            return res.status(404).send({ error: 'Note not found' })
        }
        console.error(err)
        res.status(500).send({ error: 'Failed to delete note' })
    }
})

module.exports = router
