const Router = require('router');
const Joi = require('joi');
const db = require('../database');
const os = require('os');

const router = Router();

// get all users
router.get('/', async(req, res, next) => {
    try{
        await db['User'].findAndCountAll({ attributes: ['username', 'firstName', 'lastName'] }).then(users => {
            if(users){
                res.status(200).json({
                    count: users.count,
                    rows : users.rows
                });
            }else{
                res.status(404).json({message:"Resource not found!"})
            }
        })
    }catch( e){
        console.warn(e);
        res.status(500).json({
            message : 'Server error!'
        })
    }
});

// get one user
router.get('/:userId', async(req, res, next) => {
    try{
        await db['User'].findByPk(parseInt(req.params.userId)).then(users => {
            if (users)  {
                res.status(200).json({ username: users.username, firstName: users.firstName, lastName: users.lastName });
            } else {
                res.status(404).json({ error: 'Resource not found!' });
            }
        })
    }catch(e){
        console.warn(e);
        res.status(500).json({
            message : 'Server error!'
        })
    }
});


router.post('/', async(req, res, next) => {
    try {
        if (req.query.bulk && req.query.bulk == "on") {
            for(var i = 0; i<req.body.length; i++){
                const { error } = validateUser(req.body[i]);
                if(error){
                    return res.status(400).json(error.details[0].message);
                }
            }
            
            /*
            let user = req.body[0]['username'];
            for(var k=1;k<=req.body.length;k++){
                if(user == req.body[k]['username']){
                    return res.status(400).json({message:"Email is not unique"})
                }
            }
            
            db['User'].findAll({ attributes: ['username']}).then(another => {
                for(var n=0;n<=req.body.length;n++){
                    if(another['dataValues']['username'] == req.body[n]['username']){
                        return res.status(400).json({message:"Email is not unique"})
                    }
                }
                
            })
            */
            for(var j = 0;j<req.body.length;j++){
                db['User'].findOne({where:{username:req.body[j]['username']}}).then(another =>{
                    db['Favorite'].create({UserIdUser:another['dataValues']['idUser']})
                })
            }
            db['User'].bulkCreate(req.body)
            res.status(201).json({ message: "Resource created!" });
        }else {
            const { error } = validateUser(req.body);
            if(error){
                return res.status(400).json(error.details[0].message);
            }
            await db['User']
                .build(req.body)
                .save()
                .then(another => {
                    db['Favorite'].create({UserIdUser:another['dataValues']['idUser']})
                    res.status(201).json({ username: another['username'], firstName: another["firstName"], lastName: another["lastName"] });
                    
                })
        }
    }
    catch (err) {
        console.warn(err);
        res.status(500).json({ message: 'Server error!' });
    }
});

router.post('/:userId/favorites/artists', async(req, res, next) => {
    try {
        let user = await db['User'].findById(req.params.userId)
		if (user){
		    await db['Favorite'].findOne({ where: {UserIdUser: req.params.userId} }).then(favorite =>{
		           let artist = req.body
		           artist.FavoriteIdFavorite=favorite['dataValues']['idFavorite'];
		           db['Artist'].create(artist)
		           res.status(201).json({message: 'created'})
		    })
		
		}
		else{
			res.status(404).json({message : 'not found'})
		}
    }
    catch (err) {
        console.warn(err);
        res.status(500).json({ message: 'Server error!' });
    }
});

router.post('/:userId/favorites/artists/:artistId/paintings', async(req, res, next) => {
    try {
        let user = await db['User'].findById(req.params.userId)
		if (user){
            await db['Favorite'].findOne({ where: {UserIdUser: req.params.userId} }).then(favorite =>{
                db['Artist'].findOne({where:{idArtist:req.params.artistId}}).then(artist => {
                    let paint = req.body
		            paint.ArtistIdArtist = artist['dataValues']['idArtist']
		            db['Painting'].create(paint)
                }).catch(e => {
                    console.warn(e);
		            return res.status(500).json({message:"Server error!"})
		        })
		    }).catch(e => {
		        console.warn(e);
		        return res.status(500).json({message:"Server error!"})
		    })
		    res.status(201).json({message: 'created'})
		}else{
			res.status(404).json({message : 'not found'})
		}
    }
    catch (err) {
        console.warn(err);
        res.status(500).json({ message: 'Server error!' });
    }
});

