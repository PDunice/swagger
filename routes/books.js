const express = require('express')
const router = express.Router()
const { nanoid } = require('nanoid')

const idLength = 8;

/**
 * @swagger
 * components:
 *  schemas:
 *      Book:
 *          type: object
 *          required:
 *              - title
 *              - author
 *          properties:
 *              id:
 *                  type: string
 *                  description: the auto-generated book id
 *              title:
 *                  type: string
 *                  description: the book title
 *              author:
 *                  type: string
 *                  description: the book author
 *          example:
 *              id: zxcvbnmk
 *              title: a happy book
 *              author: a happy author
 */

/**
 * @swagger
 * tags:
 *  name: Books
 *  description: books tag api grouping
 */


/**
 * @swagger
 * /books:
 *  get:
 *      summary: Returns list of all books
 *      tags: [Books]
 *      responses:
 *          200:
 *              description: the list of all books
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#/components/schemas/Book'
 * 
 */
router.get('/', (req, res) => {
    const books = req.app.db.get('books')
    res.send(books)
});

/**
 * @swagger
 * /books/{id}:
 *  get:
 *      summary: Returns book by id
 *      tags: [Books]
 *      parameters:
 *          - in: path
 *            name: id
 *            schema:             
 *              type: string
 *            description: The book id
 *      responses:
 *          200:
 *              description: the book description by id
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#/components/schemas/Book'
 *          404:
 *              description: The book was not found
 */
router.get('/:id', (req, res) => {
    const book = req.app.db.get('books').find({ id: req.params.id }).value()
    if (!book)
        return res.status(404).send('id inválida')
    res.send(book)
});

/**
 * @swagger
 * /books:
 *  post:
 *      summary: Create a new book
 *      tags: [Books]
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/Book'
 *      responses:
 *          200:
 *              description: The book was successfully added
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Book'
 *          500:
 *              description: Some server error      
 */
router.post('/', (req, res) => {
    try {

        const book = {
            id: nanoid(idLength),
            ...req.body,
        };

        req.app.db.get('books').push(book).write();

        res.send(book);
    } catch (error) {
        return res.status(500).send(error);
    }
});

/**
 * @swagger
 * /books/{id}:
 *  put:
 *      summary: edit a book
 *      tags: [Books]
 *      parameters:
 *          - in: path
 *            name: id
 *            schema:             
 *              type: string
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/Book'
 *      responses:
 *          200:
 *              description: The book was successfully edited
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Book'
 *          404:
 *              description: book not found
 *          500:
 *              description: Some server error      
 */

router.put('/:id', (req, res) => {
    const book = req.app.db.get('books').find({ id: req.params.id }).value()
    if (book) {
        try {
            req.app.db.get('books').find({ id: req.params.id }).assign(req.body).write()
            res.status(200).send('Editou id')
        }
        catch (error) {
            return res.status(500).send(error)
        }
    }
    else { return res.status(404).send('id not found') }
});

/**
 * @swagger
 * /books/{id}:
 *  delete:
 *      summary: delete a book
 *      tags: [Books]
 *      parameters:
 *          - in: path
 *            name: id
 *            schema:             
 *              type: string
 *            description: The book id
 *      responses:
 *          200:
 *              description: The book was successfully deleted
 *          500:
 *              description: Some server error
 *          404:
 *              description: id não encontrada
 */


router.delete('/:id', (req, res) => {
    const book = req.app.db.get('books').find({ id: req.params.id }).value()
    if (book) {
        try {
            req.app.db.get('books').remove({ id: req.params.id }).write()

            res.status(200).send('Removed')
        }
        catch (error) {
            res.status(500).send(error)
        }
    }
    else
        res.status(404).send('id not found')
});


module.exports = router;