 # 📖 Projeto   
  

O projeto foi desenvolvido para alimentar o frontend desse  **[projeto](https://github.com/zagamendes/front-wa)**. O backend é responsável gerênciar e disponibilizar os filmes cadastrados no banco de dados
    
  

## 🧪 Tecnologias   
    
[![My Skills](https://skillicons.dev/icons?i=typescript,nodejs,mongodb)](https://skillicons.dev)
    
## 🚀 Como executar   
Para rodar o backend você só precisa clonar o projeto, instalar as dependências e rodar `npm run dev`

## Endpoints
**POST** /updatedb -> Adiciona filmes no banco de dados de 8 em 8 <br/>
**Response de sucesso** `{ message: "Filmes adicionados com sucesso!", type: "success" }`<br/>
**Response de erro** `{ error: "mensagem de erro" }`


**GET** /movies -> Retorna um **array** com os filmes do banco de dados nesse formato de forma paginada, sendo 8 filmes por página <br/>
```{
  _id: string;
  title: string;
  image: string;
  director: string;
  producer: string;
  banner: string;
  description: string;
  __v: number;
  }
  ```
Podem ser passado opcionalmente qual página desejada com `/movies?page={numero da página}`, caso não seja passado nada, o default sera 1

**GET** /totalMovies -> Retorna a quantidade de filmes cadastrados no banco <br/>
**Response de sucesso** `{ total: 12}`<br/>

**DELETE** /deleteMovies -> Apaga do banco de dados 8 filmes por vez <br/>
**Response de sucesso** `{ message: "Filmes apagados", type: "success" }`



