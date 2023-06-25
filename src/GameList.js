import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardContent, CardMedia, Typography, Grid, TextField, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { RaceBy } from '@uiball/loaders'

const GameList = () => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const genres = [...new Set(games.map((game) => game.genre))];

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const response = await axios.get('https://games-test-api-81e9fb0d564a.herokuapp.com/api/data', {
          headers: {
            'dev-email-address': 'ghvasconcelos@hotmail.com', 
          },
        });
        setGames(response.data);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };

    fetchGames();
  }, []);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleGenreChange = (event) => {
    setSelectedGenre(event.target.value);
  };

  const filteredGames = games.filter((game) =>
    game.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredGamesByGenre = selectedGenre
    ? filteredGames.filter((game) => game.genre === selectedGenre)
    : filteredGames;

  if (loading) {
    return (
      <RaceBy 
       size={80}
       lineWeight={5}
       speed={1.4} 
       color="black" 
      />
    )
  }

  return (
    <div>
      <div className="form-group">
        <TextField
          type="text"
          variant="outlined"
          label="Buscar por título"
          value={searchTerm}
          onChange={handleSearchChange}
          fullWidth
          margin="normal"
        />
      </div>

      <FormControl variant="outlined" fullWidth margin="normal">
        <InputLabel id="genre-label">Gênero</InputLabel>
        <Select
          labelId="genre-label"
          id="genre-select"
          value={selectedGenre}
          onChange={handleGenreChange}
          label="Gênero"
        >
          <MenuItem value="">Todos</MenuItem>
          {genres.map((genre) => (
            <MenuItem key={genre} value={genre}>{genre}</MenuItem>
          ))}
        </Select>
      </FormControl>

      {filteredGamesByGenre.length > 0 ? (
        <Grid container spacing={2}>
          {filteredGamesByGenre.map((game) => (
            <Grid item key={game.id} xs={12} sm={6} md={4}>
              <Card>
                <CardMedia component="img" height="140" image={game.image} alt={game.title} />
                <img src={game.image}/>
                <CardContent>
                  <Typography variant="h6">{game.title}</Typography>
                  <Typography variant="body2">{game.description}</Typography>
                </CardContent>
                
              </Card>
              
            </Grid>
          ))}
        </Grid>
      ) : (
        <div>Nenhum jogo encontrado.</div>
        
      )}
    </div>
  );
};

export default GameList;
