# Foodfy

Foodfy é um site onde você pode adicionar as receitas dos seus pratos mais preferidos. 
Esse é um site completo onde você encontrará os melhores chefes e suas melhores receitas. 
Foodfy é um projeto de conclusão de curso dos alunos do [launch base](https://rocketseat.com.br/launchbase) da [rocketseat](https://rocketseat.com.br/) e 
contém módulos completos de administração de receitas, chefes e usuários.

<h3 align="center">
    <img alt="Foodfy" src="/public/assets/foodfy.jpg"/>
</h3>


## Começando
Para começar a utilizar o Foodfy você precisará de alguns softwares/programas instalados em sua máquina.

### Pré-requisito
A aplicação Foodfy foi desenvolvida
 utilizando JavaScript e banco de dados relacional. 
Lista de softwares necessários para executar aplicação. 

```
Node.js
Postgres
git
```

Esses programas são excecionais para o funcionamento do programa.

### Instalação
- Primeiro passo é você clonar o projeto para um diretório na sua máquina.

- Abra o terminal ou o PowerShell se estiver utilizando o Windows e execute o comando abaixo.

```
git clone https://github.com/Bruno-Goudric/foodfy
```

Agora será necessário executar o arquivo os passos do arquivo `database.sql`.

O primeiro passo deve ser criar um banco de dados. Qualquer gerenciador do postgres pode ser utilizado, pgAdmin, postbird, etc.
A banco pode ser criado pela IDE ou utilizando o comando abaixo:
```sql
create database foodfy;
```

Agora selecione o banco de dados e execute os demais comandos.

```sql
-- create procedure
create function trigger_set_timestamp()
returns trigger as $$
begin
new.updated_at = now();
return new;
end;
$$ language plpgsql;

-- create table users
create table users
(
id serial primary key,
name text not null,
email text unique not null,
password text not null,
reset_token text,
reset_token_expires text,
is_admin boolean default false,
created_at timestamp default(now()),
updated_at timestamp default(now())
);

-- auto updated_at receipts
create trigger trigger_set_timestamp
before update on users
for each row
execute procedure trigger_set_timestamp();

-- session table
create table session (
sid varchar not null collate "default",
sess json not null,
expire timestamp(6) not null
)
with (oids=false);
alter table session 
add constraint session_pkey 
primary key (sid) not deferrable initially immediate;

-- create table files 
create table files 
(
id serial primary key,
name text,
path text not null
);

--create table chefs
create table chefs 
(
id serial primary key,
name text,
file_id integer references files(id),
created_at timestamp default(now()),
updated_at timestamp default(now())
);

-- auto updated_at chefs
create trigger trigger_set_timestamp
before update on chefs
for each row
execute procedure trigger_set_timestamp();

-- create table receipts
create table receipts 
(
id serial primary key,
chef_id integer references chefs(id),
title text,
ingredients text[],
preparation text[],
information text,
user_id integer references users(id),
created_at timestamp default(now()),
updated_at timestamp default(now())
);

-- auto updated_at receipts
create trigger trigger_set_timestamp
before update on receipts
for each row
execute procedure trigger_set_timestamp();

-- create table recipe_files
create table recipe_files
(
  id serial primary key,
  recipe_id integer references receipts(id),
  file_id integer references files(id) on delete cascade
);
```

Por último, será necessário criar um arquivo `.env` no diretório raiz do projeto. Para configurar as opções abaixo:
```
# Geral
APP_URL (url padrão para envio de e-mails, etc);

# Auth
APP_SECRET (senha secreta do cookie da sessão);

# Database
DB_HOST (endereço da máquina onde estará hospedada seu banco de dados);
DB_USER (usuário do banco de dados);
DB_PASS (senha do usuário do banco de dados;
DB_NAME (nome da base de dados)
DB_PORT (porta de conexão com o banco)

# Mail
MAIL_HOST (endereço da máquina de SMTP)
MAIL_PORT (porta para utilização dos emails)
MAIL_USER (usuário que será utilizado)
MAIL_PASS (senha do usuário)
```

Você pode utilizar o arquivo `.env.example` como exemplo para se basear na criação do `.env`.

## Configuração para Desenvolvimento

Agora com o diretório da aplicação já presente na maquina e o banco devidamente instalado e configurado, será necessário executar executar os comandos abaixo no terminal dentro do diretório foodfy.

```sh
yarn install
yarn dev
```

## Populando o banco

Existe um arquivo chamado seeds.js na raiz do diretório, esse arquivo é útil quando há a desejo de popular o sistema com algumas informações fictícias e assim não ter que criar todos os registros.

Para popular o sistema automaticamente, execute o comando abaixo e aguarde.

```
node seed.js
``` 

Será criado um usuário `Administrador` que pode ser utilizado para as operações principais.
```
Usuário: admin@foodfy.com.br
Senha: 123456
```

*Importante*
Caso não queira que sistema seja populado automaticamente com exceção do usuário administrador siga os passos abaixo.

 - Abra o arquivo `seeds.js`
 - Comente as funções `await createUsers();`, `await createChefs();` e `await createRecipes();`.
	O arquivo estavam assim:
    
```js
async function init() {
  await createUsers();
  await createChefs();
  await createRecipes();
  await createAdmin();
}
```
Ficará assim:
```js
async function init() {
  await createAdmin();
// await createUsers();
// await createChefs();
// await createRecipes();
}
```

Agora execute o arquivo `seed.js`
