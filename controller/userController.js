const {PrismaClient} = require('@prisma/client');

const prisma = new PrismaClient();

module.exports = {
    registerUser: async (req, res) => {
        try {
            const user = await prisma.users.create({
                data: {
                    name: req.body.name,
                    email: req.body.email,
                    password: req.body.password
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
                data: profile
            })
        } catch (error) {
            return res.json({
                data: error
            })
        }
    },

    getUser: async (req, res) => {
        const userData = await prisma.users.findMany();
        return res.json({
            data: userData
        });
    },

    getUserById: async (req, res) => {
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

        return res.json({
            data: userData,
            profile: profileData
        });
    },

    updateUser: async (req, res) => {
        const userData = await prisma.users.update({
            data: {
                name: req.body.name,
                email: req.body.email,
                password: req.body.password
            },
            where: {
                id: parseInt(req.params.userId)
            }
        })

        const profileData = await prisma.profiles.update({
            data: {
                identity_number: req.body.identity_number,
                identity_type: req.body.identity_type,
                address: req.body.address
            }, 
            where: {
                user_id: parseInt(req.params.userId)
            }
        })

        return res.json({
            data: userData,
            profile: profileData
        });
    },

    deleteUser: async (req, res) => {
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

        return res.json({
            data: userData,
            profile: profileData
        });
    },
}