const Router = require('router');

const db = require('../database');

const router = Router();

router.get('/', async(req, res, next) => {
    try{
        await db['Painting'].findAndCountAll({ attributes: ['name'] }).then(another => {
            if(another){
                res.status(200).json({
                    count: another.count,
                    paintings: another.rows
                });
            }else{
                res.status(404).json({message:"Resource not found!"})
            }
        })
    }catch(e){
        console.warn(e)
        res.status(500).json({message:"Server error!"})
    }
});

router.get('/:paintingId', async(req, res, next) => {
    try{
        await db['Painting'].findByPk(parseInt(req.params.paintingId)).then(painting => {
            if (painting){
                res.status(200).json({ name: painting.name });
            } 
            else {
                res.status(404).json({ error: 'Resource not found!' });
            }
        })
    }catch(e){
        console.warn(e)
        res.status(500).json({message:"Server error!"})
    }
});

module.exports = router;
