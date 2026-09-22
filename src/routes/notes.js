const express = require('express')
const router = express.Router()
const pool = require('../db')

router.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM notes ORDER BY id')
        res.send(result.rows)
    } catch (err) {
        console.error(err)
        res.status(500).send({ error: 'Failed to fetch notes' })
    }
})

router.post('/', async (req, res) => {
    const { author_id, note, board } = req.body

    if (!author_id || !note || !board) {
        return res.status(400).send({ error: 'author_id, note and board are required' })
    }

    try {
        const result = await pool.query(
            'INSERT INTO notes (author_id, note, board) VALUES ($1, $2, $3) RETURNING *',
            [author_id, note, board]
        )
        res.status(201).send(result.rows[0])
    } catch (err) {
        console.error(err)
        res.status(500).send({ error: 'Failed to create note' })
    }
})

router.put('/:id', async (req, res) => {
    const { id } = req.params
    const { author_id, note, board } = req.body

    if (!author_id || !note || !board) {
        return res.status(400).send({ error: 'author_id, note and board are required' })
    }

    try {
        const result = await pool.query(
            'UPDATE notes SET author_id = $1, note = $2, board = $3, updated_at = now() WHERE id = $4 RETURNING *',
            [author_id, note, board, id]
        )

        if (result.rows.length === 0) {
            return res.status(404).send({ error: 'Note not found' })
        }

        res.send(result.rows[0])
    } catch (err) {
        console.error(err)
        res.status(500).send({ error: 'Failed to update note' })
    }
})

module.exports = router
