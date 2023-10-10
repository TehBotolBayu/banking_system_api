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
                        connect: {id: user_id}
                    }
                }
            })
    
            return res.json({
                data: account
            })
        } catch (error) {
            return res.json({
                data: error
            })            
        }
    },

    getAccounts: async (req, res) => {
        const accounts = await prisma.bank_accounts.findMany();
        return res.json({
            data: accounts
        });        
    },

    getAccountById:  async (req, res) => {
        const accountData = await prisma.bank_accounts.findUnique({
            where: {
                id: parseInt(req.params.accountId)
            }
        })

        return res.json({
            data: accountData
        });
    }
}

