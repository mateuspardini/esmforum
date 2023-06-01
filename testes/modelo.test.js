const bd = require('../bd/bd_utils.js');
const modelo = require('../modelo.js');

beforeEach(() => {
  bd.reconfig('./bd/esmforum-teste.db');
  // limpa dados de todas as tabelas
  bd.exec('delete from perguntas', []);
  bd.exec('delete from respostas', []);
});

test('Testando banco de dados vazio', () => {
  expect(modelo.listar_perguntas().length).toBe(0);
});

test('Testando cadastro de três perguntas', () => {
  modelo.cadastrar_pergunta('1 + 1 = ?');
  modelo.cadastrar_pergunta('2 + 2 = ?');
  modelo.cadastrar_pergunta('3 + 3 = ?');
  const perguntas = modelo.listar_perguntas(); 
  expect(perguntas.length).toBe(3);
  expect(perguntas[0].texto).toBe('1 + 1 = ?');
  expect(perguntas[1].texto).toBe('2 + 2 = ?');
  expect(perguntas[2].num_respostas).toBe(0);
  expect(perguntas[1].id_pergunta).toBe(perguntas[2].id_pergunta-1);
});

test('Testando cadastro de resposta', () => {
  modelo.cadastrar_pergunta('Qual é o melhor time do mundo?');
  const perguntas = modelo.listar_perguntas();
  expect(perguntas.length).toBe(1);
  const id_pergunta = perguntas[0].id_pergunta;
  
  modelo.cadastrar_resposta(id_pergunta, 'O melhor time do mundo é o Palmeiras.');
  modelo.cadastrar_resposta(id_pergunta, 'Palmeiras.');
  const respostas = modelo.get_respostas(id_pergunta);
  expect(respostas.length).toBe(2);
  expect(respostas[0].texto).toBe('O melhor time do mundo é o Palmeiras.');
  expect(respostas[1].texto).toBe('Palmeiras.');
});

test('Testando obtenção de pergunta', () => {
  modelo.cadastrar_pergunta('Como passar em Conversão?');
  const perguntas = modelo.listar_perguntas();
  expect(perguntas.length).toBe(1);
  const id_pergunta = perguntas[0].id_pergunta;

  const pergunta = modelo.get_pergunta(id_pergunta);
  expect(pergunta.id_pergunta).toBe(id_pergunta);
  expect(pergunta.texto).toBe('Como passar em Conversão?');
});

test('Testando obtenção de respostas', () => {
  modelo.cadastrar_pergunta('Qual é a resposta pra tudo?');
  const perguntas = modelo.listar_perguntas();
  expect(perguntas.length).toBe(1);
  const id_pergunta = perguntas[0].id_pergunta;

  modelo.cadastrar_resposta(id_pergunta, 'O número 42');
  modelo.cadastrar_resposta(id_pergunta, '42');
  const respostas = modelo.get_respostas(id_pergunta);
  expect(respostas.length).toBe(2);
  expect(respostas[0].texto).toBe('O número 42');
  expect(respostas[1].texto).toBe('42');
});