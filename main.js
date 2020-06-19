//  Bloqueando o script para não ter acesso pelo console do navegador famosa Clossure 
(function (){
  // Função para transformar os milisegundos gerados pela função Checkout em minutos e segundos
  function convertPeriod(ms){
    const min = Math.floor(ms / 60000);
    const sec = Math.floor((ms % 60000) / 1000);

    return `${min} minutos e ${sec} segundos`;
  }

  // Nessa função vou renderizar os registros que já estão no LocalStorage ao atualizar a pagina
  function renderGarage(){
    const garage = getGarage();
    const setGarage = document.querySelector('#garage').innerHTML = '';
    garage.forEach(setCar => addCar(setCar));
  };

  // Nessa função vou adicionar o carro cadastrado no painel de carros
  function addCar(car){
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${car.name}</td>
      <td>${car.id}</td>
      <td data-time="${car.time}">${new Date(car.time).toLocaleString('pt-BR', { hour: 'numeric', minute: 'numeric'})}</td>
      <td>
        <button class="delete">Remover</button>
      </td>
    `;

    const painel = document.querySelector('#garage').appendChild(row)
  };

  // Função de Checkout 
  function checkOut(info){
    let period = new Date() - new Date(info[2].dataset.time);
    period = convertPeriod(period);

    const id = info[1].textContent;   

    const messege = `O veículo ${info[0].textContent} de placa ${id} permaneceu por ${period}. Deseja encerrar?`;
    
    if(!confirm(messege)) return;
    
    // Removendo o carro e atualizando o localStorage

    const garage = getGarage().filter(setCar => setCar.id !== id);
    localStorage.garage = JSON.stringify(garage);

    renderGarage();
    
    
  };


  // Função para facilitar a chamada do localStorage
  const getGarage = () => localStorage.garage ? JSON.parse(localStorage.garage) : [];

  // Executando a funçao renderGarage
  renderGarage();

  // Nesse função vou capturar as informações dos inputs quando
  // o botão registrar for clicado
  document.querySelector('#send').addEventListener('click', (event) => {
    const name = document.querySelector('#name').value;
    const id = document.querySelector('#id').value;
    if(!name || !id){
      alert('Os campos são OBRIGATÓRIOS!');
      return;
    }
  // Criando um objeto para armazenar as informações do carro e a hora
  // da entrada.
    const car = { name, id, time: new Date() };
  // Salvando as informações no localStorage
    const garage = getGarage();
    garage.push(car);
    localStorage.garage = JSON.stringify(garage);
    addCar(car);
  // Limpando os inputs ao clicar em Registrar
    document.querySelector('#name').value = '';
    document.querySelector('#id').value = '';
  });

  // removendo o carro do sistema
  const remove = document.querySelector('#garage').addEventListener('click', (event) => {
    if(event.target.className == 'delete')   
      checkOut(event.target.parentElement.parentElement.cells);
  });
}) ();