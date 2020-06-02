import { v4 } from "https://deno.land/std/uuid/mod.ts";
import { Client } from "https://deno.land/x/mysql/mod.ts";
import { Product } from '../types.ts'


//環境変数
const hostname = Deno.env.get("MYSQL_HOST_ENV") as string
const username = Deno.env.get("MYSQL_USERNAME_ENV") as string
const db = Deno.env.get("MYSQL_DB_ENV") as string
const password = Deno.env.get("MYSQL_PASSWORD_ENV") as string
const port = parseInt(Deno.env.get("MYSQL_PORT_ENV") as string) //環境変数はstringなので　string to numberにする

//mysqlに接続する
const client = await new Client().connect({
  hostname: hostname,
  username: username,
  db: db,
  password: password,
  port:port
});

// @desc    Get all products
// @route   GET /api/v1/products
const getProducts = async({ response }: { response: any }) => {

  try{
    const data = await client.query(`SELECT id , name , description, price  FROM Product;`)
    //判定が微妙な感じ・・・
    if ( data.toString() ===""){
      response.status = 404
      response.body = {
        success: false,
        msg: 'No Product found'
      }
    } else {
      response.body = {
          success: true,
          data: data
      }
    }
  } catch(error){
    response.status = 500
    response.body = {
      success: false,
      msg: 'Server Error'
    }
  }
}

// @desc    Get single product
// @route   GET /api/v1/products/:id
const getProduct = async({ params ,response }: { params:{id :string },response: any }) => {
  //https://deno-mysql.netlify.app/index.htmlより引用
  //const queryWithParams = await client.query(
  //  "select ??,name from ?? where id = ?",
  //  ["id", "Product", params.id]
  //);
  //?と??の違いがわからない・・・とりあえず?で運用する

  try{
    const data = await client.query(
      "select id,name,description,price from Product where id = ? ",
      [params.id]
    );
  
    //判定が微妙な感じ・・・
    if ( data.toString() ===""){
      response.status = 404
      response.body = {
        success: false,
        msg: 'No Product found'
      }
    } else {
      response.status = 200
      response.body = {
        success: true,
        data:data
      }
    }
  } catch (error){
    response.status = 500
    response.body = {
      success: false,
      msg: 'Server Error'
    }
  } 
}

// @desc    Add product
// @route   POST /api/v1/products
/*
  json sample
  {
 	"name": "Product1_add",
    "description": "description1_add",
    "price": 200
  }
*/
const addProduct = async ({ request, response }: { request: any , response: any }) => {
  const body = await request.body()

  if (!request.hasBody){
    response.status = 400
    response.body = {
      success: false,
      msg: 'No Data'
    } 
  }else {

    //バリデーション・・・省略
    const product: Product = body.value
    product.id = v4.generate()

    try{
      let result = await client.execute(`
      INSERT INTO Product
        (id,name, description, price)
        VALUES
        (?,?,?,?);
        `, [
          product.id,
          product.name,
          product.description,
          product.price
      ]);
      //成功時には{ affectedRows: 1, lastInsertId: 0 }が返ってくる。もう少し欲しいけど・・・
      if (result.affectedRows ===1 ){
        response.status = 200
        response.body = {
          success: true,
          data: product
        }
      } else {
        response.status = 400
        response.body = {
          success: false,
          msg: 'Insert false'
        } 
      }

    } catch(error){
      response.status = 500
      response.body = {
        success: false,
        msg: 'Server Error'
      } 
  
    }  
  }
}


// @desc    Update product
// @route   PUT /api/v1/products/:id
const updateProduct = async({ params, request, response }: { params: { id: string }, request: any, response: any }) => {
  const body = await request.body()

  if (!request.hasBody){
    response.status = 400
    response.body = {
      success: false,
      msg: 'No Data'
    } 
  }else {

    //バリデーション・・・省略
    const product: Product = body.value
    product.id = params.id

    try{
      let result = await client.execute(`
      UPDATE Product
      SET
      name = ?,
      description = ?,
      price = ?
      WHERE id = ?;
      `, [
          product.name,
          product.description,
          product.price,
          product.id,
      ]);

      //成功時には{ affectedRows: 1, lastInsertId: 0 }が返ってくる。もう少し欲しいけど・・・
      if (result.affectedRows ===1 ){
        response.status = 200
        response.body = {
          success: true,
          data: product
        }
      } else {
        response.status = 404
        response.body = {
          success: false,
          msg: 'No product found'
        } 
      }

    } catch(error){
      response.status = 500
      response.body = {
        success: false,
        msg: 'Server Error'
      } 
    }  
  }
}

// @desc    Delete product
// @route   DELETE /api/v1/products/:id
const deleteProduct = async({ params, response }: { params: { id: string }, response: any }) => {

  if (params.id ===""){
    response.status = 400
    response.body = {
      success: false,
      msg: 'No Data'
    } 
  }else {

    //バリデーション・・・省略
    try{
      let result = await client.execute(`
      DELETE FROM Product
      WHERE id = ?;
      `, [
        params.id,
      ]);

      //成功時には{ affectedRows: 1, lastInsertId: 0 }が返ってくる。もう少し欲しいけど・・・
      if (result.affectedRows ===1 ){
        response.status = 200
        response.body = {
          success: true,
          msg: 'Product removed'
        }
      } else {
        response.status = 404
        response.body = {
          success: false,
          msg: 'No product found'
        } 
      }

    } catch(error){
      response.status = 500
      response.body = {
        success: false,
        msg: 'Server Error'
      } 
    }  
  }
}


await client.close()
export {getProducts ,getProduct,addProduct,updateProduct ,deleteProduct}
