async function fetchUserData(userId) {
  const response = await fetch('https://jsonplaceholder.typicode.com/users/' + userId);
  const data = await response.json();
  return data;
}

fetchUserData(1).then(console.log);
