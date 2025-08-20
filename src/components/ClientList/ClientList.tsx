import React from 'react';
import { List, ListItem, ListItemText, IconButton, Box, Typography } from '@material-ui/core';
import MailIcon from '@material-ui/icons/Mail';
import { useHistory, useLocation } from 'react-router-dom';

interface ClientListProps {
  clients: any[]; // Array of emails
}

const ClientList: React.FC<ClientListProps> = ({ clients }) => {
  const history = useHistory();
  const location = useLocation();

  const handleInvitation = async (id: string) => {
    const response = await fetch('https://coach-backend-stagging.up.railway.app/v1/meeting/create', {
      method: 'POST',
      headers: {
        Accept: '*/*',
        'Content-Type': 'application/json',
        Authorization:
          'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2ODllNGQyNDI5OWFlODQxNmY3MmYzZTAiLCJzZXNzaW9uSWQiOiI2OGE2MzM0YTVkMjQ1OGJmMGM4MGNiODciLCJyb2xlIjoiY29hY2giLCJpYXQiOjE3NTU3MjI1NzAsImV4cCI6MTc1NTczNjk3MH0.2ZuItXVQyAbloWdfwZDo3wYbsmT4fBiLOc37uy0E0hs', // Add your dummy bearer token here
      },
      body: JSON.stringify({ participants: [id], durationMinutes: 4 }),
    });

    const data = await response.json();

    console.log('data ', data);

    const params = new URLSearchParams();
    params.append('token', data?.token);

    history.push({
      pathname: location.pathname, // Current route
      search: `?${params.toString()}`, // New query params
    });
  };

  return (
    <Box
      style={{
        width: 400,
        margin: 'auto',
        padding: 16,
        textAlign: 'center',
        boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
        borderRadius: 8,
      }}
    >
      <Typography variant="h6" gutterBottom>
        Client List
      </Typography>

      <List>
        {clients.map((client, index) => (
          <ListItem key={index} style={{ display: 'flex', alignItems: 'center' }}>
            <ListItemText primary={client.email} style={{ flexGrow: 1 }} />
            <IconButton
              onClick={() => handleInvitation(client._id)} // Corrected the onClick handler
              color="primary"
              aria-label="invite client"
            >
              <MailIcon />
            </IconButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default ClientList;
