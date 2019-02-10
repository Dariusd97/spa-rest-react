const Router = require('router');
const db = require('../database');


const router = Router();

router.get('/', async(req, res, next) => {
    try{
        await db['AccessToken'].findAll().then(another => {
            if(another){
                 res.status(200).json({token:another[0]['dataValues']['token']})
            }else{
                res.staus.json({message:"Token doesn't exists!"})
            }
           
        })
    }catch(e){
        console.warn(e)
    }
});

router.put('/:tokenId', async(req, res, next) => {
    try{
    await db['AccessToken'].findByPk(parseInt(req.params.tokenId)).then(token => {
        if (!token) res.status(404).json({ error: 'Resource not found!' });
        token
            .update(req.body)
            .then(another => {
                res.status(200).json({token: another['token']});
            })
            .catch(err => {
                console.warn(err);
                res.status(500).json(err['errors'][0]['type'] + " "+ err['errors'][0]['path'] );
            });
    })
    }catch(err){
        console.warn(err);
        res.status(500).json({message : 'Server error!'})
    }
});

module.exports=router