const express = require("express");
const connection = require("../storage/db")
const router = express.Router();


router.post("/", async (req, res) => {
    try {
        const db = await connection;
        const { name, phone, salary, hire_date } = req.body;        
        const sql = `INSERT INTO cheffs (name, phone, salary, hire_date) VALUES (?,?,?,?)`
        await db.execute(sql,[name, phone, salary, hire_date])
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
        const count = await db.query(`SELECT COUNT(cheff_id) as count FROM cheffs`, []);
            res.status(200).send({count: count[0][0].count})
    } catch (error) {
        console.log(error)
        res.status(500).send({error})        
    }
})

router.get("/", async (req, res) => {
    console.log("/Get Cheffs")
    try {
        const db = await connection;
        
        let sql;
        if (req.query.q) {
            sql = `SELECT * FROM cheffs WHERE name LIKE ? `
            const [rows, fields] = await db.execute(sql, [req.query.q+"%"])
            const count = await db.query(`SELECT COUNT(cheff_id) as count FROM cheffs`, []);
            res.status(200).send({pages: Math.ceil(count[0][0].count/limit), rows})
            
        } else if(req.query.limit && req.query.page) {
            const {limit, page} = req.query;
            sql = `SELECT * FROM cheffs ORDER BY cheff_id LIMIT ? OFFSET ?;`
            let [rows, fields] = await db.execute(sql,[limit, ((parseInt(page) - 1 )* parseInt(limit)  ).toString()])
            const count = await db.query(`SELECT COUNT(cheff_id) as count FROM cheffs`, []);
            res.status(200).send({pages: Math.ceil(count[0][0].count/limit), rows})  
        }
        
    } catch (error) {
        res.status(500).send({error})
    }
})

router.patch("/:cheff_id", async (req, res) => {
    try {
        const db = await connection;
        const { name, phone, salary, hire_date } = req.body;    
        const {cheff_id} = req.params

        const sql = `UPDATE cheffs
                    SET name=?,
                        phone=?,
                        salary=?,
                        hire_date=?
                    WHERE
                        cheff_id=?`
        await db.execute(sql, [name,phone, salary, hire_date, cheff_id])
        res.status(200).send()        
    } catch (error) {
        console.log(error)
        res.status(500).send(error)
    }
})

router.delete("/:cheff_id", async (req, res) => {
    try {
        const db = await connection;
        console.log("Delete Cheff by id")
        const sql = `DELETE FROM cheffs WHERE cheff_id = ?`
        await db.execute(sql, [req.params.cheff_id])
        res.status(200).send()        
    } catch (error) {
        res.status(500).send(error)
    }
})

module.exports = router;