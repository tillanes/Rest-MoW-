const express = require('express')
const router = express.Router()
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

router.get('/', async (req, res) => {
    try {
        const boards = await prisma.boards.findMany({
            orderBy: { id: 'asc' }
        })
        res.send(boards)
    } catch (err) {
        console.error(err)
        res.status(500).send({ error: 'Failed to fetch boards' })
    }
})

router.get('/:id', async (req, res) => {
    const { id } = req.params

    try {
        const board = await prisma.boards.findUnique({
            where: { id: Number(id) }
        })

        if (!board) {
            return res.status(404).send({ error: 'Board not found' })
        }

        res.send(board)
    } catch (err) {
        console.error(err)
        res.status(500).send({ error: 'Failed to fetch board' })
    }
})

router.post('/', async (req, res) => {
    const { name, allowed_users } = req.body

    if (!name || !Array.isArray(allowed_users)) {
        return res.status(400).send({ error: 'name and allowed_users (array) are required' })
    }

    try {
        const created = await prisma.boards.create({
            data: { name, allowed_users }
        })
        res.status(201).send(created)
    } catch (err) {
        console.error(err)
        res.status(500).send({ error: 'Failed to create board' })
    }
})

router.put('/:id', async (req, res) => {
    const { id } = req.params
    const { name, allowed_users } = req.body

    if (!name || !Array.isArray(allowed_users)) {
        return res.status(400).send({ error: 'name and allowed_users (array) are required' })
    }

    try {
        const updated = await prisma.boards.update({
            where: { id: Number(id) },
            data: { name, allowed_users }
        })
        res.send(updated)
    } catch (err) {
        if (err.code === 'P2025') {
            return res.status(404).send({ error: 'Board not found' })
        }
        console.error(err)
        res.status(500).send({ error: 'Failed to update board' })
    }
})

router.patch('/:id', async (req, res) => {
    const { id } = req.params
    const { name, allowed_users } = req.body

    const data = {}
    if (name !== undefined) data.name = name
    if (allowed_users !== undefined) data.allowed_users = allowed_users

    if (Object.keys(data).length === 0) {
        return res.status(400).send({ error: 'At least one of name or allowed_users is required' })
    }

    try {
        const updated = await prisma.boards.update({
            where: { id: Number(id) },
            data
        })
        res.send(updated)
    } catch (err) {
        if (err.code === 'P2025') {
            return res.status(404).send({ error: 'Board not found' })
        }
        console.error(err)
        res.status(500).send({ error: 'Failed to update board' })
    }
})

router.delete('/:id', async (req, res) => {
    const { id } = req.params

    try {
        await prisma.boards.delete({
            where: { id: Number(id) }
        })
        res.status(204).send()
    } catch (err) {
        if (err.code === 'P2025') {
            return res.status(404).send({ error: 'Board not found' })
        }
        console.error(err)
        res.status(500).send({ error: 'Failed to delete board' })
    }
})

module.exports = router