router.put('/:userId', async(req, res, next) => {
    try{
    await db['User'].findByPk(parseInt(req.params.userId)).then(user => {
        if (!user) res.status(404).json({ error: 'Resource not found!' });
        const { error } = validateUser(user['dataValues']);
        if(error){
            return res.status(400).json(error.details[0].message);
        }
        user
            .update(req.body)
            .then(another => {
                res.status(200).json({username: another['username'], password: another['password'], firstName: another['firstName'], lastName: another['lastName']});
            })
            .catch(err => {
                console.warn(err);
                res.status(500).json(err['errors'][0]['type'] + " "+ err['errors'][0]['path'] );
            });
        }).catch(err => {
            console.warn(err);
            res.status(500).json({
                message : 'Server error!'
            });
        });
    }catch(err){
        console.warn(err);
        res.status(500).json({message : 'Server error!'})
    }
});

router.delete('/:userId', async(req, res, next) => {
    await db['User'].findByPk(parseInt(req.params.userId))
        .then(another => {
            if (another) {
                let copieUser = another;
                another.destroy()
                db['Favorite'].findOne({where:{UserIdUser:copieUser['dataValues']['idUser']}}).then(fav => {
                    let copieFav = fav;
                    fav.destroy()
                    db['Artist'].findOne({where:{FavoriteIdFavorite:copieFav['dataValues']['idFavorite']}}).then(artist => {
                            let copieArt = artist
                            artist.destroy()
                        db['Painting'].findOne({where:{ArtistIdArtist:copieArt['dataValues']['idArtist']}}).then(paint => {
                            paint.destroy();
                            
                        })
                    })
                })
                
                res.status(202).json({ Message: 'Resource deleted!' });
            }
            else {
                res.status(404).json({ error: 'Resource not found!' })
            }
        }).catch(err => {
            console.warn(err);
            res.status(500).json({
                message : 'Server error!'
            });
        });
});

router.delete('/:userId/favorites/artists/:artistId', async(req, res, next) => {
    try {
        let user = await db['User'].findById(req.params.userId)
		if (user){
		    await db['Favorite'].findOne({ where: {UserIdUser: req.params.userId} }).then(favorite =>{
		        console.warn(favorite['dataValues']['idFavorite'])
		           db['Artist'].findOne({where:{FavoriteIdFavorite:favorite['dataValues']['idFavorite']}}).then(artist => {
		               db['Painting'].findOne({where:{ArtistIdArtist:artist['dataValues']['idArtist']}}).then(paint =>{
		                   if(paint){
		                        paint.destroy();
		                        
		                        res.status(202).json({message: 'Resource deleted!'})
		                   }else{
		                       res.status(404).json({message:"Resource not found!"})
		                   }
		                   artist.destroy()
		                    
		                })
		           })
		   })
		}else{
			res.status(404).json({message : 'not found'})
		}
    }catch (err) {
        console.warn(err);
        res.status(500).json({ message: 'Server error!' });
    }
});

router.get('/:userId/favorites/artists', async(req, res, next) => {
    try {
        let user = await db['User'].findById(req.params.userId);
        if(user){
            console.warn(user['dataValues']['idUser'])
            let favorite = await db['Favorite'].findOne({where:{UserIdUser:user['dataValues']['idUser']}});
            if(favorite){
                await db['Artist'].findAndCountAll({
                    where:{FavoriteIdFavorite: favorite['dataValues']['idFavorite']},
                    attributes:['name','link','idArtist']
                }).then(another=>{
                    res.status(200).json({
                        count: another.count,
                        artists:another.rows
                    });
                })
                
            }else{
                res.status(404).json({message: 'Resource not found!'});
            }
        }else{
            res.status(404).json({message:'Resource not found!'});
        }
    }
    catch (e) {
        console.warn(e);
        res.status(500).json({ message: "Server error!" });
    }
})

