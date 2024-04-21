const { nanoid } = require('nanoid');
const { books } = require('./books.js');

const apiResponse = (responseToolkit, payload, statusCode = 200) => responseToolkit.response(payload).code(statusCode);
const getIndexById = (bookId) => books.findIndex(book => book.id === bookId);

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
    static getAll (req, h) {
        let { name, reading, finished } = req.query;

        const returnedBooks = [];

        if (name) {
            const loweredCaseBookName = name.toLowerCase();

            books.filter(book => {
                if (book.name.toLowerCase().includes(loweredCaseBookName)) {
                    returnedBooks.push({id: book.id, name: book.name, publisher: book.publisher});
                }
            });

            return apiResponse(h, {status: 'success', data: {books: returnedBooks}});
        }

        if (reading) {
            books.filter(book => {
                if (book.reading == reading) {
                    returnedBooks.push({id: book.id, name: book.name, publisher: book.publisher});
                }
            });

            return apiResponse(h, {status: 'success', data: {books: returnedBooks}});
        }

        if (finished) {
            books.filter(book => {
                if (book.finished == finished) {
                    returnedBooks.push({id: book.id, name: book.name, publisher: book.publisher});
                }
            });

            return apiResponse(h, {status: 'success', data: {books: returnedBooks}});
        }

        if (books.length > 0) {
            books.forEach(book => {
                returnedBooks.push({id: book.id, name: book.name, publisher: book.publisher});
            });
        }

        return apiResponse(h, {status: 'success', data: {books: returnedBooks}});
    }

    // Static method for get book by book id
    static getById (req, h) {
        const { bookId } = req.params;

        const idx = getIndexById(bookId);
        
        if (idx === -1) 
            return apiResponse(h, {status: 'fail', message: 'Buku tidak ditemukan'}, 404);

        return apiResponse(h, {status: 'success', data: {book: books[idx]}});
    }

    // Static method for updating an existing book by book id
    static update (req, h) {
        // Destructuring request payload
        const { name, pageCount, readPage } = req.payload;

        if (!name) 
            return apiResponse(h, {status: 'fail', message: 'Gagal menambahkan buku. Mohon isi nama buku'}, 400);

        if (readPage > pageCount) 
            return apiResponse(h, {status: 'fail', message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount'}, 400);

        const { bookId } = req.params;
        const idx =getIndexById(bookId);

        if (idx === -1)
            return apiResponse(h, {status: 'fail', message: 'Gagal memperbarui buku. Id tidak ditemukan'}, 404);

        const newData = {};
        for (let key in req.payload) {
            newData[key] = req.payload[key];
        }

        Object.assign(books[idx], newData);

        return apiResponse(h, {status: 'success', message: 'Buku berhasil diperbarui'});
    }

    // Static method for deleting book by book id
    static remove (req, h) {
        const { bookId } = req.params;

        const idx = getIndexById(bookId);

        if (idx === -1)
            return apiResponse(h, {status: 'fail', message: 'Buku gagal dihapus. Id tidak ditemukan'}, 404);

        books.splice(idx, 1);
        
        return apiResponse(h, {status: 'success', message: 'Buku berhasil dihapus'});
    }
}

module.exports = Book;