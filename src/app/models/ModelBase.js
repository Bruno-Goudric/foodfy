const db = require('../../config/db');

function find(filter, table, params = {})
{
  let query = ''; //`select * from ${table}`;   
  try 
  {
    const { orderBy, limit, offset, count, inLike } = params;

    if (filter)
    {
      Object.keys(filter).map(key =>
      {
        query += ` ${key}`;

        Object.keys(filter[key]).map(field =>
        {
          if (inLike)
            query += ` lower(${field}) like '%${filter[key][field].toLowerCase()}%'`;
          else
            query += ` ${field} = '${filter[key][field]}'`;
        });

      });
    }

    query = count ? `select *, (select count(1) from ${table} ${query}) as _countTable from ${table} ${query}` :
                    `select * from ${table} ${query}`;  

    query += orderBy ? ` order by ${orderBy}` : '';

    query += limit > 0 ? ` limit ${limit}` : '';

    query += ( offset && limit ) ? ` offset ${limit}` : '';
    return db.query(query);

  } catch (error) 
  {
    console.error(error);
    console.error(query);
  }
}

const ModelBase =
{
  init({ table })
  {
    if (!table)
      throw new Error('Table is required');

    this.table = table;
  },

  async findOne(filter)
  {
    const results = await find(filter, this.table);
    return results.rows[0];
  },

  async findById(id)
  {
    const results = await find({ where: { id } }, this.table);
    return results.rows[0];
  },

  async findAll(filter, params)
  {
    const results = await find(filter, this.table, params);
    return results.rows;
  },

  async create(fields)
  {
    let query = '';
    try 
    {
      let keys = [];
      let values = [];

      Object.keys(fields).map(key =>
      {
        if (key != 'id')
        {
          keys.push(key);
          if (Array.isArray(fields[key]))
          {
            let arr = fields[key].map(item => `'${item}'`).join(', ');
            values.push(`array[${arr}]`);
          }
          else
            values.push(`'${fields[key]}'`);
        }
      });

      query = `insert into ${this.table} (${keys.join(',')}) values (${values.join(',')}) returning id`;

      const results = await db.query(query);
      return results.rows[0].id;

    } catch (error) 
    {
      console.error(query, error);
    }
  },

  async update(id, fields)
  {
    let query = '';
    try 
    {
      let update = [];

      Object.keys(fields).map((key) =>
      {
        if (key != 'id')
        {
          if (Array.isArray(fields[key]))
          {
            let arr = fields[key].map(item => `'${item}'`).join(', ');
            update.push(`${key} = array[${arr}]`);
          }
          else
          {
            if (fields[key] == null) 
              update.push(`${key} = ${fields[key]}`);
            else
              update.push(`${key} = '${fields[key]}'`);
          }
        }
      });

      query = `update ${this.table} set ${update.join(', ')} where id = ${id}`;

      return await db.query(query);

    } catch (error)
    {
      console.error(query);
      console.error(error);
    }
  },

  async delete(id)
  {
    let sqlStatement = `delete from ${this.table} where id = $1`;
    try
    {
      return await db.query(sqlStatement, [id]);
    } catch (error)
    {
      console.error(sqlStatement, id);
      console.error(error);
    }
  },
}

module.exports = ModelBase;