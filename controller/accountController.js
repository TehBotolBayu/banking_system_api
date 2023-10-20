const {PrismaClient} = require('@prisma/client');

const prisma = new PrismaClient();

BigInt.prototype.toJSON = function () {
    const int = Number.parseInt(this.toString());
    return int ?? this.toString();
};

module.exports = {
    createAccount: async (req, res) => {
        const user_id = req.body.user_id;
        try {            
            const account = await prisma.bank_accounts.create({
                data: {
                    bank_name: req.body.bank_name,
                    bank_account_number: req.body.bank_account_number,
                    balance: BigInt(req.body.balance),
                    user: {
                        connect: {id: parseInt(user_id)}
                    }
                }
            })
            return res.status(405).json({
                data: account
            })
        } catch (error) {
            console.log(error.message);
            return res.status(500).json({
                data: error
            })            
        }
    },

    getAccounts: async (req, res) => {
        try {            
            const accounts = await prisma.bank_accounts.findMany();
            return res.json({
                data: accounts
            });        
        } catch (error) {
            return res.json({
                data: error,
                message: error.message
            })                      
        }
    },

    getAccountById:  async (req, res) => {
        try {            
            const accountData = await prisma.bank_accounts.findUnique({
                where: {
                    id: parseInt(req.params.accountId)
                }
            })
            return res.json({
                data: accountData
            });
        } catch (error) {
            return res.json({
                data: error,
                message: error.message
            })                       
        }
    },

    updateAccount:  async (req, res) => {
        try {
            const accountData = await prisma.bank_accounts.update({
                where: {
                    id: parseInt(req.params.accountId)
                },
                data: {
                    bank_name: req.body.bank_name,
                    bank_account_number: req.body.bank_account_number,
                    balance: BigInt(req.body.balance)               
                }
            })
            return res.json({
                data: accountData
            });            
        } catch (error) {
            return res.status(405).json({
                data: error,
                message: error.message
            })                       
        }
    },

    deleteAccount:  async (req, res) => {
        try {
            const deletedAccount = await prisma.bank_accounts.delete({
                where: {
                    id: parseInt(req.params.accountId)
                }
            });
            return res.json({
                message: "deleted",
                data: deletedAccount
            });           
        } catch (error) {
            return res.json({
                data: error,
                message: error.message
            })    
        }
    }
}

