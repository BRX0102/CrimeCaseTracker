import fetch from '../core/fetch';

module.exports = async function getUserCases(user){
  return fetch('/query', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      'operation': 'userCases',
      'username': user
    })
  })
    .then((response) => response.json())
    .then((responseJson) => {
      return responseJson.cases;
    })
    .catch((error) => {
      console.log(error);
      return null;
    })
};

module.exports = async function getAllFromTable(table){
  table = "SELECT * FROM `" + table + "`";
  return fetch('/query', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      'operation': 'allFromTable',
      table
    })
  })
    .then((response) => response.json())
    .then((responseJson) => {
      return responseJson.data;
    })
    .catch((error) => {
      console.log(error);
      return null;
    })
};
