async function baterPonto() {
    const nome = document.getElementById('nome').value;
    const dataHora = new Date().toISOString();
    let latitude, longitude;
  
    try {
      const position = await new Promise((resolve, reject) =>
        navigator.geolocation.getCurrentPosition(resolve, reject)
      );
      latitude = position.coords.latitude;
      longitude = position.coords.longitude;
    } catch (error) {
      console.error('Erro ao obter localização:', error);
      alert('Erro ao obter localização.');
      return;
    }
  
    console.log('Enviando dados:', { nome, dataHora, latitude, longitude });
  
    try {
      const response = await fetch('http://localhost:3000/batida', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nome, dataHora, latitude, longitude }),
      });
  
      const result = await response.text();
      console.log('Resposta:', response);
      console.log('Resultado:', result);
  
      const mensagemElement = document.getElementById('mensagem');
      if (response.ok) {
        mensagemElement.style.color = '#4CAF50';
        mensagemElement.textContent = 'Batida registrada com sucesso!';
      } else {
        mensagemElement.style.color = '#f44336';
        mensagemElement.textContent = 'Erro ao registrar a batida: ' + result;
      }
    } catch (error) {
      console.error('Erro ao enviar batida:', error);
      alert('Erro ao enviar batida.');
    }
  }
  