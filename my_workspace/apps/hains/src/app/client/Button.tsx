'use client';
import { FraunhoferTypes } from '@my-workspace/prisma_cruds';

function Button({ clientId, clientSecret }: { clientId: string; clientSecret: string }) {
  const loadDataFromApi = async () => {
    console.log('Loading data from API', clientId, clientSecret);
    fetch('http://localhost/api/fraunhofer/data/2025-01-01/2025-01-30', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret
      })
    })
      .then((response) => {
        return response.json();
      })
      .then((data: FraunhoferTypes.PlanData) => {
        Object.entries(data).forEach(([key, value]) => {
          if (Array.isArray(value)) {
            console.log(key, value);
            // value.forEach((item, i) => {
            //   if (item?.ID === 0 || item?.MitarbeiterID === 0 || item?.DienstID === 0) console.log(key, i, item);
            // });
          } else console.log(key, value);
        });
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
      Load Data
    </button>
  );
}

export default Button;
