'use client'; // Obrigatório para usar useState/useEffect

import { useState, useEffect } from 'react';

// Mock API function (Simulada aqui para facilitar)
const mockApiCall = (query: string): Promise<string[]> => {
  return new Promise((resolve) => {
    const delay = Math.random() * 1000 + 500; // Delay aleatório 500ms-1.5s
    setTimeout(() => {
      resolve([
        `Next.js Result for "${query}"`,
        `Another result for "${query}"`,
        `Optimized with useEffect`
      ]);
    }, delay);
  });
};

export default function DebouncePage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<string[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    // 1. Se estiver vazio, limpa e não faz nada
    if (!searchTerm.trim()) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setResults([]);
      setIsSearching(false);
      return;
    }

    // Variável para evitar "Race Conditions" (O Segredo do Senior no React)
    let isCancelled = false;

    // 2. Setup do Debounce (Espera 500ms)
    const timeoutId = setTimeout(async () => {
      setIsSearching(true);
      
      try {
        const data = await mockApiCall(searchTerm);
        
        // SÓ atualiza o estado se este efeito ainda for o "ativo"
        if (!isCancelled) {
          setResults(data);
          setIsSearching(false);
        }
      } catch (error) {
        if (!isCancelled) setIsSearching(false);
      }
    }, 500);

    // 3. Cleanup Function
    // Executa quando o componente desmonta OU quando searchTerm muda (antes do novo efeito)
    return () => {
      clearTimeout(timeoutId); // Cancela o timer (Debounce)
      isCancelled = true;      // Ignora o resultado da API se ela já tivesse começado (Race Condition)
    };

  }, [searchTerm]); // Dependência: executa sempre que searchTerm muda

  return (
    <main style={{ padding: '2rem', fontFamily: 'sans-serif', maxWidth: '600px', margin: '0 auto' }}>
      <h1>⚛️ Next.js Optimization Lab</h1>
      
      <div style={{ marginBottom: '2rem', padding: '1rem', border: '1px solid #eaeaea', borderRadius: '8px' }}>
        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
          Search Product
        </label>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Type something..."
          style={{ 
            width: '100%', padding: '10px', fontSize: '16px', 
            border: '1px solid #ccc', borderRadius: '4px' 
          }}
        />
        <small style={{ color: '#666' }}>Logic: useEffect + Cleanup Function</small>
      </div>

      <div aria-live="polite">
        {isSearching && <p>⏳ Loading...</p>}
        
        {!isSearching && results.length > 0 && (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {results.map((item, index) => (
              <li key={index} style={{ padding: '10px', borderBottom: '1px solid #eee' }}>
                {item}
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}