'use client';
import { PrismaClient } from '@prisma/client';

function Button() {
  const prisma = new PrismaClient();
  const loadDataFromApi = async () => {
    fetch('/api/hello')
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        console.log(data);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  return (
    <button
      onClick={() => {
        console.log('Button clicked');
        loadDataFromApi();
      }}
    >
      Click me
    </button>
  );
}

export default Button;
