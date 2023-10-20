const {PrismaClient} = require('@prisma/client');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const prisma = new PrismaClient();

async function hashPassword(plaintextPassword) {
    const hash = await bcrypt.hash(plaintextPassword, 10);
    return hash;
}

async function comparePassword(plaintextPassword, hash) {
    const result = await bcrypt.compare(plaintextPassword, hash);
    return result;
}

module.exports = {
    registerUser: async (req, res) => {
        try {
            const hashed = await hashPassword(req.body.password);
            console.log(hashed);

            const user = await prisma.users.create({
                data: {
                    name: req.body.name,
                    email: req.body.email,
                    password: hashed
                }
            });
    
            const profile = await prisma.profiles.create({
                data: {
                    identity_number: req.body.identity_number,
                    identity_type: req.body.identity_type,
                    address: req.body.address,
                    user: {
                        connect: {id: user.id}
                    }
                }
            });
    
            return res.json({
                user,
                profile
            })
        } catch (error) {
            return res.json({
                data: error,
                message: error.message
            })    
        }
    },

    getUser: async (req, res) => {
        try {            
            const userData = await prisma.users.findMany();
            return res.json({
                data: userData
            });
        } catch (error) {
            return res.json({
                data: error,
                message: error.message
            })                
        }
    },

    getUserById: async (req, res) => {
        try {            
            const userData = await prisma.users.findUnique({
                where: {
                    id: parseInt(req.params.userId)
                }
            })
    
            const profileData = await prisma.profiles.findUnique({
                where: {
                    user_id: parseInt(req.params.userId)
                }
            })
    
            return res.status(200).json({
                data: userData,
                profile: profileData
            });
        } catch (error) {
            return res.status(405).json({
                data: error,
                message: error.message
            })                
        }
    },

    updateUserPw: async (req, res) => {
        try {
            const data = await prisma.users.findUnique({
                where: {
                    id: parseInt(req.params.userId)
                }
            });
    
            const lastpw = req.body.lastpw;
            if(!lastpw){
                return res.status(400).json({
                    data: "Masukkan password"
                })
            }
            
            const hashpw = data.password;
            const result = await comparePassword(lastpw, hashpw)
            if(result){
                const newHashedPw = await hashPassword(req.body.newpw);
                const updatePw = await prisma.users.update({
                    where: {
                        id: parseInt(req.params.userId)
                    },
                    data: {
                        password: newHashedPw
                    }
                })
                return res.status(200).json({
                    data: updatePw
                });
            }
            return res.status(401).json({
                data: "Password salah"
            })
        } catch (error) {
            return res.status(405).json({
                data: error,
                message: error.message
            })    
        }
    },
    
    updateUser: async (req, res) => {
        try {
            const userData = await prisma.users.update({
                where: {
                    id: parseInt(req.params.userId)
                },
                data: {
                    name: req.body.name,
                    email: req.body.email
                }
            })
    
            const profileData = await prisma.profiles.update({
                where: {
                    user_id: parseInt(req.params.userId)
                },
                data: {
                    identity_number: req.body.identity_number,
                    identity_type: req.body.identity_type,
                    address: req.body.address
                } 
            })
    
            return res.status(200).json({
                data: userData,
                profile: profileData
            });

        } catch (error) {
            return res.status(405).json({
                data: error,
                message: error.message
            })                
        }
    },
    
    deleteUser: async (req, res) => {
        const userId = parseInt(req.params.userId);     
        try {          
            const deleteUser = await prisma.users.delete({
                where: {
                    id: userId
                }
            });
            return res.status(200).json({
                status: "deleted",
                data: deleteUser
            });
        } catch (error) {
            return res.json({
                data: error,
                message: error.message
            })    
        }
    },

    loginUser: async (req, res) => {
        const findUser = await prisma.users.findFirst({
            where: {
                email: req.body.email
            }
        })

        if(!findUser){
            return res.status(404).json({
                error: 'User not exist'
            });
        }

        if(bcrypt.compareSync(req.body.password, findUser.password)){
            const token = jwt.sign(
            {
                id: findUser.id
            },
            'secret_key', 
            {
                expiresIn: '6h'
            })

            return res.status(200).json({
                data: {
                    token
                }
            })
        }

        return res.status(403).json({
            error: 'Invalid credentials'
        })
    },

    getProfile: async(req, res) => {
        const user = await prisma.users.findUnique({
            where: {
                id: res.user.id
            }
        })
        const profile = await prisma.profiles.findUnique({
            where: {
                user_id: res.user.id
            }
        })
        return res.status(200).json({
            user,
            profile
        })
    }
}

