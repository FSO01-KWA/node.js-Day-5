const http = require('http');
const url = require('url');
const fs = require('fs');

const PORT = 3000;
let todos = [];
let messages = [];
let posts = [];
let products = [];
let orders = [];
let users = {};

// 데이터 파일 로드
if (fs.existsSync('./todos.json')) {
    todos = JSON.parse(fs.readFileSync('./todos.json'));
}

if (fs.existsSync('./messages.json')) {
    messages = JSON.parse(fs.readFileSync('./messages.json'));
}

if (fs.existsSync('./posts.json')) {
    posts = JSON.parse(fs.readFileSync('./posts.json'));
}

if (fs.existsSync('./products.json')) {
    products = JSON.parse(fs.readFileSync('./products.json'));
}

if (fs.existsSync('./orders.json')) {
    orders = JSON.parse(fs.readFileSync('./orders.json'));
}

if (fs.existsSync('./users.json')) {
    users = JSON.parse(fs.readFileSync('./users.json'));
}

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const { pathname, query } = parsedUrl;

    // CORS 설정
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // OPTIONS 요청 처리
    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }

    // TODOS 처리
    if (pathname.startsWith('/todos')) {
        handleTodos(req, res);
    }
    // 메시지 처리
    else if (pathname.startsWith('/messages')) {
        handleMessages(req, res);
    }
    // 블로그 포스트 처리
    else if (pathname.startsWith('/posts')) {
        handlePosts(req, res);
    }
    // 전자상거래 처리
    else if (pathname.startsWith('/products')) {
        handleProducts(req, res);
    } else if (pathname.startsWith('/orders')) {
        handleOrders(req, res);
    }
    // 인증 처리
    else if (pathname.startsWith('/users')) {
        handleUsers(req, res);
    } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Not Found' }));
    }
});

// TODOS 처리 함수
function handleTodos(req, res) {
    if (req.method === 'GET') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(todos));
    } else if (req.method === 'POST') {
        let body = '';
        req.on('data', chunk => { body += chunk; });
        req.on('end', () => {
            const todo = JSON.parse(body);
            todo.id = Date.now();
            todos.push(todo);
            fs.writeFileSync('./todos.json', JSON.stringify(todos));
            res.writeHead(201, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(todo));
        });
    } else if (req.method === 'PUT') {
        let body = '';
        req.on('data', chunk => { body += chunk; });
        req.on('end', () => {
            const updatedTodo = JSON.parse(body);
            const id = parseInt(req.url.split('/')[2]);
            const index = todos.findIndex(todo => todo.id === id);
            todos[index] = { ...todos[index], ...updatedTodo };
            fs.writeFileSync('./todos.json', JSON.stringify(todos));
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(todos[index]));
        });
    } else if (req.method === 'DELETE') {
        const id = parseInt(req.url.split('/')[2]);
        todos = todos.filter(todo => todo.id !== id);
        fs.writeFileSync('./todos.json', JSON.stringify(todos));
        res.writeHead(204);
        res.end();
    }
}

// 메시지 처리 함수
function handleMessages(req, res) {
    if (req.method === 'GET') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(messages));
    } else if (req.method === 'POST') {
        let body = '';
        req.on('data', chunk => { body += chunk; });
        req.on('end', () => {
            const message = JSON.parse(body);
            message.id = Date.now();
            messages.push(message);
            fs.writeFileSync('./messages.json', JSON.stringify(messages));
            res.writeHead(201, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(message));
        });
    }
}

// 블로그 포스트 처리 함수
function handlePosts(req, res) {
    if (req.method === 'GET') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(posts));
    } else if (req.method === 'POST') {
        let body = '';
        req.on('data', chunk => { body += chunk; });
        req.on('end', () => {
            const post = JSON.parse(body);
            post.id = Date.now();
            posts.push(post);
            fs.writeFileSync('./posts.json', JSON.stringify(posts));
            res.writeHead(201, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(post));
        });
    }
}

// 전자상거래 상품 처리 함수
function handleProducts(req, res) {
    if (req.method === 'GET') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(products));
    }
}

// 주문 처리 함수
function handleOrders(req, res) {
    if (req.method === 'POST') {
        let body = '';
        req.on('data', chunk => { body += chunk; });
        req.on('end', () => {
            const order = JSON.parse(body);
            order.id = Date.now();
            orders.push(order);
            fs.writeFileSync('./orders.json', JSON.stringify(orders));
            res.writeHead(201, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(order));
        });
    }
}

// 사용자 인증 처리 함수
function handleUsers(req, res) {
    if (req.method === 'POST' && req.url === '/users/signup') {
        let body = '';
        req.on('data', chunk => { body += chunk; });
        req.on('end', () => {
            const { email, password } = JSON.parse(body);
            users[email] = { email, password };
            fs.writeFileSync('./users.json', JSON.stringify(users));
            res.writeHead(201, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'User created' }));
        });
    } else if (req.method === 'POST' && req.url === '/users/login') {
        let body = '';
        req.on('data', chunk => { body += chunk; });
        req.on('end', () => {
            const { email, password } = JSON.parse(body);
            if (users[email] && users[email].password === password) {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Login successful' }));
            } else {
                res.writeHead(401, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Invalid credentials' }));
            }
        });
    }
}

server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
