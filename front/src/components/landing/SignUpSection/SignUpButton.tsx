// LoginButton.tsx
'use client';

import Button from "@mui/material/Button";

export default function SignUpButton() {
  const signup = async () => {
    const response = await fetch(
    //`${process.env.BACKEND_URL}/auth/login`, //todo use .env vars
    'http://localhost:8000/api/v1/auth/register',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        mail: 'test@test.test', //todo take parameters from form
        name: 'test',
        password: 'Test123!'
      }),
    });

    const data = await response.json();
    console.log(data);
    return data;
    };

    return (
        <Button
            variant="contained"
            onClick={signup}
        >
            Sign Up
        </Button>
    );
}