const Router = require('router');

const db = require('../database');

const router = Router();

router.get('/', async(req, res, next) => {
    try{
        await db['Artist'].findAndCountAll({ attributes: ['name'] }).then(another => {
            if(another){
                res.status(200).json({
                    count: another.count,
                    artists: another.rows
                });
            }else{
                res.status(404).json({message:"Resource not found!"})
            }
        })
    }catch(e){
        console.warn(e);
        res.status(500).json({message:"Server error!"})
    }
});

router.get('/:artistId', async(req, res, next) => {
    try{
        await db['Artist'].findByPk(parseInt(req.params.artistId)).then(artist => {
            if (artist){
                res.status(200).json({ name: artist.name });
            } else {
                res.status(404).json({ error: 'Resource not found!' });
                }
        })
    }catch(e){
        console.warn(e)
        res.status(500).json({message:"Server error!"})
    }
});

module.exports = router;
