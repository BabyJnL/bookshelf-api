const { nanoid } = require('nanoid');
const { books } = require('./books.js');

const apiResponse = (responseToolkit, payload, statusCode = 200) => responseToolkit.response(payload).code(statusCode);

class Book {
    // Static method for register a new book
    static add (req, h) {
        // Destructuring request payload
        const { name, pageCount, readPage } = req.payload;

        if (!name) 
            return apiResponse(h, {status: 'fail', message: 'Gagal menambahkan buku. Mohon isi nama buku'}, 400);

        if (readPage > pageCount) 
            return apiResponse(h, {status: 'fail', message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount'}, 400);

        const book = {};
        book.id = nanoid(16);
        book.finished = (readPage === pageCount);
        book.insertedAt = book.updatedAt = new Date().toISOString();

        for (let key in req.payload) {
            book[key] = req.payload[key];
        }

        books.push(book);
        return apiResponse(h, {status: 'success', message: 'Buku berhasil ditambahkan', data: {bookId: book.id}}, 201);
    }

    // Static method for get all of books
    static getAll (_, h) {
        const returnedBooks = [];

        if (books.length > 0) {
            books.forEach(book => {
                returnedBooks.push({id: book.id, name: book.name, publisher: book.publisher});
            });
        }

        return apiResponse(h, {status: 'success', data: {books: returnedBooks}});
    }
}

module.exports = Book;