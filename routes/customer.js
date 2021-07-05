const express = require("express");
const connection = require("../storage/db")
const router = express.Router();


router.post("/", async (req, res) => {
    try {
        const db = await connection;
        const { name, phone, address } = req.body;
        const sql = `INSERT INTO customers (name, phone, address) VALUES (?,?,?)`
        await db.execute(sql,[name, phone, address])
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
        const count = await db.query(`SELECT COUNT(cust_id) as count FROM customers`, []);
            res.status(200).send({count: count[0][0].count})
    } catch (error) {
        console.log(error)
        res.status(500).send({error})        
    }
})

router.get("/", async (req, res) => {
    console.log("/Get Customers")
    try {
        const db = await connection;
        const {limit, page} = req.query;
        
        let sql;
        if (req.query.q) {
            sql = `SELECT * FROM customers WHERE name LIKE ? `
            const [rows, fields] = await db.execute(sql, [req.query.q+"%"])
            const count = await db.query(`SELECT COUNT(cust_id) as count FROM customers`, []);
            res.status(200).send({pages: Math.ceil(count[0][0].count/limit), rows})
        } else if(req.query.limit && req.query.page) {
            sql = `SELECT * FROM customers ORDER BY cust_id LIMIT ? OFFSET ?;`
            let [rows, fields] = await db.execute(sql,[limit, ((parseInt(page) - 1 )* parseInt(limit)  ).toString()])
            const count = await db.query(`SELECT COUNT(cust_id) as count FROM customers`, []);
            res.status(200).send({pages: Math.ceil(count[0][0].count/limit), rows})   
        }
        
    } catch (error) {
        console.log(error)
        res.status(500).send({error})
    }
})

router.patch("/:cust_id", async (req, res) => {
    try {
        const db = await connection;
        const { name, phone, address } = req.body;    
        const {cust_id} = req.params

        const sql = `UPDATE customers
                    SET name=?,
                        phone=?,
                        address=?                        
                    WHERE
                        cust_id=?`
        await db.execute(sql, [name,phone, address, cust_id])
        res.status(200).send()        
    } catch (error) {
        console.log(error)
        res.status(500).send({error})
    }
})

router.delete("/:cust_id", async (req, res) => {
    try {
        const db = await connection;
        console.log("Delete Customer by id")
        const sql = `DELETE FROM customers WHERE cust_id = ?`
        await db.execute(sql, [req.params.cust_id])
        res.status(200).send()        
    } catch (error) {
        res.status(500).send(error)
    }
})

module.exports = router;