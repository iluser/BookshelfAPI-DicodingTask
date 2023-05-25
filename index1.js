const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const PORT = 9000;

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Inisialisasi data buku
let books = [];

// Menyimpan buku
app.post('/books', (req, res) => {
    const { name, year, author, summary, publisher, pageCount, readPage, reading } = req.body;
    
    const id = `book-${new Date().getTime()}`;
    
    const book = {
        id,
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        reading,
        insertedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };
    
    books.push(book);
    
    res.status(201).json({
        status: 'success',
        message: 'Buku berhasil disimpan',
        data: {
            book,
        },
    });
});

// Menampilkan seluruh buku
app.get('/books', (req, res) => {
    res.status(200).json({
        status: 'success',
        data: {
            books,
        },
    });
});

// Menampilkan detail buku
app.get('/books/:bookId', (req, res) => {
    const { bookId } = req.params;
    
    const book = books.find((book) => book.id === bookId);
    
    if (!book) {
        return res.status(404).json({
            status: 'fail',
            message: 'Buku tidak ditemukan',
        });
    }
    
    res.status(200).json({
        status: 'success',
        data: {
            book,
        },
    });
});

// Mengubah data buku
app.put('/books/:bookId', (req, res) => {
    const { bookId } = req.params;
    
    const { name, year, author, summary, publisher, pageCount, readPage, reading } = req.body;
    
    const bookIndex = books.findIndex((book) => book.id === bookId);
    
    if (bookIndex === -1) {
        return res.status(404).json({
            status: 'fail',
            message: 'Gagal memperbarui buku. Id tidak ditemukan',
        });
    }
    
    if (!name) {
        return res.status(400).json({
            status: 'fail',
            message: 'Gagal memperbarui buku. Mohon isi nama buku',
        });
    }
    
    if (readPage > pageCount) {
        return res.status(400).json({
            status: 'fail',
            message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
        });
    }
    
    books[bookIndex] = {
        ...books[bookIndex],
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        reading,
        updatedAt: new Date().toISOString(),
    };
  
    res.status(200).json({
        status: 'success',
        message: 'Buku berhasil diperbarui',
    });
});
    
// Menghapus buku
app.delete('/books/:bookId', (req, res) => {
    const { bookId } = req.params;

    const bookIndex = books.findIndex((book) => book.id === bookId);

    if (bookIndex === -1) {
        return res.status(404).json({
        status: 'fail',
        message: 'Buku gagal dihapus. Id tidak ditemukan',
    });
    }

    books.splice(bookIndex, 1);

    res.status(200).json({
        status: 'success',
        message: 'Buku berhasil dihapus',
    });
});

// Menjalankan server
app.listen(PORT, () => {
    console.log(`Server berjalan pada http://localhost:${PORT}`);
});