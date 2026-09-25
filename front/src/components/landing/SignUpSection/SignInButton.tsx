// LoginButton.tsx
'use client';

import Button from "@mui/material/Button";

export default function SignInButton() {
  const signin = async () => {
    const response = await fetch(
    //`${process.env.BACKEND_URL}/auth/login`, //todo use .env vars
    'http://localhost:8000/api/v1/auth/login',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        mail: 'test@test.test',
        password: 'Test123!'
        //mail, //todo take parameters from form
        //password,
      }),
    });

    const data = await response.json();
    console.log(data);
    //access token in data.backend_tokens.access_token
    //refresh token in data.backend_tokens.refresh_token
    return data;
    };

    return (
        <Button
            variant="outlined"
            onClick={signin}
        >
            Sign In
        </Button>
    );
}