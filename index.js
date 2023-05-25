const Hapi = require('@hapi/hapi');

const init = async () => {
    const server = Hapi.server({
        port: 9000,
        host: 'localhost',
    });

    let books = [];
    server.route({
        method: 'POST',
        path: '/books',
        handler: (request, h) => {
            const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;
        
            if (!name) {
                return h
                .response({
                    status: 'fail',
                    message: 'Gagal menambahkan buku. Mohon isi nama buku',
                })
                .code(400);
            }
        
            if (readPage > pageCount) {
                return h
                .response({
                    status: 'fail',
                    message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
                })
                .code(400);
            }
        
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
                finished: pageCount === readPage, // Menambahkan properti finished
                reading,
                insertedAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            };
        
            books.push(book);
        
            return h
                .response({
                status: 'success',
                message: 'Buku berhasil ditambahkan',
                data: {
                    bookId: book.id, // Menggunakan properti id sebagai bookId
                },
            })
            .code(201);
        },
    });
      

    server.route({
        method: 'GET',
        path: '/books',
        handler: (request, h) => {
            const simplifiedBooks = books.map(({ id, name, publisher }) => ({ id, name, publisher }));
        
            return h.response({
                status: 'success',
                data: {
                    books: simplifiedBooks,
                },
            });
        },
    });
      

    server.route({
        method: 'GET',
        path: '/books/{bookId}',
        handler: (request, h) => {
            const { bookId } = request.params;
        
            const book = books.find((book) => book.id === bookId);
        
            if (!book) {
                return h
                .response({
                    status: 'fail',
                    message: 'Buku tidak ditemukan',
                })
                .code(404);
            }
        
            const finished = book.pageCount === book.readPage;
        
            const responseBook = {
                ...book,
                finished: finished,
            };
        
            return h
                .response({
                status: 'success',
                data: {
                    book: responseBook,
                },
            })
            .code(200);
        },
    });
      
      

    server.route({
        method: 'PUT',
        path: '/books/{bookId}',
        handler: (request, h) => {
            const { bookId } = request.params;
            const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;

            const bookIndex = books.findIndex((book) => book.id === bookId);

            if (bookIndex === -1) {
                return h
                .response({
                    status: 'fail',
                    message: 'Gagal memperbarui buku. Id tidak ditemukan',
                })
                .code(404);
            }

            if (!name) {
                return h
                .response({
                    status: 'fail',
                    message: 'Gagal memperbarui buku. Mohon isi nama buku',
                })
                .code(400);
            }

            if (readPage > pageCount) {
                return h
                .response({
                    status: 'fail',
                    message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
                })
                .code(400);
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

            return h
                .response({
                status: 'success',
                message: 'Buku berhasil diperbarui',
                })
                .code(200);
            },
            });

        server.route({
            method: 'DELETE',
            path: '/books/{bookId}',
            handler: (request, h) => {
            const { bookId } = request.params;

            const bookIndex = books.findIndex((book) => book.id === bookId);

            if (bookIndex === -1) {
                return h
                .response({
                    status: 'fail',
                    message: 'Buku gagal dihapus. Id tidak ditemukan',
                })
                .code(404);
            }

            books.splice(bookIndex, 1);

            return h
                .response({
                status: 'success',
                message: 'Buku berhasil dihapus',
                })
                .code(200);
            },
        });

    try {
        await server.start();
        console.log(`Server berjalan pada ${server.info.uri}`);
    } catch (err) {
        console.error(err);
    }
};

init();