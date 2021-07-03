const express = require("express");
const connection = require("../storage/db")
const router = express.Router();


router.post("/", async (req, res) => {
    try {
        const db = await connection;
        const { name, phone, salary, hire_date } = req.body;        
        const sql = `INSERT INTO waiters (name, phone, salary, hire_date) VALUES (?,?,?,?)`
        await db.execute(sql,[name, phone, salary, hire_date])
        res.status(200).send()
    } catch (error) {
        console.log(error)
        res.status(500).send(error)
    }
})

router.get("/", async (req, res) => {
    console.log("/Get Waiters")
    try {
        const db = await connection;
        
        let sql;
        if (req.query.q) {
            sql = `SELECT * FROM waiters WHERE name LIKE ? `
            const [rows, fields] = await db.execute(sql, [req.query.q+"%"])
            if(rows.length == 0)
                res.status(204).send()
            else
                res.status(200).send(rows)
        } else if(req.query.limit && req.query.page) {
            const {limit, page} = req.query;
            sql = `SELECT * FROM waiters ORDER BY waiter_id LIMIT ? OFFSET ?;`
            const [rows, fields] = await db.execute(sql,[limit, (parseInt(page) * parseInt(limit) ).toString()])
            res.status(200).send(rows)    
        }
        
    } catch (error) {
        res.status(500).send({error})
    }
})

router.patch("/:waiter_id", async (req, res) => {
    try {
        const db = await connection;
        const { name, phone, salary, hire_date } = req.body;    
        const {waiter_id} = req.params

        const sql = `UPDATE waiters
                    SET name=?,
                        phone=?,
                        salary=?,
                        hire_date=?
                    WHERE
                        waiter_id=?`
        await db.execute(sql, [name,phone, salary, hire_date, waiter_id])
        res.status(200).send()        
    } catch (error) {
        console.log(error)
        res.status(500).send(error)
    }
})

router.delete("/:waiter_id", async (req, res) => {
    try {
        const db = await connection;
        console.log("Delete Waiter by id")
        const sql = `DELETE FROM waiters WHERE waiter_id = ?`
        await db.execute(sql, [req.params.waiter_id])
        res.status(200).send()        
    } catch (error) {
        res.status(500).send(error)
    }
})

module.exports = router;