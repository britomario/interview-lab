import http, { IncomingMessage, ServerResponse } from 'http';

//                                    👇 Tipagem Explícita aqui
const server = http.createServer((req: IncomingMessage, res: ServerResponse) => {
  
  console.log(`[REQUEST] ${req.method} ${req.url}`);

  if (req.url === '/blocking') {
    const start = Date.now();
    while (Date.now() - start < 5000) {
      // Loop
    }
    res.writeHead(200);
    res.end('Fim do bloqueio');
  
  } else if (req.url === '/non-blocking') {
    console.log('Iniciando operação assíncrona...');
    
    setTimeout(() => {
      console.log('Operação assíncrona finalizada!');
      res.writeHead(200);
      res.end('Fim do processo assíncrono');
    }, 5000);

  } else {
    res.writeHead(200);
    res.end('Olá! Eu respondo instantaneamente.');
  }
});

server.listen(3001, () => {
  console.log('🔌 Server running on http://localhost:3001');
});