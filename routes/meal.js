const express = require("express");
const connection = require("../storage/db")
const router = express.Router();


router.post("/", async (req, res) => {
    try {
        const db = await connection;
        const { meal_name, price, cheff_id } = req.body;      
        console.log({meal_name, price, cheff_id})
        const sql = `INSERT INTO meals (meal_name, price, cheff_id) VALUES (?,?,?)`
        await db.execute(sql,[meal_name, price, cheff_id])
        res.status(200).send()
    } catch (error) {
        console.log(error)
        res.status(500).send(error)
    }
})

router.get("/", async (req, res) => {
    console.log("/Get Meals")
    try {
        const db = await connection;
        
        let sql;
        if (req.query.q) {
            sql = `SELECT * FROM meals WHERE meal_name LIKE ? `
            const [rows, fields] = await db.execute(sql, [req.query.q+"%"])
            const count = await db.query(`SELECT COUNT(meal_id) as count FROM meals`, []);
            res.status(200).send({pages: Math.ceil(count[0][0].count/limit), rows})
        } else if(req.query.limit && req.query.page) {
            const {limit, page} = req.query;
            sql = `SELECT * FROM meals ORDER BY meal_id LIMIT ? OFFSET ?;`
            let [rows, fields] = await db.execute(sql,[limit, ((parseInt(page) - 1 )* parseInt(limit)  ).toString()])
            const count = await db.query(`SELECT COUNT(meal_id) as count FROM meals`, []);
            res.status(200).send({pages: Math.ceil(count[0][0].count/limit), rows})  
        }
        
    } catch (error) {
        res.status(500).send({error})
    }
})

router.patch("/:meal_id", async (req, res) => {
    try {
        const db = await connection;
        const { meal_name, price, cheff_id } = req.body;    
        const {meal_id} = req.params

        const sql = `UPDATE meals
                    SET meal_name=?,
                        price=?,
                        cheff_id=?                        
                    WHERE
                        meal_id=?`
        await db.execute(sql, [meal_name, price, cheff_id, meal_id])
        res.status(200).send()        
    } catch (error) {
        console.log(error)
        res.status(500).send(error)
    }
})

router.delete("/:meal_id", async (req, res) => {
    try {
        const db = await connection;
        console.log("Delete Meal by id")
        const sql = `DELETE FROM meals WHERE meal_id = ?`
        await db.execute(sql, [req.params.meal_id])
        res.status(200).send()        
    } catch (error) {
        res.status(500).send(error)
    }
})

module.exports = router;