router.get('/:userId/favorites/artists/:artistId', async(req, res, next) => {
    try {
        let user = await db['User'].findById(req.params.userId);
        if(user){
            let favorite = await db['Favorite'].findOne({where:{UserIdUser:user['dataValues']['idUser']}});
            if(favorite){
                let artist = await db['Artist'].findOne({
                    where : {FavoriteIdFavorite:favorite['dataValues']['idFavorite'],idArtist:req.params.artistId}
                }).then(another =>{
                        res.status(200).json(another);
                    }
                )
                res.status(200).json(artist);
            }else{
            res.status(404).json({message: 'Resource not found!'});
        }
        }else{
            res.status(404).json({message:'Resource not found!'});
        }
    }
    catch (e) {
        console.warn(e);
        res.status(500).json({ message: "Server error!" });
    }
})

router.get('/:userId/favorites/artists/:artistId/paintings', async(req, res, next) => {
    try {
        let user = await db['User'].findById(req.params.userId);
        if(user){
            let favorite = await db['Favorite'].findOne({where:{UserIdUser:user['dataValues']['idUser']}});
            if(favorite){
                let artist = await db['Artist'].findOne({
                     where : {FavoriteIdFavorite:favorite['dataValues']['idFavorite'],idArtist:req.params.artistId}
                });
                if(artist){
                    await db['Painting'].findAndCountAll({
                        where : {ArtistIdArtist:artist['dataValues']['idArtist']},
                        attributes : ['name']
                }).then(
                    another =>{
                        res.status(200).json({
                            count: another.count,
                            paintings: another.rows
                        });
                    }
                )
                }else{
                    res.status(404).json({message:'Resource not found!'});
                }
                
            }else{
                res.status(404).json({message: 'Resource not found!'});
            }
        }else{
            res.status(404).json({message:'Resource not found!'});
        }
    }
    catch (e) {
        console.warn(e);
        res.status(500).json({ message: "Server error!" });
    }
})

router.get('/:userId/favorites/artists/:artistId/paintings/:paintingId', async(req, res, next) => {
    try {
        let user = await db['User'].findById(req.params.userId);
        if(user){
            let favorite = await db['Favorite'].findOne({where:{UserIdUser:user['dataValues']['idUser']}});
            if(favorite){
                let artist = await db['Artist'].findOne({
                    where : {FavoriteIdFavorite:favorite['dataValues']['idFavorite'],idArtist:req.params.artistId}
                });
                if(artist){
                    await db['Painting'].findOne({
                        where : {ArtistIdArtist:artist['dataValues']['idArtist'],
                            idPainting:req.params.paintingId
                        },
                        attributes : ['name']
                }).then(
                    another =>{
                        res.status(200).json(another);
                    }
                )
                }else{
                    res.status(404).json({message:'Resource not found!'});
                }
                
            }else{
                res.status(404).json({message: 'Resource not found!'});
            }
        }else{
            res.status(404).json({message:'Resource not found!'});
        }
    }
    catch (e) {
        console.warn(e);
        res.status(500).json({ message: "Server error!" });
    }
})

function validateUser(user) {
    const schema = {
        idUser:Joi,
        username: Joi.string().min(1).max(30).required().email({ minDomainAtoms: 2 }),
        password: Joi.string().min(1).max(30).required(),
        firstName: Joi.string().min(1).max(30).required(),
        lastName: Joi.string().min(1).max(30).required()
    }
    return Joi.validate(user, schema);
}

module.exports = router;
