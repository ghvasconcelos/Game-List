import React, { useState, useEffect } from 'react';

const GameList = () => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const genres = [...new Set(games.map((game) => game.genre))];


  useEffect(() => {
    const fetchGames = async () => {
      try {
        const response = await fetch('https://games-test-api-81e9fb0d564a.herokuapp.com/api/data/');
        if (!response.ok) {
          if (
            response.status === 500 ||
            response.status === 502 ||
            response.status === 503 ||
            response.status === 504 ||
            response.status === 507 ||
            response.status === 508 ||
            response.status === 509
          ) {
            throw new Error('O servidor falhou em responder, tente recarregar a página.');
          } else {
            throw new Error(
              'O servidor não conseguiu responder por agora, tente voltar novamente mais tarde.'
            );
          }
        }
        const data = await response.json();
        setGames(data);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };
  
    const timeoutId = setTimeout(() => {
      setLoading(false);
    }, 5000);
  
    fetchGames();
  
    return () => clearTimeout(timeoutId);
  }, []);
  
  // ...
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  if (games.length === 0) {
    return <div>Nenhum jogo disponível no momento.</div>;
  }
  

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleGenreChange = (event) => {
    setSelectedGenre(event.target.value);
  };
  
  const filteredGamesByGenre = selectedGenre
    ? filteredGames.filter((game) => game.genre === selectedGenre)
    : filteredGames;
  

  const filteredGames = games.filter((game) =>
    game.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div>Loading...</div>;
  }

  
  return (
    <div className="game-list">
  <div className="search-bar">
    <input
      type="text"
      placeholder="Buscar por título..."
      value={searchTerm}
      onChange={handleSearchChange}
    />
  </div>
  <div className="genre-filter">
    <select value={selectedGenre} onChange={handleGenreChange}>
      <option value="">Todos os Gêneros</option>
      {genres.map((genre) => (
        <option key={genre} value={genre}>
          {genre}
        </option>
      ))}
    </select>
  </div>
  {filteredGamesByGenre.length > 0 ? (
    filteredGamesByGenre.map((game) => (
      <div key={game.id} className="game-card">
        <img src={game.image} alt={game.title} />
        <h2>{game.title}</h2>
      </div>
    ))
  ) : (
    <div>Nenhum jogo encontrado.</div>
  )}
</div>

  );
};

export default GameList;
