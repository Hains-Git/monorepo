'use client';

function Button() {
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
