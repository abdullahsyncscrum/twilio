import React, { useState, useEffect } from 'react';
import { Button, TextField, Box, Typography } from '@material-ui/core';
import ClientList from '../ClientList/ClientList';

const AddClient: React.FC = () => {
  const [email, setEmail] = useState<string>(''); // specify string type for email
  const [clients, setClients] = useState<string[]>([]); // specify array of strings for clients
  const [loading, setLoading] = useState<boolean>(false); // track loading state
  const [error, setError] = useState<string>(''); // track errors if any

  // Fetch the list of clients on component mount
  const fetchClients = async (): Promise<void> => {
    try {
      const response = await fetch('https://coach-backend-stagging.up.railway.app/v1/coach/client?page=1&limit=10', {
        method: 'GET',
        headers: {
          Accept: '*/*',
          Authorization:
            'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2ODllNGQyNDI5OWFlODQxNmY3MmYzZTAiLCJzZXNzaW9uSWQiOiI2OGE2MzM0YTVkMjQ1OGJmMGM4MGNiODciLCJyb2xlIjoiY29hY2giLCJpYXQiOjE3NTU3MjI1NzAsImV4cCI6MTc1NTczNjk3MH0.2ZuItXVQyAbloWdfwZDo3wYbsmT4fBiLOc37uy0E0hs', // Add your dummy bearer token here
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch clients');
      }

      const data = await response.json();
      // Assuming the API returns a list of client emails as an array
      console.log('Array ', data?.data);
      setClients(data?.data || []);
    } catch (error) {
      setError('Failed to fetch clients');
    }
  };

  useEffect(() => {
    // Call fetchClients when component mounts
    fetchClients();
  }, []); // Empty dependency array ensures this runs only once on mount

  const handleAddClient = async (): Promise<void> => {
    if (email) {
      setLoading(true);
      setError(''); // Clear any previous errors

      // Add the client to the list locally
      setClients(prevClients => [...prevClients, email]);

      try {
        // Call the API to register the client
        const response = await fetch('https://coach-backend-stagging.up.railway.app/v1/coach/client/register', {
          method: 'POST',
          headers: {
            Accept: '*/*',
            'Content-Type': 'application/json',
            Authorization:
              'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2ODllNGQyNDI5OWFlODQxNmY3MmYzZTAiLCJzZXNzaW9uSWQiOiI2OGE2MzM0YTVkMjQ1OGJmMGM4MGNiODciLCJyb2xlIjoiY29hY2giLCJpYXQiOjE3NTU3MjI1NzAsImV4cCI6MTc1NTczNjk3MH0.2ZuItXVQyAbloWdfwZDo3wYbsmT4fBiLOc37uy0E0hs', // Add your dummy bearer token here
          },
          body: JSON.stringify({ email: email }),
        });

        if (!response.ok) {
          throw new Error('Failed to add client');
        }

        // If the API call is successful, reset the input field
        setEmail('');
      } catch (error) {
        setError('Failed to add client');
      } finally {
        setLoading(false);
      }
    } else {
      alert('Please enter a valid email');
    }
  };

  return (
    <>
      <Box
        style={{
          width: 300,
          margin: 'auto',
          padding: 16,
          textAlign: 'center',
          boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)', // Correct boxShadow style
          borderRadius: 8,
        }}
      >
        <Typography variant="h6" gutterBottom>
          Add a Client
        </Typography>

        <TextField
          label="Client Email"
          type="email"
          variant="outlined"
          fullWidth
          value={email}
          onChange={e => setEmail(e.target.value)} // event handler
          style={{ marginBottom: 16 }}
        />

        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleAddClient} // event handler
          disabled={loading} // Disable the button while loading
        >
          {loading ? 'Adding Client...' : 'Add Client'}
        </Button>

        {error && (
          <Typography color="error" variant="body2" style={{ marginTop: 8 }}>
            {error}
          </Typography>
        )}
      </Box>

      <ClientList clients={clients} />
    </>
  );
};

export default AddClient;
