const express = require("express");
const connection = require("../storage/db")
const router = express.Router();


router.post("/", async (req, res) => {
    try {
        const db = await connection;
        const { meals, waiter_id, cust_id } = req.body;        
        let total_amount = meals.reduce((a,b)=> a.price + b.price)
        const date = new Date().toISOString().slice(0, 19).replace('T', ' ');
        
        const sql = `INSERT INTO orders (meals, waiter_id, cust_id, total_amount, quantity, order_time) VALUES (?,?,?,?,?,?)`
        await db.execute(sql,[JSON.stringify(meals), waiter_id, cust_id, total_amount, meals.length, date ])
        res.status(200).send()
    } catch (error) {
        console.log(error)
        res.status(500).send(error)
    }
})

router.get("/count", async (req, res) => {
    console.log("/count")
    try {
        const db = await connection;
        const count = await db.query(`SELECT COUNT(order_id) as count FROM orders`, []);
            res.status(200).send({count: count[0][0].count})
    } catch (error) {
        console.log(error)
        res.status(500).send({error})        
    }
})

router.get("/", async (req, res) => {
    console.log("/Get orders")
    try {
        const db = await connection;
        
        let sql;
        // if (req.query.q) {
        //     sql = `SELECT * FROM orders WHERE name LIKE ? `
        //     const [rows, fields] = await db.execute(sql, [req.query.q+"%"])
        //     if(rows.length == 0)
        //         res.status(204).send()
        //     else
        //         res.status(200).send(rows)
        // } else
         if(req.query.limit && req.query.page) {
            const {limit, page} = req.query;
            sql = `SELECT * FROM orders ORDER BY order_id LIMIT ? OFFSET ?;`
            let [rows, fields] = await db.execute(sql,[limit, ((parseInt(page) - 1 )* parseInt(limit)  ).toString()])
            const count = await db.query(`SELECT COUNT(order_id) as count FROM orders`, []);
            res.status(200).send({pages: Math.ceil(count[0][0].count/limit), rows})  
        }
        
    } catch (error) {
        res.status(500).send({error})
    }
})

// router.patch("/:order_id", async (req, res) => {
//     try {
//         const db = await connection;
//         const { name, phone, salary, hire_date } = req.body;    
//         const {order_id} = req.params

//         const sql = `UPDATE orders
//                     SET name=?,
//                         phone=?,
//                         salary=?,
//                         hire_date=?
//                     WHERE
//                         order_id=?`
//         await db.execute(sql, [name,phone, salary, hire_date, order_id])
//         res.status(200).send()        
//     } catch (error) {
//         console.log(error)
//         res.status(500).send(error)
//     }
// })

router.delete("/:order_id", async (req, res) => {
    try {
        const db = await connection;
        console.log("Delete Order by id")
        const sql = `DELETE FROM orders WHERE order_id = ?`
        await db.execute(sql, [req.params.order_id])
        res.status(200).send()        
    } catch (error) {
        res.status(500).send(error)
    }
})

module.exports = router;