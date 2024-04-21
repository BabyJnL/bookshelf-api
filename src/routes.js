// Import handler
const Book = require('./handler.js');

const routes = [
    {
        method: 'POST',
        path: '/books',
        handler: Book.add
    },
    {
        method: 'GET',
        path: '/books',
        handler: Book.getAll
    },
    {
        method: 'GET',
        path: '/books/{bookId}',
        handler: Book.getById
    },
    {
        method: 'PUT',
        path: '/books/{bookId}',
        handler: Book.update
    },
    {
        method: 'DELETE',
        path: '/books/{bookId}',
        handler: Book.remove
    }
]

module.exports = routes;